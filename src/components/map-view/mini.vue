<template>


    
<div id="miniMapContainer">
  <div class="whiteMask"></div>
  <div class="imagePointer" :class="{orale: showPointer}"></div>
  <div id="miniMap" style="width: 100%; height: 150px;"
  :class="{showMap: showMap}"
  ></div>
</div>

</template>

<script type="text/javascript">
  // import MapboxClient from 'mapbox'

  var minMap;

  export default {
  name: "Mini",

  props: {
    location: []
  },

  data (){
    return{
      zoom: 13,
      showMap: false,
      showPointer: false

    }
    
  },

  ready(){

    var self = this;


    console.log("location", this.location);

    var currLocation = this.location;

    // mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg';

    minMap = new mapboxgl.Map({
        container: 'miniMap',
        style: 'mapbox://styles/mapbox/light-v9',
        center: [this.location[0],this.location[1]],
        zoom: 11,
        interactive: false

    });

    minMap.on('style.load', function () {



      // console.log("orale: ", currLocation);

          minMap.addSource('minPoint', {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": []
              }
            });
          minMap.addSource('minPoint-outer', {
              "type": "geojson",
              "data": {
                "type": "FeatureCollection",
                "features": []
              }
            });

          minMap.addLayer({
                  "id": 'minPoint-outer',
                  "source": "minPoint-outer",
                  "type": "circle",
                  "paint": {
                    "circle-radius": 8,
                    "circle-color": '#ffffff'
                  }
                });

          minMap.addLayer({
              "id": "minPoint",
              "source": "minPoint",
              "type": "circle",
              "paint": {
                "circle-radius": 7,
                "circle-color": "#4fc08d"
              }
            }); 

      });

      minMap.on('load', function () {
        
        // console.log("miniMap has been loaded:");
        var point = {
            "type": "Point",
            "coordinates": [currLocation[0], currLocation[1]]
          };

        minMap.getSource('minPoint-outer').setData(point);
        minMap.getSource('minPoint').setData(point);
        minMap.resize();

        self.showMap = true;
        self.showPointer = true;

      }); 

      minMap.on('render', function () {
        // self.showPointer = true;
      });

    

  }

  

  }
</script>

<style lang="css">

  #miniMapContainer{
    width: 100%;
    height: 100%;
    position: relative;
  }
  
  #miniMap{
    position: relative;
    /*height: 100px !important;
    width: 100% !important;*/
    opacity: 0;
  }

  .showMap{
    opacity: 1 !important;
  }



  .whiteMask {

    height: 80px;
    width: 100%;
    position: absolute;
    bottom:0px;
    z-index: 1;
    background: rgba(255,255,255,0); /* For browsers that do not support gradients */
    background: -webkit-linear-gradient(bottom,rgba(255,255,255,0),rgba(255,255,255,1)); /*Safari 5.1-6*/
    background: -o-linear-gradient(top,rgba(255,0,0,0),rgba(255,0,0,1)); /*Opera 11.1-12*/
    background: -moz-linear-gradient(top,rgba(255,0,0,0),rgba(255,0,0,1)); /*Fx 3.6-15*/
    background: linear-gradient(top, rgba(255,255,255,0), rgba(255,255,255,1)); /*Standard*/

  }

  .imagePointer{
    position: absolute;
    top: 0px;
    left: 49.7%;
    background-color: #4fc08d;
    width: 2px;
    z-index: 1;
    left: 49.8%;
    height: 0px;
    -webkit-transition: height 1s;
    transition: height 1s;
  }

 .orale {
    height: 67px;
  }

</style>