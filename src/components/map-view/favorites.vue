<template>


    
<div class="favorites clearfix">

    <div class="favMapWrapper" :class="{activeMap: activeFavMap && hasItems}">
      <div id="favMap"></div>
    </div>

    <div class="textContainer">
      <span class="previousPlaceText">Favorites</span>
      <span class="clearAll" @click="clearAllFavorite()" style="cursor: pointer;">Clear all</span>
    </div>
    <div class="favListContainer">
      <ul v-show="hasItems">
          <li v-for="item in favList" :class="activeClass(item)" @click="makeFavMapActive(), hit(item)"
          v-touch:swipe="deleteFavorite($index), deleteFav()"
          v-touch-options:swipe="{ direction: 'horizontal' }"
          >
              <span class="name">{{item.properties.label.value}}</span>
              <span class="screen-name" ><a href="{{item.properties.link.value}}" target="_blank">wikipedia link</a> &nbsp;<span v-if="foundMe" class="distIndicator">{{updateDistances(item)}} away</span></span>
              <span class="close-name"
              @click="deleteFavorite($index), deleteFav()">Delete</span>
          </li>
      </ul>
    </div>

</div>


</template>
<script>

import { searchChangeLocation, 
        isSearching, 
        resetWikiData, 
        saveSearchPlace, 
        fecthRecentSearch,
        deleteFavorite,
        clearAllFavorite

         } from '../../vuex/actions'

import Distance from '../../lib/Distance'

import MapboxClient from 'mapbox'

var favMap;


export default {
  name: "Favorites",
  // mixins: [VuefavoritesMixin],
  vuex: {
    getters: {
      publicCalls: state => state.publicCalls,
      previousSearch: state => state.recentSearch,
      favoritesList: state => state.favoritesList,
      myLocation: state => state.myLocation,
      foundMe: state => state.foundMe
    },
    actions:{
      searchChangeLocation,
      isSearching,
      resetWikiData,
      saveSearchPlace,
      fecthRecentSearch,
      deleteFavorite,
      clearAllFavorite
    }
  },
  ready(){
    var self = this; 

    mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg';

    favMap = new mapboxgl.Map({
        container: 'favMap',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [-122.8,47.6],
        zoom: 10

    });

    // disable map rotation using right click + drag
    favMap.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    favMap.touchZoomRotate.disableRotation();

    favMap.on('style.load', function () {

          favMap.addSource('favPoint', {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": []
              }
            });

          favMap.addLayer({
              "id": "favPoint",
              "source": "favPoint",
              "type": "circle",
              "paint": {
                "circle-radius": 7,
                "circle-color": "#4fc08d"
              }
            }); 

      }); 


    
  },
  data () {
    return {
      limit: 5,
      src: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
      onHit (item) {
        window.location.href = 'http://twitter.com/' + item.screen_name
      },
      items: [],
      query: '',
      current: -1,
      loading: false,
      activeFavMap: false,
      activeFav: null
    }
  },
  watch:{

    'activeFav': function(){


      if (this.activeFav == null){
        favMap.getSource('favPoint').setData({
                          "type": "FeatureCollection",
                          "features": []
                        });
      }else{

        var self = this;
      
      var point = {
            "type": "Point",
            "coordinates": [self.activeFav.geometry.coordinates[0], self.activeFav.geometry.coordinates[1]]
          };

          favMap.getSource('favPoint').setData(point);

          favMap.panTo([self.activeFav.geometry.coordinates[0], self.activeFav.geometry.coordinates[1]],
                {
                  zoom: 12,
                });

      }

      


    }


  },
  computed: {
    favList: function (){
      var self = this;
      return self.favoritesList;
    },
    hasItems () {
      var self = this;
      return this.favoritesList.length > 0
    },
  },
  methods: {

    updateDistances: function(fav){
          var self = this;
          var callLocation = {
              latitude: fav.geometry.coordinates[1],
              longitude: fav.geometry.coordinates[0]
          }

          return Distance.getDistances(callLocation, this.myLocation) + ' mi'
        
      },

    deleteFav () {
      this.activeFav = null;
    },
  
    setActive (index) {
      this.current = index
    },

    activeClass (fav) {
      return {
        active: this.activeFav == fav
      }
    },

    hit (fav) {
    
      var self = this;

      self.activeFav = fav;

      
    },
    makeFavMapActive (){
      this.activeFavMap = true;
      favMap.resize();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

.favMapWrapper{
  height: 0px;
  width: 100%;
  background-color: gray;
  overflow: auto;
  position: relative;
  margin-top: 10px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  -webkit-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    transition: height .8s cubic-bezier(0.25, .8, .25, 1);
}

.activeMap{
  height: 150px;
  -webkit-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: height .8s cubic-bezier(0.25, .8, .25, 1);
    transition: height .8s cubic-bezier(0.25, .8, .25, 1);
}

#favMap{
  height: 150px !important;
  width: 100% !important;
  position: relative;
}


.favorites {
  position: relative;
  height: calc(100% - 35px);
}

.favListContainer{
  height: calc(100% - 207px);
  overflow: auto;
}


.fa-times {
  cursor: pointer;
}

.favorites .delete i{
  position: relative;
  right: -4px;
  top: -30px
}


.favorites i {
  float: right;
  position: relative;
  padding: 4px;
  top: 34px;
  right: 25px;
  opacity: 0.4;
}

.favorites ul {
  position: relative;
  padding: 0;
  margin-top: 8px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}

.favorites li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.favorites li:first-child {
  border-radius: 4px 4px 0 0;
}

.favorites li:last-child {
  border-radius: 0 0 4px 4px;
  border-bottom: 0;
}

.favorites span {
  display: block;
  color: #2c3e50;
}

.favorites .active {
  background-color: #4fc08d;
}

.favorites .active span {
  color: white;
}

.favorites .name {
  font-weight: 700;
  font-size: 18px;
}

.favorites .screen-name {
  font-style: italic;
}

.favorites .close-name {
  margin-top: 10px;
}


.textContainer{
  height: 36px;
}

.previousPlaceText{
  padding: 5px;
  float: left;
  color: #000 !important;
}

.clearAll{
  float: right;
  padding: 5px;
    color: #fff !important;

}

.delete{
  /*position: absolute;*/
  right: 5px;
  top: 20px;
}









</style>
