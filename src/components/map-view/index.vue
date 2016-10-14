<template>

    <div class="notification is-primary" v-show="showErrorMsg">
      <button class="delete" @click="closeErrorMessage"></button>
      Ay caramba! There was an error. Try again.
    </div>

    <div class="notification is-primary" v-show="showTooZoomedOutMsg">
      <button class="delete" @click="closeTooZoomedOutMessage"></button>
      Oops! Zoom in some more or search for a location. Try again!!
    </div>

    <!-- <ui-alert text="Loading map" :show="mapHasNotLoaded"></ui-alert> -->

    <!-- <div v-show="mapHasNotLoaded">Loading map</div> -->

    <!-- <div class="spinner" v-show="mapHasNotLoaded"></div> -->

    <div class="sideBarMenu">
      
      <aside class="menu">
        <ul class="menu-list">
        <h2 class="section-heading"><strong><span class="leapGreen">Leap</span><span class="leapBlue">&nbsp;Spot</span><span class="leapGreen">&nbsp;Leap</span></strong><br> 
        <!-- <small>through wikipedia articles </small></h2> -->
          <p>Created by <a href="https://twitter.com/rrlara" target="_blank" style="color: #4fc08d; font-size: 16px">Rene Rodriguez</a></p>
          <!-- <li><a href="#">Invitations</a></li>
          <li><a href="#">Authentication</a></li> -->
          <div style="padding: 20px;">
          <p>A simple way to look up wikipedia articles near you. Or simply navigate to a place and find interesting information.</p>

          <p>To get more granular wikipedia articles, try to zoom in to your area of interest. There is a 250 article limit per search.</p>
          
          <p class="love" style="padding-top: 20px;">Made with <i class="fa fa-heart" aria-hidden="true"></i> using Vue.js</p>
          

          </div>
        </ul>
      </aside>

    </div>

    <div class="spinner" v-show="mapHasNotLoaded && !showHome" v-cloak>
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <div class='fullscreenDiv' v-show="mapHasNotLoaded && !showHome" v-cloak>
        <div class="center">
        <!-- <small>Welcome to</small><br> -->
        <strong><span class="leapGreen">Leap</span><span class="leapBlue">&nbsp;Spot</span><span class="leapGreen">&nbsp;Leap</span></strong><br>
          <!-- <small>loading...</small> -->
          <small class="saving">Exploring &nbsp;<span>.</span><span>.</span><span>.</span></small>
        </div>
    </div>​

  <div class="map-view" :class="{'layout-blur': isSearching || showModalInfo || showFavorites || showShare || mapHasNotLoaded || showHome}">

  <map></map>

  <div class="menuButton rightIcons" @click="toggleSidebar">
    <i class="fa fa-bars" aria-hidden="true" v-show="!showSidebar"></i>
    <i class="fa fa-times" aria-hidden="true" v-else></i>
  </div>

  <div class="searchButton rightIcons" @click="toggleSearch" v-show="hideStuff">
    <i class="fa fa-search" aria-hidden="true"></i>
  </div>

  <div class="shareButton rightIcons" @click="toggleShare" v-show="hideStuff">
    <i class="fa fa-share-alt" aria-hidden="true"></i>
  </div>

  <div class="favoritesButton rightIcons" @click="toggleFavorites" v-show="hideStuff">
    <i class="fa fa-bookmark" aria-hidden="true" :class="{activeFavorites: favCount}"></i>
  </div>

    
  </div>
</template>

<script>
import map from "./map"

import { toggleError, toggleSidebar, toggleTooZoomedOut, toggleSearch, toggleFavorites, toggleShare } from '../../vuex/actions'

