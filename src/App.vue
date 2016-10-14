<template>
  <div id="app">

    <vue-progress-bar class="progress" v-show="showPreloader"></vue-progress-bar>

    <!-- <div class="modal" :class="{'is-active': showModalImageInfo}">
      <div class="modal-background" @click="showModalImage()"></div>
      <div class="modal-content">
        <p class="image is-4by3">
          <img src="{{activeCall.properties.image.value | replaceHttp}}?width=600" v-if="showModalImageInfo">
        </p>
      </div>
    </div> -->

    

    <div class="searchingContainer" v-show="searching" transition="fade">
      <div class="closeContainer">

              <div class="searchButton" @click="toggleSearch">
                <i class="fa fa-times" aria-hidden="true"></i>
              </div>
  	   </div>
      <search></search>	
    </div>

    <div class="shareContainer" v-if="showShare" transition="fade">
      <div class="closeContainer">
              <div class="searchButton" @click="toggleShare">
                <i class="fa fa-times" aria-hidden="true"></i>
              </div>
       </div>
      <share></share> 
    </div>

    <div class="favoritesContainer" v-show="showFavorites" transition="fade">
      <div class="closeContainer">
              <div class="searchButton" @click="toggleFavorites">
                <i class="fa fa-times" aria-hidden="true"></i>
              </div>
       </div>
      <favorites></favorites> 
    </div>

    <div class="modalContainer" v-show="showModalInfo" transition="fade">
      <div class="closeContainer">
        <div slot="closeButton" class="modalClose" @click="showModal">
                  <span></span>
                  <span></span>
              </div>
      </div>
      <modal v-if="showModalInfo" :imageHeight="activeImageHeight"></modal> 
    </div>
    <router-view
      transition-mode="out-in"
      keep-alive>
    </router-view>
  </div>
</template>

<script>

import { toggleSearch, inDirectionMode, showModal, showModalImage, fecthFavorites, toggleFavorites, toggleShare, toggleHome, toggleSidebar, mapLoaded } from './vuex/actions'

import search from './components/map-view/search'
import favorites from './components/map-view/favorites'
import share from './components/map-view/share'

import home from './components/map-view/home'

import modal from './components/map-view/modal'

import modalimage from './components/map-view/modalimage'


export default {
  name: "Root",
  components:{
            search,
            modal,
            favorites,
            share,
            home,
            modalimage
  },
  data (){
    return{
      progressValue: 0,
      activeImageHeight: null
    }
  },
  vuex: {
    getters: {
      searching: state => state.isSearching,
      directionMode: state => state.directionsMode,
      showModalInfo: state => state.showModal,
      showModalImageInfo: state => state.showModalWithImage,
      showPreloader: state => state.showLoader,
      showFavorites: state => state.showFavorites,
      showShare: state => state.showShare,
      showHome: state => state.showHome,
      activeCall: state => state.activeCall

    },
    actions: {
      toggleSearch,
      inDirectionMode,
      showModal,
      showModalImage,
      fecthFavorites,
      toggleFavorites,
      toggleShare,
      toggleHome,
      toggleSidebar,
      mapLoaded
    }
  },
  watch: {

    'showPreloader': function (){
      var self = this;
      if(this.showPreloader){
        this.$Progress.start();
      }else{
        this.$Progress.finish();
      }
    },
    'activeCall': function() {

      var self = this;

      var image = new Image(); // or document.createElement('img')
      var width, height;
      image.onload = function() {
        width = this.width;
        height = this.height;
        console.log("image: ", height);
        self.activeImageHeight = height;
      };
      image.src = self.activeCall.properties.image.value + "?width=600";
    }
  },
  created(){
    var self = this;
    self.fecthFavorites();

    // var initalLocation = localStorage.getItem("launchLocation") || [];
    
    // if(initalLocation.length == 0){
    //   this.toggleHome();
    //   // this.toggleSidebar();
    // }
  },
  ready (){

    var url = this.$route;
    // console.log("url: ", url);

    if (url.query.article){
      this.showModal();
      this.mapLoaded();
    }


    // if ('serviceWorker' in navigator) {
    //   navigator.serviceWorker
    //            .register('../service-worker.js')
    //            .then(function() { console.log('Service Worker Registered'); });
    // }

    

  },
  methods:{
    
  }
}
</script>

