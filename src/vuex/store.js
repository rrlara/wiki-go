import Vue from 'vue'
import Vuex from 'vuex'

import VueResource from 'vue-resource'

import ls from 'local-storage'

Vue.use(VueResource)
Vue.use(Vuex)

var SEARCHS_KEY = 'savedPlaces';
var FAVORITES = 'favorites'

const state = {
  myLocation: {},
  foundMe: false,
  sidebarShow: false,
  isSearching: false,
  publicCalls: null,
  satellite: false,
  activeCall: {},
  directionsMode: false,
  changeLocation: null,
  showModal: false,
  showModalWithImage: false,
  showLoader: false,
  recentSearch: [],
  favoritesList: [],
  showFavorites: false,
  showShare: false,
  showError: false,
  showTooZoomedOut: false,
  showLocationError: false,
  locationErrorMessage: '',
  mapHasNotLoaded: true,
  showHome: false,
  noArticle: false

}

const mutations = {

  TOGGLE_ARTICLE (state) {
    state.noArticle = !state.noArticle;
  },

  TOGGLE_HOME (state) {
    state.showHome = !state.showHome;
  },
  MAP_LOADED (state) {
    state.mapHasNotLoaded = false;
  },
  TOGGLE_TOOZOOMEDOUT (state) {
    state.showTooZoomedOut = !state.showTooZoomedOut;
  },
  TOGGLE_ERROR (state) {
    state.showError = !state.showError;
  },
  HIDE_LOCATION_ERROR (state) {
    state.showLocationError = false;
    state.locationErrorMessage = '';
  },
  TOGGLE_SHARE (state) {
    state.showShare = !state.showShare;
  },
  CLEAR_ALL_FAVORITE (state) {

    var clearFavorites = [];

    state.favoritesList = clearFavorites

    try {
        localStorage.setItem(FAVORITES, JSON.stringify(state.favoritesList));
        return true;
      } catch (error) {
        return false;
      }

    

  },
  DELETE_FAVORITE (state, index) {

    state.favoritesList.splice(index, 1);

    try {
        localStorage.setItem(FAVORITES, JSON.stringify(state.favoritesList));
        return true;
      } catch (error) {
        return false;
      }

    

  },
  DELETE_FAVORITE_NAME (state, name) {

    function deleteElement(element, index, array) {
        if (name === element.properties.idx){
          state.favoritesList.splice(index, 1);

          try {
              localStorage.setItem(FAVORITES, JSON.stringify(state.favoritesList));
              return true;
            } catch (error) {
              return false;
            }
        }
      }
    state.favoritesList.forEach( deleteElement );
  },
  TOGGLE_FAVORITES (state) {
    state.showFavorites = !state.showFavorites;
  },
  SAVE_TO_FAVORITES (state, fav) {

    if(state.favoritesList.length >=20){

      state.favoritesList.shift();

    }

    state.favoritesList.push(fav)

    try {
        localStorage.setItem(FAVORITES, JSON.stringify(state.favoritesList));
        return true;
      } catch (error) {
        return false;
      }

    
  },
  FETCH_FAVORITES (state) {
    var favList = JSON.parse(localStorage.getItem(FAVORITES) || '[]');

    state.favoritesList = favList;

  },
  SAVE_SEARCH_PLACE (state, place) {

    if(state.recentSearch.length >=5){

      state.recentSearch.shift();

    }

    state.recentSearch.push(place)

    try {
        localStorage.setItem(SEARCHS_KEY, JSON.stringify(state.recentSearch));
        return true;
      } catch (error) {
        return false;
      }

    
  },
  FETCH_RECENT_SEARCH (state) {
    var savePlaces = JSON.parse(localStorage.getItem(SEARCHS_KEY) || '[]');

    state.recentSearch = savePlaces;

  },
  SHOW_LOADER (state) {
    state.showLoader = !state.showLoader;
  },
  SHOW_MODALIMAGE (state) {
    state.showModalWithImage = !state.showModalWithImage;
  },
  SHOW_MODAL (state) {
    state.showModal = !state.showModal;
  },
  FILTER_CALLS (state, list) {
    // console.log("list: ", list);
  },
  SET_ACTIVE_CALL (state, call) {

    // if (!state.showModal){
      state.activeCall = call
    // }


    // var listMeta = document.getElementsByTagName('meta');

    // for (var i=0; i<listMeta.length; i++) { 
    //   if (listMeta[i].attributes[0].nodeValue) { 
    //      //make necessary changes
    //      if(listMeta[i].attributes[0].nodeValue == "og:image"){

    //       if (state.activeCall.properties.image){
    //         listMeta[i].attributes[1].nodeValue = state.activeCall.properties.image.value;
    //         //no need to continue loop after making changes.
    //         break;
    //       }
          
    //      }
         
    //   } 
    // } 
    
  },
  UPDATE_BASEMAP (state) {
    state.satellite = !state.satellite;
  },
  SEARCH_CHANGE_LOCATION (state, loc) {
    // console.log("loc: ", loc);
    state.changeLocation = loc

    state.isSearching = false;
  },
  GET_MY_LOCATION (state) {
    state.showLoader = true;
    state.showLocationError = false;
    state.locationErrorMessage = '';

    function show_location_error(message) {
      state.locationErrorMessage = message;
      state.showLocationError = true;
      state.showLoader = false;
    }

    if (!navigator.geolocation) {
      show_location_error("Location is not available in this browser. You can still search for a place instead.");
      return;
    }

    if (window.isSecureContext === false) {
      show_location_error("Location needs a secure connection. Open this site with HTTPS, or search for a place instead.");
      return;
    }

    function geo_success(position) {

            var self = this;

                    var loc = {
                        latitude: null,
                        longitude: null
                    }

                    loc.latitude = position.coords.latitude
                    loc.longitude = position.coords.longitude

                    //Mock Location
                    //47.603081,-122.3277441
                    // loc.latitude = 47.603081
                    // loc.longitude = -122.3277441



                    // console.log("log: ", loc);

                    state.myLocation = loc;
                    state.foundMe = true;
                    state.showLocationError = false;
                    state.locationErrorMessage = '';

                    state.showLoader = false;
                  
                }

                function geo_error(error) {
                  var message = "We could not get your location. You can search for a place instead.";

                  if (error && error.code === error.PERMISSION_DENIED) {
                    message = "Location permission was denied. You can enable location access in your browser settings, or search for a place instead.";
                  } else if (error && error.code === error.POSITION_UNAVAILABLE) {
                    message = "Your location is unavailable right now. Try again, or search for a place instead.";
                  } else if (error && error.code === error.TIMEOUT) {
                    message = "Finding your location took too long. Try again, or search for a place instead.";
                  }

                  show_location_error(message);

                }

                var geo_options = {
                  enableHighAccuracy: true, 
                  maximumAge        : 30000, 
                  timeout           : 27000
                };

                // var wpid = navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);
                var wpid = navigator.geolocation.getCurrentPosition(geo_success, geo_error, geo_options);            
  },
  TOGGLE_SIDEBAR(state){
    state.sidebarShow = !state.sidebarShow;
  },
  IS_SEARCHING(state){
    state.isSearching = !state.isSearching;
  },
  IN_DIRECTION_MODE(state){
    state.directionsMode = !state.directionsMode;
  },
  // RECEIVED_PUBLIC_CALLS(state, data){

  //   state.publicCalls = data;

  // },
  RECEIVED_WIKI_GEOJSON(state, data){

    state.publicCalls = data;


  }
  
}

export default new Vuex.Store({
  state,
  mutations
})