export default {
  name: "Map-View",
  components:{
            // category,
            map,
            // sidebar,
  },
  vuex: {
    getters: {
      isSearching: state => state.isSearching,
      directionMode: state => state.directionsMode,
      showModalInfo: state => state.showModal,
      showFavorites: state => state.showFavorites,
      showShare: state => state.showShare,
      showErrorMsg: state => state.showError,
      showTooZoomedOutMsg: state => state.showTooZoomedOut,
      mapHasNotLoaded: state => state.mapHasNotLoaded,
      showHome: state => state.showHome,
      showSidebar: state => state.sidebarShow,
      favoritesList: state => state.favoritesList
    },
    actions:{
      toggleError,
      toggleSidebar,
      toggleTooZoomedOut,
      toggleSearch,
      toggleFavorites,
      toggleShare
    }
  },
  computed: {
    favCount: function (){
      var self = this;
      return this.favoritesList.length;
    },
    hideStuff: function() {
      if (this.showShare || this.isSearching || this.showFavorites){
        return false
      }else{
        return true
      }
    }
  },
  ready (){

    // console.log("width: ", document.documentElement.clientWidth);

    // var initialWidth= document.documentElement.clientWidth

    // var self = this;

    // if (initialWidth > 767){

    //     setTimeout(function () {
    //       self.toggleSidebar();
    //     }, 200)
    // }

  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello Map!'
    }
  },
  methods: {
    closeErrorMessage (){
        var self = this;
        self.toggleError();
    },
    closeTooZoomedOutMessage(){
        var self = this;
        self.toggleTooZoomedOut();
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

[v-cloak] .v-cloak--hidden{
  display: none;
}

.leapGreen{
  color: #4fc08d;
  font-size: 28px;
}
.leapBlue{
  /*color: #35495C;*/
  color: #fff;
  font-size: 20px;
}

.center {
    position: fixed; /* or absolute */
    top: 50%;
    left: 50%;
  /* bring your own prefixes */
    transform: translate(-50%, -50%);
    z-index: 1000;
    text-align: center;
}​

.map-view {
    position: absolute;
    top: 0;
    left: 0;
    bottom:0;
    right:0;
    z-index: 0;
    background-color: gray;
}
.map-view #map {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 0;
    background-color: gray;
}
.layout-blur {
    -webkit-filter: blur(2px);
  -moz-filter: blur(2px);
  -o-filter: blur(2px);
  -ms-filter: blur(2px);
    filter: blur(2px);
    /*@include transition (all 0.4s linear);*/
    /*transition: 0.4s -webkit-filter linear;*/
    transition: 0.4s filter linear;
    -webkit-transition: 0.4s -webkit-filter linear;
    -moz-transition: 0.4s -moz-filter linear;
    -ms-transition: 0.4s -ms-filter linear;
    -o-transition: 0.4s -o-filter linear;
}



.modal-mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255,255, .8);
    display: table;
    transition: opacity .16s linear;
}

.modal-wrapper {
    display: table-cell;
    vertical-align: middle;
}

.modal-container {
    max-width: 480px;
    margin: 0px auto;
    padding: 1.5rem 2rem 1.8rem 2rem;
    background-color: #fff;
    border-radius: 5px;
    box-shadow: 0 0 10px #C5C5C5;
    transition: all .12s ease-in;
}

.modal-header {
    position: relative;
}




.modal-full {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    right: 0;
    height: 100%;
    
    transition: opacity .12s linear;
}

.modal-close {
    /*background-color:lime;*/
    height: 25px;
    width: 25px;
    position: absolute;
    top: 50%;
    right: 0;
    transform: translate(0, -50%);
    &:hover {
        cursor: pointer;
        span {
            background-color: red;
        }
    }
    span {
        position: absolute;
        Z-index: 1;
        width: 2px;
        height: 28px;
        top: -1px;
        margin-left: 12px;
        background-color: blue;
        transition: all .12s linear;
        display: block;
        &:first-child {
            transform: rotate(45deg);
        }
        &:last-child {
            transform: rotate(135deg);
        }
    }
}

.modal-body {
    padding: 1rem 0 2rem 0;
}

.modal-default-button {
    float: right;
}

// Vue generated transition styles

.modal-enter, .modal-leave {
    opacity: 0;
}

.modal-enter .modal-container,
.modal-leave .modal-container {
    -webkit-transform: scale(0.7);
    transform: scale(0.7);
    opacity: 0;
}

.modal-enter .modal-full-wrapper,
.modal-leave .modal-full-wrapper {
    -webkit-transform: scale(0.95);
    transform: scale(0.95);
    opacity: 0;
}

.ui-alert{
    position: relative;
    z-index: 100;
}
.ui-alert-text{
    color: #ffffff;
}

.ui-alert-body.error {
    background-color: rgba(0, 0, 0, 0.5);
}
.ui-alert-body{
    margin: 0 auto;
    width: 190px;
}

