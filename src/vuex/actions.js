import Vue from 'vue'
import VueResource from 'vue-resource'

import ls from 'local-storage'

// import Wiki from "../lib/wiki"
import Wiki2Geojson from '../lib/Wiki2Geojson'

import Distance from '../lib/Distance'

import storeState  from './store'

import notification from '../notification'

Vue.use(VueResource)


var wikiAPI = "https://dbpedia.org/sparql/?default-graph-uri=http://dbpedia.org"
var wikipediaAPI = "https://en.wikipedia.org/w/api.php"
var WIKIPEDIA_TITLE_BATCH_SIZE = 50

function getWikipediaTitle(feature) {
  if (!feature.properties || !feature.properties.link || !feature.properties.link.value) {
    return null
  }

  var match = feature.properties.link.value.match(/\/wiki\/(.+)$/)

  if (!match) {
    return null
  }

  return decodeURIComponent(match[1]).replace(/_/g, ' ')
}

function setLiteralValue(item, key, value) {
  if (item.properties[key]) {
    item.properties[key].value = value
  } else {
    item.properties[key] = {
      type: 'literal',
      value: value
    }
  }
}

function addTitleAlias(titleToFeatures, from, to) {
  if (titleToFeatures[from] && !titleToFeatures[to]) {
    titleToFeatures[to] = titleToFeatures[from]
  }
}

function fetchWikipediaExtracts(features) {
  var titleToFeatures = {}
  var titles = []

  features.forEach(function(feature) {
    var title = getWikipediaTitle(feature)

    if (!title) {
      return
    }

    if (!titleToFeatures[title]) {
      titleToFeatures[title] = []
      titles.push(title)
    }

    titleToFeatures[title].push(feature)
  })

  var requests = []

  for (var i = 0; i < titles.length; i += WIKIPEDIA_TITLE_BATCH_SIZE) {
    requests.push(Vue.http({
      url: wikipediaAPI,
      method: 'GET',
      data: {
        action: 'query',
        prop: 'extracts',
        exintro: 1,
        explaintext: 1,
        redirects: 1,
        format: 'json',
        origin: '*',
        titles: titles.slice(i, i + WIKIPEDIA_TITLE_BATCH_SIZE).join('|')
      }
    }).then(function(response) {
      var query = response.data.query || {}
      var pages = query.pages || {}

      if (query.normalized) {
        query.normalized.forEach(function(item) {
          addTitleAlias(titleToFeatures, item.from, item.to)
        })
      }

      if (query.redirects) {
        query.redirects.forEach(function(item) {
          addTitleAlias(titleToFeatures, item.from, item.to)
        })
      }

      Object.keys(pages).forEach(function(pageId) {
        var page = pages[pageId]
        var matchedFeatures = titleToFeatures[page.title]

        if (!matchedFeatures) {
          return
        }

        matchedFeatures.forEach(function(feature) {
          if (page.extract) {
            setLiteralValue(feature, 'abstract', page.extract)
          }

          if (page.pageid) {
            setLiteralValue(feature, 'wikiPageID', page.pageid.toString())
          }
        })
      })
    }))
  }

  return Promise.all(requests).then(function() {
    return features
  }, function() {
    return features
  })
}

function groupDuplicateFeatures(features) {
  var featureByName = {}
  var groupedFeatures = []

  features.forEach(function(feature) {
    var name = feature.properties.idx

    if (!featureByName[name]) {
      feature.properties.groupCount = 1
      feature.properties.groupImages = []
      feature.properties.groupThumbnails = []

      if (feature.properties.image && feature.properties.image.value) {
        feature.properties.groupImages.push(feature.properties.image.value)
      }

      if (feature.properties.thumbnail && feature.properties.thumbnail.value) {
        feature.properties.groupThumbnails.push(feature.properties.thumbnail.value)
      }

      featureByName[name] = feature
      groupedFeatures.push(feature)
      return
    }

    var groupedFeature = featureByName[name]

    groupedFeature.properties.groupCount += 1

    if (feature.properties.image && feature.properties.image.value) {
      groupedFeature.properties.groupImages.push(feature.properties.image.value)
    }

    if (feature.properties.thumbnail && feature.properties.thumbnail.value) {
      groupedFeature.properties.groupThumbnails.push(feature.properties.thumbnail.value)
    }
  })

  return groupedFeatures
}

