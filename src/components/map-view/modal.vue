<template>
<div>
    <h3 v-show="noArticle">No Article Found</h3>

    <modalimage v-if="showModalImageInfo" :images="images"></modalimage>

    <div class="modal-full" v-if="showModalInfo">
              <div class="modal-full-wrapper" :class="{appear: activeCall.properties}" v-if="activeCall.properties">
                  <div class="header">

                    <h3>{{activeCall.properties.label.value}}</h3>

                      <div style="min-height: 100px; position: relative;">

                      <div class="gallery" @click.prevent="showModalImage()" v-show="images.length > 1">
                        <i class="fa fa-clone" aria-hidden="true"></i>
                      </div>

                      <img width="100%" style="max-width: none;" src="{{activeCall.properties.image.value | replaceHttp }}?width=600" alt="Smiley face" v-cloak>
                      </div>

                  </div>
                  <slot name="content">

                      <mini :location="activeCall.geometry.coordinates" v-if="activeCall.geometry.coordinates"></mini>
                      
                      <p style="text-align: center; font-size: 20px;">
                      <span>
                      
                      <i class="fa fa-twitter-square" aria-hidden="true" style="float:left;" 
                      v-twitter-modal="postInfo"
                      ></i>

                      <!-- <a :href="getSocialObject()" target="_blank">link
                      </a> -->

                      <i class="fa fa-bookmark-o" aria-hidden="true" @click="saveToFavorites(activeCall)" v-if="itemExistInFavorites(favoritesList, activeCall)"></i>
                      <i class="fa fa-bookmark hearColor" aria-hidden="true" v-else @click="deleteFavoriteByName(activeCall.properties.label.value)"></i>

                      <i class="fa fa-facebook-square" aria-hidden="true" style="float:right;" v-facebook-modal="postInfo"
                      ></i>
                      </span>
                      </p>
                      <p>
                      <!-- Trigger -->
                        <button class="copy-btn" data-clipboard-target="#foo">
                            <img src="../../../static/clippy.svg" alt="Copy to clipboard" class="clippyImage">
                        </button>
                        <input id="foo" :value="getUrlToCopy">
                      </p>
                      <!-- <p v-else style="text-align: center;"><i class="fa fa-heart" aria-hidden="true"></i>
                      </p> -->
                      <p>{{activeCall.properties.abstract.value}}</p>
                      <p><a href="{{activeCall.properties.link.value}}" target="_blank">Wikipedia link</a></p>
                      
                      <!-- <mini :location="activeCall.geometry.coordinates"></mini> -->
                      
                  </slot>
              </div>
          </div>
</div>
</template>

<script>
import { showModal, saveToFavorites, deleteFavoriteByName, updateActiveCall, gotArticleOnLoad, articleToggle, showModalImage } from '../../vuex/actions'

import checkExist from '../../lib/helper'

import Mini from './mini'

import Clipboard from 'clipboard'