.ui-alert .ui-alert-close-button {
    -webkit-flex-shrink: 0;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    margin-right: -8px;
    margin-top: -4px;
    margin-bottom: -4px;
    color: rgba(255,255,255,1);
    margin-left: 8px;
}

.ui-alert .ui-alert-close-button .ui-icon {
    font-size: 22px;
    margin: 0;
    font-weight: bolder;
}

/*.spinner {
  width: 40px;
  height: 40px;
  margin: auto;
  background-color: #4fc08d;

  border-radius: 100%;  
  -webkit-animation: sk-scaleout 1.0s infinite ease-in-out;
  animation: sk-scaleout 1.0s infinite ease-in-out;
}

@-webkit-keyframes sk-scaleout {
  0% { -webkit-transform: scale(0) }
  100% {
    -webkit-transform: scale(1.0);
    opacity: 0;
  }
}

@keyframes sk-scaleout {
  0% { 
    -webkit-transform: scale(0);
    transform: scale(0);
  } 100% {
    -webkit-transform: scale(1.0);
    transform: scale(1.0);
    opacity: 0;
  }
}*/

.spinner {
  width: 40px;
  height: 40px;
  position: absolute;
  margin: auto;
  top: 40%;
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

.saving{
  color: #fff;
}

.saving span {
  /*font-size: 50px;*/
  animation-name: blink;
  animation-duration: 1.4s;
  animation-iteration-count: infinite;
  animation-fill-mode: both;
  color: #fff;
}

.saving span:nth-child(2) {
  animation-delay: .2s;
}

.saving span:nth-child(3) {
  animation-delay: .4s;
}

@keyframes blink {
  0% {
    opacity: .2;
  }
  20% {
    opacity: 1;
  }
  100% {
    opacity: .2;
  }
}

.menuButton{
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 100;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color: #000; 
  
}
.menuButton i {
    left: 11px;
    position: absolute;
    font-size: 20px;
    top: 10px;
    color: #fff;
}
.menuButton button{
  background-color: #4fc08d !important;
}

.searchButton{
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  /*background-color: #000; */
  background-color:rgba(192,192,192,0.3);
  border: 1px solid #fff;  
}
.searchButton i {
    left: 7px;
    position: absolute;
    font-size: 20px;
    top: 7px;
    color: #fff;
}
.searchButton button{
  background-color: #4fc08d !important;
}

.shareButton{
  position: absolute;
  top: 140px;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  /*background-color: #000; */
  background-color:rgba(192,192,192,0.3);
  border: 1px solid #fff;  
}
.shareButton i {
    left: 7px;
    position: absolute;
    font-size: 20px;
    top: 7px;
    color: #fff;
}
.shareButton button{
  background-color: #4fc08d !important;
}

.sideBarMenu{
  position: absolute;
  left: 0px;
  width: 300px;
  height: 100%;
  background-color: gray;
  color: #fff;
}




/*@media (min-width: 667px) {
  .searchButton{
    right: 250px;
  }
    
}*/

aside{
  margin-top: 65px;
}

.menu{
  padding: 20px;
}

.menu-list small{
  position: absolute;
}

.favoritesButton{
  position: absolute;
  top: 80px;
  right: 20px;
  z-index: 100;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  /*background-color: #000; */
  background-color:rgba(192,192,192,0.3);
  border: 1px solid #fff;  
}
.favoritesButton i {
    left: 9px;
    position: absolute;
    font-size: 20px;
    top: 7px;
    color: #fff;
}
.favoritesButton button{
  background-color: #4fc08d !important;
}

.activeFavorites{
  color: #4fc08d !important;
}
.badge {
   font-size: 0.75em;
    display: block;
    position: absolute;
    top: -11px;
    width: 28px;
    height: 1.5em;
    line-height: 1.5em;
    border-radius: 50%;
    text-align: center;
    color: red;
    /* background: rgba(0,0,0,0.3); */
    /* background: rgba(0,0,0,0.3); */
}

.map-view .rightIcons{
  cursor: pointer;
}

.notification.is-primary {
    background-color: #4fc08d;
    color: #fff;
    z-index: 1;
    position: relative;
    width: 215px;
    margin: auto;
}




</style>
