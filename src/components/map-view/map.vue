<template>

    <div class="search"></div>


    
    <div id="map"  class="map" :class="{'sideBarActive': showSidebar }">

        
    
    <list></list>

    <div id="findWikis" class="findWikis" v-show="publicCalls == null" @click="getData()" :class="{'activeFindWikisButton': showSidebar }">
    <button class="ui-button ui-button-normal color-warning ui-button-raised"> <div class="ui-button-content">  <div class="ui-button-text"> FIND WIKI ARTICLES IN THIS AREA</div>  </div> <div class="ui-progress-circular ui-button-spinner v-transition" style="display: none; width: 18px; height: 18px;"> <svg class="ui-progress-circular-indeterminate" viewBox="25 25 50 50" role="progressbar" aria-valuemin="0" aria-valuemax="100"> <circle class="ui-progress-circular-indeterminate-path white" cx="50" cy="50" r="20" fill="none" stroke-miterlimit="10" stroke-width="4.5"> </circle></svg>  </div>
    </button>

    </div>

    <div class="searchAgain" @click="resetData()" v-show="publicCalls != null">
      <i class="fa fa-times" aria-hidden="true"></i>
    </div>

    </div>


</template>
<script>


import { getWikiData, toggleSidebar, updateActiveCall, getMyLocation, resetWikiData, mapLoaded } from '../../vuex/actions'

import list from "./list"

import Wiki from "../../lib/wiki"

var map;

var myMarkerLocation;

var popup;

var activeCalls = {

  'active': '#cc0000',
  'closed': '#575757'

}