export const articleToggle = ( { dispatch }) => {
  dispatch('TOGGLE_ARTICLE')
}

export const toggleHome = ( { dispatch }) => {
  dispatch('TOGGLE_HOME')
}

export const mapLoaded = ( { dispatch }) => {
  dispatch('MAP_LOADED')
}
export const toggleTooZoomedOut = ( { dispatch }) => {
  dispatch('TOGGLE_TOOZOOMEDOUT')
}
export const toggleError = ( { dispatch }) => {
  dispatch('TOGGLE_ERROR')
}

export const hideLocationError = ( { dispatch }) => {
  dispatch('HIDE_LOCATION_ERROR')
}

export const toggleShare = ({ dispatch }) => {
  dispatch('TOGGLE_SHARE')
}
export const clearAllFavorite = ({ dispatch }, index) => {
  dispatch('CLEAR_ALL_FAVORITE', index)
}
export const deleteFavorite = ({ dispatch }, index) => {
  dispatch('DELETE_FAVORITE', index)
}

export const deleteFavoriteByName = ({ dispatch }, name) => {
  dispatch('DELETE_FAVORITE_NAME', name)
}
export const toggleFavorites = ({ dispatch }) => {
  dispatch('TOGGLE_FAVORITES')
}
export const fecthFavorites = ({ dispatch }) => {
  dispatch('FETCH_FAVORITES')
}
export const saveToFavorites = ({ dispatch }, item) => {
  dispatch('SAVE_TO_FAVORITES', item)
}
export const fecthRecentSearch = ({ dispatch }) => {
  dispatch('FETCH_RECENT_SEARCH')
}
export const saveSearchPlace = ({ dispatch }, place) => {
  dispatch('SAVE_SEARCH_PLACE', place)
}
export const showLoader = ({ dispatch }, bool) => {
  dispatch('SHOW_LOADER', bool)
}
export const showModalImage = ({ dispatch }) => {
  dispatch('SHOW_MODALIMAGE')
}
export const showModal = ({ dispatch }, wait) => {
  // setTimeout(function () {
          
  //         dispatch('SHOW_MODAL')

  // }, wait)
  dispatch('SHOW_MODAL')
  
}
export const getMyLocation = ({ dispatch }) => {
  dispatch('GET_MY_LOCATION')
}
export const toggleSidebar = ({ dispatch }) => {
  dispatch('TOGGLE_SIDEBAR')
}
export const toggleSearch = ({ dispatch }) => {
  dispatch('IS_SEARCHING')
}

export const isSearching = toggleSearch
export const inDirectionMode = ({ dispatch }) => {
  dispatch('IN_DIRECTION_MODE')
}
export const updateActiveCall = ({ dispatch }, call, ms) => {
  dispatch('SET_ACTIVE_CALL', call)
}
export const updatedBasemap = ({ dispatch }) => {
  dispatch('UPDATE_BASEMAP')
}
export const filterCalls = ({ dispatch }, list) => {
  dispatch('FILTER_CALLS', list)
}
export const searchChangeLocation = ({ dispatch }, loc) => {
  dispatch('SEARCH_CHANGE_LOCATION', loc)
}
export const resetWikiData = ({ dispatch }) => {

  var clearData = null;

  dispatch('RECEIVED_WIKI_GEOJSON', clearData)
}
export const getRecentSearch = ({ dispatch }) => {


  dispatch('GET_RECENT_SEARCH', clearData)
}


export const gotArticleOnLoad = ({ dispatch }, article) => {


  dispatch('RECEIVED_WIKI_GEOJSON', article)
}