<style lang="css">

body{
  font-family: 'Raleway';
  margin: 0;
  padding: 0;
}

.homeContainer{
  top:0;
  bottom: 0;
  right:0;
  left: 0;
  position: absolute;
  z-index: 100;
  padding: 20px;
  overflow: auto;

}

.searchingContainer{

	top:0;
	bottom: 0;
	right:0;
	left: 0;
	position: absolute;
	/*background-color: gray;*/
	z-index: 100;
	padding: 20px;

}

.fade-transition {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}

.favoritesContainer{
  top:0;
  bottom: 0;
  right:0;
  left: 0;
  position: absolute;
  /*background-color: #fff;*/
  z-index: 100;
  padding: 20px;
  /*overflow: auto;*/
}

.ui-preloader-progressbar::before, .ui-preloader-progressbar::after {
    display: block;
    position: absolute;
    top: 0;
    z-index: 1;
    width: 0;
    height: 10px;
    background: #afa;
    -webkit-animation: ui-preloader-front linear 3s infinite;
    animation: ui-preloader-front linear 3s infinite;
    content: '';
}
.shareContainer{
  top:0;
  bottom: 0;
  right:0;
  left: 0;
  position: absolute;
  /*background-color: gray;*/
  z-index: 100;
  padding: 20px;
  /*overflow: auto;*/
}

.modalContainer{

  top:0;
  bottom: 0;
  right:0;
  left: 0;
  position: absolute;
  background-color: #ffffff;
  /*background-color: rgba(0,0,0,0.3);*/
  z-index: 100;
  padding: 20px;
  overflow: auto;
  /*color: #ffffff;*/
}

@media (min-width: 767px) {

  .searchingContainer{
    right: 80px;
    left: 80px;
  }
  .favoritesContainer{
    right: 80px;
    left: 80px;
  }
  .shareContainer{
    right: 80px;
    left: 80px;
  }
  /*.modalContainer{
    right: 80px;
    left: 80px;
  }*/
  .homeContainer{
    right: 80px;
    left: 80px;
  }
  
}

@media (min-width: 1023px) {

  .searchingContainer{
    right: 220px;
    left: 220px;
  }
  .favoritesContainer{
    right: 220px;
    left: 220px;
  }
  .shareContainer{
    right: 220px;
    left: 220px;
  }
  .homeContainer{
    right: 220px;
    left: 220px;
  }
  
}





.directionContainer{


  top:0;
  bottom: 0;
  right:0;
  left: 0;
  position: absolute;
  /*background-color: gray;*/
  z-index: 100;

}

.closeContainer{
	height: 35px;
      /*margin-top: 10px;*/
}

.modalClose {
    height: 25px;
    margin-top: 20px;
    width: 25px;
    position: relative;
    /*top: 50%;
    right: 0;*/
    float: right;
    transform: translate(0, -50%);
    z-index:9999999999;
}
.modalClose:hover {
    cursor: pointer;
}
.modalClose:hover span {
    /*background-color: black;*/
}
.modalClose span {
    position: absolute;
    Z-index: 1;
    width: 2px;
    height: 28px;
    top: -1px;
    margin-left: 12px;
    background-color: black;
    transition: all .12s linear;
    display: block;
}
.modalClose span:first-child {
    transform: rotate(45deg);
}
.modalClose span:last-child {
    transform: rotate(135deg);
}
.mapboxgl-ctrl-bottom-right {
    right: 0;
    bottom: 0;
    display: none;
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
    left: 9px;
    position: absolute;
    font-size: 20px;
    top: 8px;
    color: #fff;
}
.searchButton button{
  background-color: #4fc08d !important;
}


.progress{
  top: 0px;
  z-index: 1;
  position: absolute;
}

</style>