export default {
  name: "Map",
  components:{
            list
  },
  data () {
    return {

      callDetails: null,
      showDetails: false
      
    }
  },
  vuex: {
    getters: {
      myLocation: state => state.myLocation,
      publicCalls: state => state.publicCalls,
      showSidebar: state => state.sidebarShow,
      activeCall: state => state.activeCall,
      satellite: state => state.satellite,
      changeLocation: state => state.changeLocation,
      showModalInfo: state => state.showModal,
      showFavorites: state => state.showFavorites,
      showShare: state => state.showShare,
      isSearching: state => state.isSearching
    },
    actions: {
      getWikiData,
      toggleSidebar,
      updateActiveCall,
      getMyLocation,
      resetWikiData,
      mapLoaded,
    }
  },
  computed: {
    hideStuff: function() {
      if (this.showSidebar || this.isSearching || this.showFavorites || this.isSearching){
        return false
      }else{
        return true
      }
    }
  },
  watch: {
    'showModalInfo': function(){
            var self = this;
            if (self.showModalInfo == false){
              this.$route.router.go("map")
            }  
    },
    'changeLocation': function(){
      var self = this;
              map.panTo([self.changeLocation.coordinates[0], self.changeLocation.coordinates[1]],
                {
                  zoom: 12,
                });
    },
        'satellite': function(){
          var self = this;
          if(self.satellite){
            map.setStyle('mapbox://styles/mapbox/dark-v8');
          }else{
            map.setStyle('mapbox://styles/mapbox/basic-v8');
          }

        },
        'myLocation': function(){
            var self = this;
            var point = {
                  "type": "Point",
                  "coordinates": [self.myLocation.longitude, self.myLocation.latitude]
                };

                    
                    if (myMarkerLocation){
                      myMarkerLocation.remove();
                    }


                    var el = document.createElement('div');
                    el.className = 'dot fill-orange';
                    el.setAttribute("id", "Dot");

                    myMarkerLocation = new mapboxgl.Marker(el)
                    .setLngLat([self.myLocation.longitude, self.myLocation.latitude])
                    .addTo(map);

                  

                // map.getSource('point-pulse').setData(point);
                // map.getSource('point-outer').setData(point);
                // map.getSource('point').setData(point);

                

              
                  map.flyTo({
                    center: [self.myLocation.longitude,self.myLocation.latitude],
                    zoom: 12,
                    offset: [0, -100]
                    });

        },
        'publicCalls': function(){
          var self = this;

          

            if(this.publicCalls == null){
              self.showDetails = false;

              map.getSource('call-points').setData({
                          "type": "FeatureCollection",
                          "features": []
                        });

              if(popup){
                popup.remove();
              }
              

            }else{

              var currentZoom = map.getZoom();

              map.setZoom(currentZoom - .5);

              self.showDetails = true;

              map.addLayer({
                  "id": 'wiki-outer',
                  "source": "call-points",
                  "type": "circle",
                  "paint": {
                    "circle-radius": 10,
                    "circle-color": '#ffffff',
                    "circle-opacity": 0.1
                  }
                });

              map.addLayer({
                    "id": 'wiki',
                    "source": "call-points",
                    "type": "circle",
                    "paint": {
                      "circle-radius": 5,
                      "circle-color": '#ffffff'
                    }
                  });


              // 
              // Hightlights
              map.addLayer({
                  "id": 'wiki-outer-hl',
                  "source": "call-points",
                  "type": "circle",
                  "paint": {
                    "circle-radius": 14,
                    "circle-color": '#ffffff',
                    "circle-opacity": 0.8
                  },
                    "filter": ["==", "idx", ""]
                });

              map.addLayer({
                  "id": 'wiki-hl',
                  "source": "call-points",
                  "type": "circle",
                  "paint": {
                    "circle-radius": 10,
                    "circle-color": '#4fc08d'
                  },
                    "filter": ["==", "idx", ""]
                });

            // map.getSource('call-points-outer').setData(self.publicCalls);
            map.getSource('call-points').setData(self.publicCalls);


            }


            


        },
        'activeCall': function() {

          var initialWidth= document.documentElement.clientWidth

          var self = this;

          if (initialWidth < 768){

            map.panTo([this.activeCall.geometry.coordinates[0],this.activeCall.geometry.coordinates[1]], {
                // zoom: 14,
                offset: [0, -100]
                });
              
          }

          map.setFilter("wiki-outer-hl", ["==", "idx", this.activeCall.properties.idx]);
          map.setFilter("wiki-hl", ["==", "idx", this.activeCall.properties.idx]);


          if(popup){
            popup.remove();
          }

        }
  },
  ready(){
    var self = this; 

    var fixed = document.getElementById('findWikis');

    fixed.addEventListener('touchmove', function(e) {

            e.preventDefault();

    }, false);


    

    setTimeout(function () {
        // self.getWikiData(map);
      }, 1000)

    mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IkplNEFnUVUifQ.e5zd5QyoERZ2IHX0EU5pwg';

    var initalLocation = localStorage.getItem("launchLocation") || [];



    if(initalLocation.length > 0){
      var initalLocArray = initalLocation.split(",");
      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [initalLocArray[1],initalLocArray[0]],
        zoom: initalLocArray[2],
        maxBounds: [ [-180, -85], [180, 85] ]
      });

    }else{

      map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-101.8,19.6],
        zoom: 1.36,
        maxBounds: [ [-180, -85], [180, 85] ]
      });

    }


    // disable map rotation using right click + drag
    map.dragRotate.disable();

    // disable map rotation using touch rotation gesture
    map.touchZoomRotate.disableRotation();

    map.on('load', function () {
        // console.log("map has been loaded:");
        var selfself = self;
        
        selfself.mapLoaded();



          if (selfself.$route.query.article){

            map.panTo([selfself.activeCall.geometry.coordinates[0],selfself.activeCall.geometry.coordinates[1]], {
                zoom: 14,
                });

            

            selfself.getData();
            setTimeout(function () {
              map.setFilter("wiki-outer-hl", ["==", "idx", selfself.activeCall.properties.idx]);
              map.setFilter("wiki-hl", ["==", "idx", selfself.activeCall.properties.idx]);
              
              var mobileElmnt = document.getElementById("mobile-" + selfself.activeCall.properties.idx);
              mobileElmnt.scrollIntoView({block: "start", behavior: "smooth"});

            }, 2000);
            

          }

    });

    map.dragRotate.disable();

    // var mapboxClient = new MapboxClient('pk.eyJ1IjoicnJsYXJhIiwiYSI6IkplNEFnUVUifQ.e5zd5QyoERZ2IHX0EU5pwg');


    map.on('style.load', function () {

                    var self = this;

                    //MyLocation data
                    map.addSource('point-pulse', {
                        "type": "geojson",
                        "data": {
                          "type": "FeatureCollection",
                          "features": []
                        }
                      });
                    map.addSource('point', {
                        "type": "geojson",
                        "data": {
                          "type": "FeatureCollection",
                          "features": []
                        }
                      });
                    map.addSource('point-outer', {
                        "type": "geojson",
                        "data": {
                          "type": "FeatureCollection",
                          "features": []
                        }
                      });
                    
                    //PUBLIC CALL DATA
                    map.addSource('call-points', {
                      "type": "geojson",
                      "data": {
                        "type": "FeatureCollection",
                        "features": []
                      }
                    });

                }); 

                // Create a popup, but don't add it to the map yet.
                popup = new mapboxgl.Popup({
                    closeButton: false,
                    closeOnClick: false
                });

                // Use the same approach as above to indicate that the symbols are clickable
                // by changing the cursor style to 'pointer'.
                map.on('mousemove', function (e) {
                  var selfself = self;

                  if(selfself.publicCalls){
                    var features = map.queryRenderedFeatures(e.point, { layers: ['wiki-outer'] });
                    map.getCanvas().style.cursor = features.length ? 'pointer' : '';

                    if (features.length) {
                        popup.remove();
                        // return;

                        var newDiv = document.createElement('div');
                          newDiv.innerHTML = features[0].properties.idx;
                          newDiv.onclick = function () {
                              selfself.updateActiveCall(features[0]);
                              var mobileElmnt = document.getElementById("mobile-" + features[0].properties.idx);
                              mobileElmnt.scrollIntoView({block: "start", behavior: "smooth"});
                          };

                          popup.setLngLat(features[0].geometry.coordinates).setDOMContent(newDiv).addTo(map);
                    }

                    if (!features.length) {
                      popup.remove();
                    }

                    
                        
                  }
                  
                });


                map.on('click', function (e) {
                  var selfself = self;
                    // Use queryRenderedFeatures to get features at a click event's point
                    // Use layer option to avoid getting results from other layers
                    if(selfself.publicCalls){
                      var features = map.queryRenderedFeatures(e.point, { layers: ['wiki-outer'] });
                      // if there are features within the given radius of the click event,
                    // fly to the location of the click event
                    if (features.length) {
                        // Get coordinates from the symbol and center the map on those coordinates
                        // map.flyTo({center: features[0].geometry.coordinates});
                        // console.log("location of point: ", features[0].toJSON());

                        // selfself.showDetails = true;

                        // console.log("point clicked: ", features);

                        selfself.callDetails = features[0].properties;

                        // selfself.updateActiveCall(features[0]);
                        selfself.updateActiveCall(features[0]);

                        var mobileElmnt = document.getElementById("mobile-" + features[0].properties.idx);
                      

                        mobileElmnt.scrollIntoView({block: "start", behavior: "smooth"});


                        window.scrollTo( 0, 1000 );


                        if (features.length) {
                            map.setFilter("wiki-outer-hl", ["==", "idx", features[0].properties.idx]);
                            map.setFilter("wiki-hl", ["==", "idx", features[0].properties.idx]);

                            map.setFilter("wiki-pulse", ["==", "idx", features[0].properties.idx]);

                        }

                    }else{
                      // selfself.showDetails = false;
                    }
                    }
                    

                    if (selfself.showSidebar){
                      selfself.toggleSidebar();
                    }
                    

                });


                map.on('moveend', function (e){

                  var center = map.getCenter();
                  var zoom = map.getZoom();

                  // var cachingLocation 

                  

                  var saveLocation = center.lat.toFixed(3) + "," + center.lng.toFixed(3) + "," + zoom.toFixed(2);

                  try {
                      localStorage.setItem("launchLocation", saveLocation);
                      return true;
                    } catch (error) {
                      return false;
                    }

                  



                });

  




  },
  methods:{
    getData: function(){
      var self = this;
      
      self.getWikiData(map);

    },
    resetData: function(){
      this.resetWikiData()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

.map-view #map {
    position: fixed;
    top: 0;
    left: 0;
    bottom:0;
    right:0;
    z-index: 0;
    margin-left: 0px;
    background-color: gray;
    -webkit-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      -moz-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      -o-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
}

.map-view .sideBarActive{

      margin-left: 300px !important;
      -webkit-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      -moz-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      -o-transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);
      transition: margin-left .4s cubic-bezier(0.25, .8, .25, 1);

}