export const getWikiData = ({ dispatch }, map) => {

    // var wikiGeojson = Wiki.getWikiData(map);
        var map_bounds = map.getBounds();

        var south = map_bounds.getSouth();
        var west = map_bounds.getWest();
        var north = map_bounds.getNorth();
        var east = map_bounds.getEast();

        var query = "SELECT DISTINCT (str(?labelValue) as ?label) ?lat ?lng (str(COALESCE(?abstractValue, ?descriptionValue, \"\")) as ?abstract) ?link ?thumbnail ?image (str(COALESCE(?wikiPageIDValue, \"\")) as ?wikiPageID) "+
        "WHERE {?res rdfs:label ?labelValue. ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat. ?res "+
        "<http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng. ?res foaf:isPrimaryTopicOf ?link. "+
        "?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail. ?res foaf:depiction ?image. "+
        "OPTIONAL {?res <http://dbpedia.org/ontology/abstract> ?abstractValue. FILTER (LANG(?abstractValue)='en')} "+
        "OPTIONAL {?res <http://dbpedia.org/ontology/description> ?descriptionValue. FILTER (LANG(?descriptionValue)='en')} "+
        "OPTIONAL {?res dbo:wikiPageID ?wikiPageIDValue.} "+
        "FILTER ((?lng > "+west+" AND ?lng < "+east+" AND ?lat > "+south+" AND ?lat < "+north+") " +
        "AND LANG(?labelValue)='en' )} ORDER BY ?label Limit 250";


        if (map.getZoom() > 3.3){
          // console.log("getData");
          // GET request
          storeState.state.showLoader = true;
      Vue.http({
        url: wikiAPI, 
        method: 'GET',
        type: 'jsonp',
        data: {
            query: query
        }
        }).then(function (response) {
          // success callback
          // console.log("response: ", response);

          var wikiToGeosjonData = Wiki2Geojson.parse(response.data.results.bindings, {Point: ['lat', 'lng'],
                    extra: {
                        'active': false,
                        'visible': true
                    }
                });
          

          var updatedGeoJsonData = {
                        "type": "FeatureCollection",
                        "features": []
                      };
                    

          wikiToGeosjonData.features.forEach(function(x) {

              var item = {}

              item = x;



              item.properties.idx = x.properties.label.value;

              if (storeState.state.foundMe){
                // console.log("Apply distance");
                // Distance.getDistances(callLocation, this.myLocation)

                var tempWikiLoc = {
                    latitude: x.geometry.coordinates[1],
                    longitude: x.geometry.coordinates[0]
                }

                // Distance.getDistances(callLocation, storeState.state.myLocation)

                item.properties.distance = Distance.getDistances(tempWikiLoc, storeState.state.myLocation);

                // console.log("item: ", item);
              }


              updatedGeoJsonData.features.push(item)
            
            });

          fetchWikipediaExtracts(updatedGeoJsonData.features).then(function() {
            updatedGeoJsonData.features = groupDuplicateFeatures(updatedGeoJsonData.features)

            if (storeState.state.foundMe){

              var sortedList = updatedGeoJsonData.features.sort(function(a,b) {
                      return a.properties.distance - b.properties.distance
                  });

              updatedGeoJsonData.features = [];

              // console.table(sortedList);

              updatedGeoJsonData.features = sortedList;

            }

            // console.log("updatedGeoJsonData", updatedGeoJsonData.features);
            // return wikiToGeosjonData;
            dispatch('RECEIVED_WIKI_GEOJSON', updatedGeoJsonData)

            // if (("Notification" in window)) {
            //   // This browser does support desktop notification
            //   notification.searchSuccess();
            // }

            storeState.state.showLoader = false;
          })

          
      }, function (response) {
          // error callback
          // alert("Error", response);
          storeState.state.showLoader = false;

          storeState.state.showError = true;

      });
        }else {
          // console.log("Do not get Data");
          storeState.state.showTooZoomedOut = true;
        }

  

  

}
