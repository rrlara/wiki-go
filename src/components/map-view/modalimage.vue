<template>
      <div class="modal is-active">
        <div class="modal-background" @click="showModalImage()"></div>
        <div class="modal-content">
        <div class="imageIndex" v-if="images.length > 1">
          <span>{{currentNumber + 1}} in  {{images.length}}</span>
        </div>
        <div class="imgSpinner" v-show="imgLoading">
              <img src="../../../static/loading-spin.svg">
        </div>
        <div class="chevron prev" @click="prev" v-show="currentNumber != 0">
              <i class="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
            <div class="chevron next" @click="next" v-show="currentNumber + 1 != images.length">
              <i class="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          <p class="image is-4by3">
            <img id="imgGal" :src="images[Math.abs(currentNumber) % images.length]" v-show="!imgLoading"/>
          </p>
        </div>
      </div>
</template>

<script>
import { showModalImage } from '../../vuex/actions'
    export default {

        props: {
            images: []
        },
        data (){
          return{
            currentNumber: 0,
            timer: null,
            imgLoading: true
          }
          
        },
        vuex: {
          getters: {
            showModalImageInfo: state => state.showModalImage,
            activeCall: state => state.activeCall
          },
          actions: {
            showModalImage
          }
        },
        ready(){

          // this.getListOfImages();

          var self = this;

          var fixed = document.getElementById('imgGal');

          fixed.addEventListener('load', function(e) {

                  self.imgLoading = false;

          }, false);



        },
  methods: {

    startRotation: function() {
        this.timer = setInterval(this.next, 3000);
        console.log(this.images);
    },
    stopRotation: function() {
        clearTimeout(this.timer);
        this.timer = null;
    },
    next: function() {
            this.currentNumber += 1;

            this.imgLoading = true;
    },
    prev: function() {
        this.currentNumber -= 1

        this.imgLoading = true;
    },
    imgLoaded: function() {

      this.imgLoading = false;

    }
  }

    };
</script>


<style lang="css">

.imageIndex{
  font-size: 16px;
  text-align: center;
  width: 170px;
  margin: auto;
  position: relative;
  color: #fff;
}
.imgSpinner{
  position: absolute;
  z-index: 10;
  top: 48%;
  left: 47%;
}
.chevron{
  position: absolute;
  z-index: 10;
  top: 50%;
  color: #fff;
  font-size: 25px;
  text-shadow: 1px 2px 3px #666;
}
.prev{
  left: 10px;
}
.next{
  right: 10px; 
}

</style>