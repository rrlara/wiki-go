<template>


    
<div class="share clearfix">

    <div class="textContainer">
      <span class="previousPlaceText">Share your experience</span>
    </div>
    <div class="shareListContainer">
      <ul>

          <li v-twitter>
              <span class="name"><i class="fa fa-twitter" aria-hidden="true"></i> twitter</span>
          </li>
          <li :class="" v-facebook>
              <span class="name"><i class="fa fa-facebook" aria-hidden="true"></i> facebook</span>
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

var favMap;


export default {
  name: "share",
  // mixins: [VueshareMixin],
  vuex: {
    getters: {
      publicCalls: state => state.publicCalls,
      previousSearch: state => state.recentSearch,
      shareList: state => state.shareList,
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
  },
  data () {
    return {
      current: -1,
      loading: false,
      activeFavMap: false,
      activeFav: null,
      shareList: ["twitter", "facebook"]
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
                  zoom: 10,
                });

      }

      


    }


  },
  computed: {
    favList: function (){
      var self = this;
      return self.shareList;
    },
    hasItems () {
      var self = this;
      return this.shareList.length > 0
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



.share {
  position: relative;
  height: calc(100% - 35px);
}

.shareListContainer{
  height: calc(100% - 207px);
  overflow: auto;
  width: 100%;
}


.fa-times {
  cursor: pointer;
}

.share .delete i{
  position: relative;
  right: -4px;
  top: -30px
}


.share i {
  margin-right: 15px;
}

.share ul {
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

.share li {
  padding: 20px 26px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.share li:first-child {
  border-radius: 4px 4px 0 0;
}

.share li:last-child {
  border-radius: 0 0 4px 4px;
  border-bottom: 0;
}

.share span {
  display: block;
  color: #2c3e50;
}

.share .active {
  background-color: #4fc08d;
}

.share .active span {
  color: white;
}

.share .name {
  font-weight: 700;
  font-size: 18px;
}

.share .screen-name {
  font-style: italic;
}

.textContainer{
  height: 36px;
}

.previousPlaceText{
  padding: 5px;
  float: left;
  color: #fff !important;
}

.clearAll{
  float: right;
  padding: 5px;
}









</style>
