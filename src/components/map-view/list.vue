<template>

<div>
    

    <div class="locateMe" @click="getMyLocation(), showSpinner = true">
      <i class="fa fa-location-arrow" :class="{'activeLocation': foundMe }" v-if="!showSpinner"></i>
      <i class="fa fa-spinner fa-spin" v-else></i>
    </div>

    <div v-if="publicCalls != null" id="mobile-list-view" class="mobile-list-view" :class="{ active: publicCalls != null}"
    v-show="hideStuff"
    >


    <!-- <div class="card" v-for="item in publicCalls.features"
    id="mobile-{{item.properties.label.value}}"
    v-touch:tap="updateActiveCall(item)"
      v-touch:swipe="updateActiveCall(item), showModal()"
      v-touch-options:swipe="{ direction: 'vertical' }"
      :class="{activeMobile: activeCall.properties.idx === item.properties.idx}"
    > -->
    <div class="card" v-for="item in publicCalls.features"
    id="mobile-{{item.properties.label.value}}"
    @click="updateActiveCall(item)"
      :class="{activeMobile: activeCall.properties.idx === item.properties.idx}"
    >

    <div class="desktopViewButton" @click="updateActiveCall(item), showModal()">
      view
    </div>

    <div class="groupBadge" v-if="item.properties.groupCount > 1">
      <i class="fa fa-clone" aria-hidden="true"></i>
      <span>{{item.properties.groupCount}}</span>
    </div>

      <!-- <div class="card-image" style="background: url({{item.properties.thumbnail.value | replaceHttp}});"
      v-touch:press.prevent="updateActiveCall(item), onSwipeUp()"
      > -->
      <div class="card-image" style="background: url({{item.properties.thumbnail.value | replaceHttp}});">
      </div>
      <div class="card-content">
        <div class="media">

          <div class="media-content">
            <p class="title is-5">{{item.properties.label.value}}</p>
          </div>
        </div>

        <div class="content">
          <small>{{ $index + 1 }} of {{publicCalls.features.length}}</small><br>
          <small v-if="item.properties.groupCount > 1">{{item.properties.groupCount}} grouped records</small><br v-if="item.properties.groupCount > 1">
          <strong v-if="foundMe">{{updateDistances(item)}} &nbsp;<i class="fa fa-arrow-circle-right" 
            style="transform: rotate({{updateBearing(item)}}deg)"
            aria-hidden="true"
            class="dirIndicator"></i>
          </strong>
        </div>
      </div>
    </div>
        
    </div>

    </div>

</div>

</template>
<script>

import Distance from '../../lib/Distance'
import { updateActiveCall, inDirectionMode, showModal, showModalImage, getMyLocation } from '../../vuex/actions'


