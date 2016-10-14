<template>

  <div class="directionsContainer">
  <!-- <directions></directions> -->
  <div id="map-directions">
    
    <div class="closeDirection" v-link="{ path: '/map' }">
            EXIT
     </div>

  </div>

  </div>

    
</template>

<script>

import MapboxClient from 'mapbox'


var map_directions;
var directions;

export default {
  name: "Directions-View",
  components:{
  },
  vuex: {
    getters: {
      myLocation: state => state.myLocation,
      activeCall: state => state.activeCall
    }
  },
  watch:{
    'activeCall': function(){
      var self = this;

        directions.setOrigin([self.myLocation.longitude, self.myLocation.latitude]);
        directions.setDestination([self.activeCall.geometry.coordinates[0], self.activeCall.geometry.coordinates[1]]);
    }
  },
  data () {
    return {
      
    }
  },
  ready(){
    var self = this; 

     mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg';

      var mapboxClient = new MapboxClient('pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg');

      map_directions = new mapboxgl.Map({
          container: 'map-directions',
          style: 'mapbox://styles/mapbox/streets-v8',
          center: [-122.3458,47.6039],
          zoom: 10.5
      });

      directions = new mapboxgl.Directions();

      map_directions.addControl(directions);


      map_directions.on('load', function() {
        // directions.setOrigin('Montreal Quebec');
        // directions.setDestination('Toronto');
        directions.setOrigin([self.myLocation.longitude, self.myLocation.latitude]);
        directions.setDestination([self.activeCall.geometry.coordinates[0], self.activeCall.geometry.coordinates[1]]);
      });
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
.directionsContainer{
  width: 100%;
  height: 100%;
}
.directionsContainer .map-directions {
    height: 100%;
}
.directionsContainer .map-directions #map {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
}

#map-directions  {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
}

.closeDirection{
  height: 35px;

  background-color: red;
  color: #000 !important;
  text-align: center;
}

.modal-close {
    width: 25px;
    position: relative;

    float: right;
    transform: translate(0, -50%);
    z-index:9999999999;
}
.modal-close:hover {
    cursor: pointer;
}
.modal-close:hover span {
    background-color: black;
}
.modal-close span {
    position: absolute;
    Z-index: 1;
    width: 2px;
    height: 28px;
    top: -1px;
    margin-left: 12px;
    background-color: #000;
    transition: all .12s linear;
    display: block;
}
.modal-close span:first-child {
    transform: rotate(45deg);
}
.modal-close span:last-child {
    transform: rotate(135deg);
}
</style>