.findWikis{
    position: fixed;
    z-index: 100;
    width: 100%;
    bottom: 0px;
    left: 0px;
    -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
}

.activeFindWikisButton {
  /*-webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    left: 0px;*/
    display: none;

}

.findWikis button{
  margin: auto;
    width: 100%;
    position: relative;
    cursor: pointer;
    display: inline-block;
}

@media screen and (min-width: 768px) {

  .findWikis button{
    /*width: 350px;*/
    margin: auto 0;
    /*left: 0px;*/
  }

  /*.activeFindWikisButton {
  -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    left: 260px;
  }*/

  /*.findWikis{
    
    bottom: 100px;
    
  }*/
}

.findWikis .ui-button-text{
  font-size: 20px;
  color: #fff;
}
.findWikis button{
  background-color: #4fc08d !important;
  height: 50px;
}
.searchAgain{
  position: absolute;
    bottom: 170px;
    left: 20px;
    z-index: 100;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    background-color: #4fc08d;
  
}
.searchAgain i {
    left: 9px;
    position: absolute;
    font-size: 28px;
    top: 6px;
    color: #fff;
}

@media screen and (min-width: 568px) {

  .searchAgain{
      right: 265px;
    }

}




.searchAgain button{
  background-color: #4fc08d !important;
}