import Modalimage from './modalimage'


    export default {

        components:{
            Mini,
            Modalimage
        },  
        data () {
          return {
             showFullImage: false,
             imageHeight: null,
             images: []
          }
        },
        ready (){

          // this.$route.query.article = this.activeCall.properties.label.value


          new Clipboard('.copy-btn');

          if (!this.$route.query.article){
            this.$route.router.go({
                query: { article: this.activeCall.properties.wikiPageID.value }
            });
            this.getListOfImages();
          }else{
            this.getArticleOnLoad();
            
          } 

        },
        vuex: {
          getters: {
            showModalInfo: state => state.showModal,
            showModalImageInfo: state => state.showModalWithImage,
            activeCall: state => state.activeCall,
            favoritesList: state => state.favoritesList,
            noArticle: state => state.noArticle
          },
          actions: {
            showModal,
            saveToFavorites,
            deleteFavoriteByName,
            updateActiveCall,
            gotArticleOnLoad,
            articleToggle,
            showModalImage
          }
        },
         
        computed: {
          postInfo(){
            var self = this;
            var postInfo = {}

            postInfo.title = self.activeCall.properties.label.value;
            postInfo.url = self.activeCall.properties.link.value

            postInfo.url = "https://www.leapspotleap.com/#!/map?article=" + self.activeCall.properties.wikiPageID.value

            postInfo.url = encodeURIComponent(postInfo.url);

            return postInfo;

          },
          getUrlToCopy(){

            var url = "https://www.leapspotleap.com/#!/map?article=" + this.activeCall.properties.wikiPageID.value
            
            return url;
          }
        },
        methods:{

          getListOfImages: function () {

            var self = this;

            var url2 = "https://en.wikipedia.org/w/api.php?action=parse&prop=images&pageid="  + self.activeCall.properties.wikiPageID.value + "&format=json"

            this.$http.jsonp(url2).
            then(function (response) {

                console.log("list of images: ", response);

                this.pushImagesToList(response.data.parse.images);

              }, function (response) {

                
            });

          },
          pushImagesToList: function (list){

              var self = this;

              var imgList = list;

              imgList.forEach(function(img) {

              var url = "https://commons.wikimedia.org/wiki/Special:FilePath/" 

              var name = img.split(".");

              var type = name[name.length - 1]
              
              if ( type != "svg"){
                var file = img;

                var fullURL = url + file + "?width=600"

                self.images.push(fullURL);

                console.log(img);

              }   
            }); 


            },

          getSocialObject: function (){

            var postInfo = {}

            postInfo.title = this.activeCall.properties.label.value;
            // postInfo.url = self.activeCall.properties.link.value

            postInfo.url = "https://www.leapspotleap.com/#!/map?article=" + self.activeCall.properties.wikiPageID.value

            postInfo.url = "https://twitter.com/intent/tweet?url=" + self.activeCall.properties.wikiPageID.value;

            return postInfo.url;


          },

          itemExistInFavorites: function(favList, item){

            var foundFav = true;

            favList.forEach(function(fav) {
              if(fav.properties.label.value === item.properties.label.value){
                  // return true;
                  return foundFav = false
              }

            });

            return foundFav;

          },
          getArticleOnLoad: function (){

            var self = this;

            var query = "SELECT ?label ?abstract ?lat ?lng ?link ?thumbnail ?image ?wikiPageID WHERE {?res dbo:abstract ?abstract . ?res rdfs:label ?label .?res geo:lat ?lat .?res geo:long ?lng .?res foaf:isPrimaryTopicOf ?link .?res dbo:thumbnail ?thumbnail .?res foaf:depiction ?image . ?res dbo:wikiPageID ?wikiPageID filter(lang(?abstract)='en' && lang(?label)='en' && ?wikiPageID="+ this.$route.query.article + ")}"

            this.$http({
              url: "https://dbpedia.org/sparql/?default-graph-uri=http://dbpedia.org", 
              method: 'GET',
              type: 'jsonp',
              data: {
                  query: query
              }
              }).then(function (response) {

                if (response.data.results.bindings.length > 0) {

                  // console.log("Get article: ", response);

                   var obj = {}

                   obj.type = "Feature";
                   obj.geometry = {};
                   obj.geometry.type = "Point";
                   obj.properties = {};
                   obj.geometry.coordinates = [];
                      

                      obj.geometry.coordinates.push(parseFloat(response.data.results.bindings[0].lng.value));
                      obj.geometry.coordinates.push(parseFloat(response.data.results.bindings[0].lat.value));
                      obj.properties = response.data.results.bindings[0]

                      obj.properties.idx = response.data.results.bindings[0].label.value

                      var publicCalls = {
                          "type": "FeatureCollection",
                          "features": []
                        }

                        publicCalls.features.push(obj);


                        this.gotArticleOnLoad(publicCalls);


                        this.updateActiveCall(obj);

                        this.getListOfImages();


                }else{
                  // console.log("No Article");

                  self.articleToggle();

                  setTimeout(function(){ 
                    self.showModal();
                    self.articleToggle();
                  }, 5000);

                }
                }, function (response) {

                self.articleToggle();

                  setTimeout(function(){ 
                    self.showModal();
                    self.articleToggle();
                  }, 5000);

            });

          }

        },  
        watch:{
          
        }

    };
</script>


<style lang="css">

.modal-full-wrapper{
  padding: 1rem 2rem;
  opacity: 0;
  background-color: #fff;
  max-width: 640px;
  margin: 0 auto;
  top:0px;
  bottom: 0px;
}
.modal-full-wrapper img{
  margin-top: 20px;
  margin-top: 20px;
  max-width: 400px;
  display: block; 
  margin-left: auto;
  margin-right: auto;
}





.modal-full-wrapper .full img{
  width: 100%
}

.modal-full-wrapper p{
    background: #fff;
    padding: 17px;
}

.modal-full-wrapper i{
    cursor: pointer;
}



.modal-full-header .header {
  padding: 20px 0px 20px 0px;
  position: relative;
  text-align: center;
}

.header {
    padding: 20px 0px 0px 0px
}

.header h3 {
  text-align: center;
  font-size: 20px;
  padding: 0px 50px;
}

.fullres{
  text-align: center;
  margin-top: 10px;
}

.hearColor{
  color: #4fc08d;
}

.appear{
  opacity: 1;
    /*@include transition (all 0.4s linear);
    /*transition: 0.4s -webkit-filter linear;*/
    transition: 0.4s opacity linear;
    -webkit-transition: 0.4s -webkit-opacity linear;
    -moz-transition: 0.4s -moz-opacity linear;
    -ms-transition: 0.4s -ms-opacity linear;
    -o-transition: 0.4s -o-opacity linear;
}

.clippyImage{
  height: 19px;
  margin-top: 0px !important;
  cursor: pointer;
}

#foo{
    width: 100%;
  }



 .modal-full-wrapper input {
    /*width: 100%;*/
    height: 20px;
    font-size: 16px;
    color: #2c3e50;
    line-height: 0.428571;
    box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
    -webkit-gitbox-shadow: inset 0 1px 4px rgba(0,0,0,.4);
    -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
    -webkit-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
    font-weight: 300;
    padding: 14px 11px;
    border: none;
    border-radius: 6px;
    -webkit-border-radius: 6px;
    letter-spacing: 1px;
    box-sizing: border-box;
    top: -3px;
    position: relative;
}

.modal-full-wrapper button {

  width: 32px;
  margin-left: 46.5%;
  margin-bottom: 6px;
}


@media (max-width: 500px ) {
  .header {
    padding: 20px 0px 0px 0px;
  }
  .modal-full-wrapper{
    padding: 0px;
  }

  .modal-full-wrapper img{
    margin-top: 20px;
    margin-top: 20px;
    width: 100%;
    display: block; 
    margin-left: auto;
    margin-right: auto;
  }

  /*#foo{
    width: 100%
  }*/

}

.gallery{
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
  font-size: 30px;
}

.gallery i{
  color: #fff;
  text-shadow: 1px 2px 3px #666;
}






</style>