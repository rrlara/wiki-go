<template>


    
<div class="home clearfix">

    <div class="header">
      <h2>Explore the US</h2>
      <small>Discover new, inspiring places close to you.</small>
    </div>
    <div class="places" v-show="loaded" v-cloak>

      <a track-by="$index" v-for="item in items | filterBy myFilter" @click="goToCity([parseFloat(item.lng.value), parseFloat(item.lat.value)])">
          <div class="cityName">
            <strong>{{item.label.value}}, {{item.countryName.value}}</strong>
          </div>
        <figure>
          <img src="{{item.thumbnail.value | replaceHttp }}" alt="" onerror="this.src='/static/loading-spin.svg';">
          <span class="rig-text">Go</span>
        </figure>
      </a>
    </div>
    <div class="spinnerHome" v-else v-cloak>
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
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
        clearAllFavorite,
        toggleHome,
        toggleSidebar

         } from '../../vuex/actions'

export default {
  name: "Home",
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
      clearAllFavorite,
      toggleHome,
      toggleSidebar
    }
  },
  ready(){


    var initalLocation = localStorage.getItem("exploreLocations") || [];

    if(initalLocation.length == 0){
      this.fethLargestCities();
    }else{
      this.items = JSON.parse(localStorage.getItem("exploreLocations") || '[]')
      this.loaded = true;
    }    
  },
  data () {
    return {
      limit: 5,
      url: 'https://dbpedia.org/sparql/?default-graph-uri=http://dbpedia.org',
      items: [],
      query: "SELECT DISTINCT ?label ?lat ?lng ?thumbnail ?pop ?countryName WHERE {?res dbp:pushpinMap ?countryName.?res rdf:type dbo:Place .?res rdfs:label ?label .?res dbo:populationMetro ?pop .?res geo:lat ?lat. ?res geo:long ?lng. ?res dbo:thumbnail ?thumbnail.FILTER (?pop > 1000000 && lang(?label)='en' && ?countryName = 'USA'@en)}ORDER BY DESC(?pop) Limit 30",
      loaded: false
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
    fethLargestCities (){
      this.$http({
        url: this.url, 
        method: 'GET',
        type: 'jsonp',
        data: {
            query: this.query
        }
        }).then(function (response) {

          console.log("response: ", response);

          this.items = response.data.results.bindings;

          // localStorage.setItem("exploreLocations", JSON.stringify(response.data.results.bindings));

          this.loaded = true;

          }, function (response) {
          // error callback
          // alert("Error", response);
          // storeState.state.showLoader = false;

          // storeState.state.showError = true;

      });
    },
    goToCity (location){

      var loc = location;

      // loc = loc.split(" ");

      console.log(loc);

      var cityLoc = {};

      cityLoc.coordinates = []

      cityLoc.coordinates.push(parseFloat(loc[0]));
      cityLoc.coordinates.push(parseFloat(loc[1]));

      cityLoc.type = "Point"


      console.log(cityLoc);

      this.toggleHome();

      this.searchChangeLocation(cityLoc);

      this.resetWikiData();


    },
    myFilter (val, idx, arr) {

    console.log(val);

    var newArr = arr;

    for(var i = 0; i < idx; i++) {
      if(newArr){
        if(newArr[i].label.value === val.label.value) {
          return false;
        }
      }
      
    }
    return true;
  }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">



.home{
  position: relative;
  top: 0;
  width: 100%;
  bottom: 0px;
  /*background-color: gray;*/
}

.home .header{
  position: relative;
  margin: 0 auto;
  display: table;
  text-align: center;
}

.home a {
  font-size: 16px;
  overflow: hidden;
  display: inline-block;
  margin-bottom: 8px;
  width: calc(50% - 4px);
  margin-right: 8px;
  height: 150px;
  cursor: pointer;
  position: relative;
}

.home a:nth-of-type(2n) {
  margin-right: 0;
}

@media screen and (min-width: 50em) {
  .home a {
    width: calc(25% - 6px);
  }
  
  .home a:nth-of-type(2n) {
    margin-right: 8px;
  }
  
  .home a:nth-of-type(4n) {
    margin-right: 0;
  }
}

.home a:hover img {
  transform: scale(1.15);
  /*-webkit-filter: blur(5px);
  filter: blur(5px);*/
}

.home figure {
  margin: 0;
  position: relative;
}

.home img {
  border: none;
  width: 100%;
  height: 200px;
  display: block;
  background: #ccc;
  transition: transform .2s ease-in-out;
  filter: brightness(70%);
  -webkit-filter: brightness(70%);
}

.home .p a {
  display: inline;
  font-size: 13px;
  margin: 0;
}

.home .p {
  text-align: center;
  font-size: 13px;
  padding-top: 100px;
}

.home .cityName{
  position: absolute;
    width: 100%;
    z-index: 100;
    color: #fff;
    text-align: center;
    font-size: 16px;
    margin-top: 10px;
}

.home .rig-text {
    display:block;
    padding:0 30px;
    box-sizing:border-box;
    position:absolute;
    left:0;
    width:100%;
    text-align:center;
    text-transform:capitalize;
    font-size:24px;
    font-weight:bold;
    font-weight:normal!important;
    top:40%;
    color:white;
    opacity:0;
    filter:alpha(opacity=0);/*For older IE*/
    transform:translateY(-20px);
    transition:all .3s;
    z-index: 100;
}

.spinnerHome {
  width: 40px;
  height: 40px;
  position: absolute;
  margin: auto;
  top: 125%;
  left: 50%;
  /* bring your own prefixes */
    transform: translate(-50%, -50%);
    z-index: 100;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #4fc08d;
  opacity: 1;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}










</style>
