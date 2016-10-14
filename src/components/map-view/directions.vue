<template>
    
    <!-- <div class="typeahead"> -->

      <div id='map-directions'></div>

    <!-- </div> -->


</template>
<script>

import MapboxClient from 'mapbox'

var map_directions;

export default {
  name: "Directions",
  vuex: {
    getters: {
      publicCalls: state => state.publicCalls
    }
  },
  data () {
    return {
      
    }
  },
  ready(){

    // setTimeout(function () {

      mapboxgl.accessToken = 'pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg';
      var mapboxClient = new MapboxClient('pk.eyJ1Ijoic3BhdGlhbGRldiIsImEiOiJKRGYyYUlRIn0.PuYcbpuC38WO6D1r7xdMdA');

      map_directions = new mapboxgl.Map({
        container: 'map-directions',
        style: 'mapbox://styles/mapbox/streets-v8'
      });

      map_directions.addControl(new mapboxgl.Directions());
        
      // }, 1000)

      
  },
  computed: {
    
  },
  methods: {
    
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
.typeahead {
  position: relative;


}

#map-directions { 
  position:absolute; 
  top:0; 
  bottom:0; 
  width:100%; 
}

.mapboxgl-canvas{
  left: 0;
  right: 0;
}





</style>