export default {
  name: "List",
  props:{
    showSpinner: false,
    details: null
  },
  components:{
  },
  vuex: {
    getters: {
      myLocation: state => state.myLocation,
      publicCalls: state => state.publicCalls,
      foundMe: state => state.foundMe,
      showLocationError: state => state.showLocationError,
      showSidebar: state => state.sidebarShow,
      activeCall: state => state.activeCall,
      showModalInfo: state => state.showModal,
      showFavorites: state => state.showFavorites,
      showShare: state => state.showShare,
      isSearching: state => state.isSearching,
    },
    actions: {
      updateActiveCall,
      inDirectionMode,
      showModal,
      showModalImage,
      getMyLocation
    }
  },
  data () {
    return {
      resetSpinner: false,
      showList: false,
      desktopClick: false
    }
  },
  computed: {
    hideStuff: function() {
      if (this.showSidebar || this.showFavorites || this.isSearching || this.showShare){
        return false
      }else{
        return true
      }
    }
  },
  watch:{
    
    'publicCalls': function(){
      var self = this;

      if (self.publicCalls != null){
        self.showList = true;
      }else{
        self.showList = false;
      }
    },
    'myLocation': function(){
      var self = this;
      if(self.myLocation != null){
        self.showSpinner = false;
      }
      
    },
    'showLocationError': function(){
      if (this.showLocationError) {
        this.showSpinner = false;
      }
    }
  },
  data () {
    return {
       currentID: null
    }
  },
  methods:{

    onSwipeUp: function(){
      // console.log("swipped UP");
      this.showModalImage();
    },

    enCodeURL: function (url){

      var encodedURL = url;

      return encodeURI(encodedURL);

    },

    imageError: function (el){
        el.onerror='';
        el.src='/static/loading-spin.svg';
    },
    press: function(){
      var self = this;
      // self.showModalImage();
    },
    scrollTop_Left: function(item){

      

    },
    updateDistances: function(call){
          var self = this;
          var callLocation = {
              latitude: call.geometry.coordinates[1],
              longitude: call.geometry.coordinates[0]
          }

          var dist = Distance.getDistances(callLocation, this.myLocation)

          if (dist < 0.189394){
            dist = (dist * 3280.84).toFixed(0) + " feet away"
          }else{
            dist = dist + " miles away"
          }

          return dist


        
      },
      goToDirectionsPage: function(){

        var self = this;
        setTimeout(function () {
          var selfself = self;
          selfself.$router.go({ name: 'directions', force: true});
        }, 500)
        
      },
      updateBearing: function(call){
          var self = this;
          var callLocation = {
              latitude: call.geometry.coordinates[1],
              longitude: call.geometry.coordinates[0]
          }

          function radians(deg) {
             return deg * Math.PI / 180;
          }
          function degrees(rad) {
            return rad * 180 / Math.PI;
          }
                  
          var startLat = radians(this.myLocation.latitude);
          var startLong = radians(this.myLocation.longitude);
          var endLat = radians(callLocation.latitude);
          var endLong = radians(callLocation.longitude);

          var dLong = endLong - startLong;

          var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
          if (Math.abs(dLong) > Math.PI){
            if (dLong > 0.0)
               dLong = -(2.0 * Math.PI - dLong);
            else
               dLong = (2.0 * Math.PI + dLong);
          }

          // console.log("sadfsdf: ", (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0);

          // return (degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;

          return Math.round(((degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0)-88).toString();

        
      },
  },
  ready(){

    var initialWidth= document.documentElement.clientWidth
    var listView = document.getElementById('mobile-list-view')
    var startX = 0
    var startY = 0
    var startScrollLeft = 0
    var mouseDragging = false
    var pointerDragging = false

    // var self = this;

    if (initialWidth > 960){

        this.desktopClick = true;
    }

    if (listView) {
      listView.addEventListener('touchstart', function(e) {
        if (!e.touches || !e.touches.length) {
          return
        }

        startX = e.touches[0].clientX
        startY = e.touches[0].clientY
        startScrollLeft = listView.scrollLeft
        e.stopPropagation()
      }, false)

      listView.addEventListener('touchmove', function(e) {
        if (!e.touches || !e.touches.length) {
          return
        }

        var diffX = e.touches[0].clientX - startX
        var diffY = e.touches[0].clientY - startY

        if (Math.abs(diffX) > Math.abs(diffY)) {
          listView.scrollLeft = startScrollLeft - diffX
          e.preventDefault()
          e.stopPropagation()
        }
      }, false)

      listView.addEventListener('mousedown', function(e) {
        mouseDragging = true
        startX = e.clientX
        startScrollLeft = listView.scrollLeft
      }, false)

      listView.addEventListener('mousemove', function(e) {
        if (!mouseDragging) {
          return
        }

        listView.scrollLeft = startScrollLeft - (e.clientX - startX)
        e.preventDefault()
      }, false)

      listView.addEventListener('mouseup', function() {
        mouseDragging = false
      }, false)

      listView.addEventListener('mouseleave', function() {
        mouseDragging = false
      }, false)

      listView.addEventListener('pointerdown', function(e) {
        pointerDragging = true
        startX = e.clientX
        startScrollLeft = listView.scrollLeft
      }, false)

      listView.addEventListener('pointermove', function(e) {
        if (!pointerDragging) {
          return
        }

        listView.scrollLeft = startScrollLeft - (e.clientX - startX)
        e.preventDefault()
      }, false)

      listView.addEventListener('pointerup', function() {
        pointerDragging = false
      }, false)

      listView.addEventListener('pointercancel', function() {
        pointerDragging = false
      }, false)
    }

  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

.fade-transition {
  transition: opacity 0.4s ease;
}
.fade-enter, .fade-leave {
  opacity: 0;
}

.distIndicator{
  left: 0px;
}

.count{
  /*color: gray;*/
  font-size: 12px;
}

.dirIndicator{
  position: absolute;
  right: 0px;
  margin-right: 35px;
  color: #4fc08d;
}

.mobile-list-view{
      bottom: -104px;
      position: fixed;
      right: 0;
      left: 0;
      z-index: 100;
      -webkit-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      -moz-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      -o-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      touch-action: pan-x;
      -ms-touch-action: pan-x;
      height: 159px;
      display: flex;
      flex-wrap: nowrap;
    }

  @media screen and (min-width: 767px) {

      .mobile-list-view {
          /*width: 768px;*/
          margin: auto;
        }

    }

::-webkit-scrollbar { 
  display: none; 
}
/* optional: show position indicator in red */
::-webkit-scrollbar-thumb {
    background: #FF0000;
}


    .active{
      bottom: 5px;
      -webkit-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      -moz-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      -o-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
      transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
    } 

.image.is-64x64 {
    margin: auto;
}

.card{
  margin: 0px 10px;
  flex: 0 0 calc(100vw - 40px);
  max-width: 440px;
  position: relative;
  border-radius: 10px;
  border: 2px solid rgba(79, 192, 141, 0.0);
  height: 150px;
  opacity: 0.8;
  touch-action: pan-x;
}

.image img {
    display: block;
    height: 64px;
    margin: auto;   
}
.card-image{
  height: 70px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  background-position: 50% 50% !important;
}
.card-content{
  /*background-color: #fff;*/
  padding: 10px;
}

.card .media{
  white-space: nowrap;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    text-overflow: ellipsis;
}

.activeMobile{
  border: 2px solid rgba(79, 192, 141, 1);
  color: #fff !important;
  background-color: #a7dfc6;
  opacity: 1;
  /*overflow: auto;*/
}

.locateMe{
  position: absolute;
  bottom: 170px;
  right: 19px;
  z-index: 100;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  background-color:rgba(192,192,192,0.3); 
  z-index: 200;
  
}
.locateMe i {
    left: 11px;
    position: absolute;
    font-size: 20px;
    top: 10px;
    color: #fff;
}
.locateMe button{
  background-color: #4fc08d !important;
}

.activeLocation{
  color: #009ACD !important;
}

.desktopViewButton{
  position: absolute;
    right: 10px;
    top: 10px;
    color: #fff;
    z-index: 1;
    font-size: 20px;
    cursor: pointer;
    text-shadow: 1px 2px 3px #666;
}

.groupBadge{
  position: absolute;
  left: 10px;
  top: 10px;
  z-index: 2;
  min-width: 38px;
  height: 24px;
  padding: 0 8px;
  border-radius: 12px;
  background-color: rgba(79, 192, 141, 0.95);
  color: #fff;
  font-size: 13px;
  line-height: 24px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.35);
  text-align: center;
}

.groupBadge i{
  margin-right: 4px;
}

</style>