.dot {
  background: #009ACD;
  box-shadow: #009ACD 0 0 0 2px;
  border: 2px solid #ffffff;
  display: block;
  width: 14px;
  height: 14px;
  position: relative;
  text-align: center;
  -webkit-border-radius: 50%;
  border-radius: 50%;

  -webkit-animation:  pulse 1.5s;
  -moz-animation:     pulse 1.5s;
  -o-animation:       pulse 1.5s;
  -ms-animation:      pulse 1.5s;
  animation:          pulse 1.5s;

  -webkit-animation-iteration-count: infinite;
  -moz-animation-iteration-count: infinite;
  -o-animation-iteration-count: infinite;
  -ms-animation-iteration-count: infinite;
  animation-iteration-count: infinite;
}


@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0.8);
  }
  70% {
      -webkit-box-shadow: 0 0 0 20px rgba(0, 154, 205, 0);
  }
  100% {
      -webkit-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0);
  }
}

@-o-keyframes pulse {
  0% {
    -o-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0.8);
  }
  70% {
      -o-box-shadow: 0 0 0 20px rgba(0, 154, 205, 0);
  }
  100% {
      -o-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0);
  }
}
@-ms-keyframes pulse {
  0% {
    -ms-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0.8);
  }
  70% {
      -ms-box-shadow: 0 0 0 20px rgba(0, 154, 205, 0);
  }
  100% {
      -ms-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0.8);
    box-shadow: 0 0 0 0 rgba(0, 154, 205, 0.4);
  }
  70% {
      -moz-box-shadow: 0 0 0 30px rgba(0, 154, 205, 0);
      box-shadow: 0 0 0 20px rgba(0, 154, 205, 0);
  }
  100% {
      -moz-box-shadow: 0 0 0 0 rgba(0, 154, 205, 0);
      box-shadow: 0 0 0 0 rgba(0, 154, 205, 0);
  }
}
#team-map .dot.fill-orange {  background: #f67e64; box-shadow: #f67e64 0 0 0 2px; }

</style>