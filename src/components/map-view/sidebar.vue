<template>
    
    <div class="map-sidebar" :class="{'activeSidebar': showSidebar }">
    
        <a class="map-sidebar-home-btn v-link-active" @click="toggleFavorites()"><i class="fa fa-bookmark" aria-hidden="true" :class="{activeFavorites: favCount}"><span class="badge">{{favCount}}</span></i></a>
        <a class="map-sidebar-toggle-btn" @click="toggleSidebar"><i class="fa fa-list" :class="{'activeSidebar': showSidebar }"></i></a>
        <a class="map-sidebar-geo-btn" @click="getMyLocation(), showSpinner = true">
            <i class="fa fa-location-arrow" :class="{'activeLocation': foundMe }" v-if="!showSpinner"></i>
            <i class="fa fa-spinner rotating" v-else></i>
            <i class="fa fa-exclamation" aria-hidden="true" style="display: none;"></i>
        </a>
        
        <section class="section section-ui-tabs">
        <h2 class="section-heading"><strong><span class="leapGreen">Leap</span><span class="leapBlue">&nbsp;Spot</span><span class="leapGreen">&nbsp;Leap</span></strong><br> <small>through wikipedia articles </small></h2>

        <p>Created by <a href="https://twitter.com/rrlara" target="_blank" style="color: #4fc08d; font-size: 16px">Rene Rodriguez</a></p>


        <!-- <h3>Seattle</h3> -->

        <div class="demo">

            <ui-tabs type="icon" fullwidth>
                <ui-tab icon="error_outline">
                    <div class="group">

                    <p>A simple way to look up wikipedia articles near you. Or simply navigate to a place and find interesting information.</p>

                    <p>To get more granular wikipedia articles, try to zoom in to your area of interest. There is a 250 article limit per search.</p>
                    
                    </div>
                    
                    
                </ui-tab>
                <!-- <hr> -->

                <ui-tab icon="build">
                  <h3>todos</h3>
                  - Add filters to search<br>

                  <ui-button color="default" text="Reset" style="margin: 10px;" 
                  @click="resetLocalStorage"
                  ></ui-button>
                    
                </ui-tab>
            </ui-tabs>

      </div>
      </section>
    
    </div>

</template>
<script>

import { getMyLocation,toggleSidebar, updatedBasemap, filterCalls, toggleFavorites } from '../../vuex/actions'

import { UiTabs, UiTab, UiSwitch, UiButton } from 'keen-ui';

export default {
  name: "SideBar",
  components:{
            UiTabs,
            UiTab,
            UiSwitch,
            UiButton
  },
  vuex: {
    getters: {
      myLocation: state => state.myLocation,
      showSidebar: state => state.sidebarShow,
      foundMe: state => state.foundMe,
      showLocationError: state => state.showLocationError,
      favoritesList: state => state.favoritesList
  },
    actions: {
      getMyLocation,
      toggleSidebar,
      updatedBasemap,
      filterCalls,
      toggleFavorites
    }
  },
  computed: {
    favCount: function (){
      var self = this;
      return self.favoritesList.length;
    }
  },
  data () {
    return {
      showSpinner: false,
      activeLayers: ["active", "closed"],
      resetSpinner: false
    }
  },
  watch: {
    'myLocation': function(){
      this.showSpinner = false;
    },
    'showLocationError': function(){
      if (this.showLocationError) {
        this.showSpinner = false;
      }
    },
    // 'activeLayers': function(){
    //   var self = this;
    //   self.filterCalls(this.activeLayers);

    // }
  },
  methods: {

    resetLocalStorage(){
      this.resetSpinner = true;
      localStorage.removeItem('launchLocation');
      localStorage.removeItem('savedPlaces');
      localStorage.removeItem('favorites');
      localStorage.removeItem('exploreLocations');

      // this.showSpinner = false;


      }

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

/*.badge {
   font-size: 0.75em;
    display: block;
    position: absolute;
    top: 0.05em;
    right: 0.05em;
    width: 1.5em;
    height: 1.5em;
    line-height: 1.5em;
    border-radius: 50%;
    text-align: center;
    color: #fff;
}*/

hr {
    display: block;
    height: 1px;
    margin: 1em 0;
    border-top: 1px dotted grey!important;
}

.map-view .map-sidebar {
    position: fixed;
    top: 0;
    left: -260px;
    width: 320px;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    z-index: 1;
    color: #fff;
    padding: 20px
}

.map-view .map-sidebar .map-sidebar-geo-btn, .map-view .map-sidebar .map-sidebar-home-btn, .map-view .map-sidebar .map-sidebar-toggle-btn {
    height: 65px;
    width: 50px;
    background-color: rgba(0, 0, 0, 0.5);
    right: -50px;
    color: #fff;
    line-height: 65px;
    font-size: 24px;
    position: absolute;
    text-align: center;
    cursor: pointer;
    // border-left: 1px #000 solid;
}

.map-view .map-sidebar .map-sidebar-toggle-btn {
    top: 70px
}

.map-view .map-sidebar .map-sidebar-home-btn {
    top: 0
}

.map-view .map-sidebar .map-sidebar-geo-btn {
    top: 140px
}

.map-view .map-sidebar {
    position: fixed;
    top: 0;
    left: -260px;
    width: 220px;
    background-color: rgba(0, 0, 0, 0.5);
    height: 100%;
    z-index: 1;
    color: #fff;
    padding: 20px;
    -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);

}

.map-view .activeSidebar {
    left: 0px;
    -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
}

.activeLocation{
  color: #009ACD;
}

.activeSidebar{
  color: #4fc08d;
}

.activeFavorites{
  color: #4fc08d;
}


.group p{
  padding-bottom: 10px;
}

@-webkit-keyframes rotating {
    from {
        -ms-transform: rotate(0);
        -moz-transform: rotate(0);
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }
    to {
        -ms-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@-moz-keyframes rotating {
    from {
        -ms-transform: rotate(0);
        -moz-transform: rotate(0);
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }
    to {
        -ms-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

@keyframes rotating {
    from {
        -ms-transform: rotate(0);
        -moz-transform: rotate(0);
        -webkit-transform: rotate(0);
        transform: rotate(0)
    }
    to {
        -ms-transform: rotate(360deg);
        -moz-transform: rotate(360deg);
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg)
    }
}

.rotating {
    -webkit-animation: rotating 1s linear infinite;
    -moz-animation: rotating 1s linear infinite;
    animation: rotating 1s linear infinite
}

</style>
