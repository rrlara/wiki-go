import Vue from 'vue'
import VueResource from 'vue-resource'

import Wiki2Geojson from './Wiki2Geojson'

var wikiAPI = "http://dbpedia.org/sparql/?default-graph-uri=http://dbpedia.org"


module.exports = {

    getWikiData: function(map) {

      //   var map_bounds = map.getBounds();

      //   var south = map_bounds.getSouth();
      //   var west = map_bounds.getWest();
      //   var north = map_bounds.getNorth();
      //   var east = map_bounds.getEast();

      //   var query = "SELECT DISTINCT (str(?label) as ?label) ?lat ?lng ?abstract ?link ?thumbnail  "+
      //   "WHERE {?res rdfs:label ?label. ?res <http://www.w3.org/2003/01/geo/wgs84_pos#lat> ?lat. ?res "+
      //   "<http://www.w3.org/2003/01/geo/wgs84_pos#long> ?lng. ?res <http://dbpedia.org/ontology/abstract> "+
      //   "?abstract. ?res foaf:isPrimaryTopicOf ?link. ?res <http://dbpedia.org/ontology/thumbnail> ?thumbnail."+
      //   "  FILTER ((?lng > "+west+" AND ?lng < "+east+" AND ?lat > "+south+" AND ?lat < "+north+") " +
      //   "AND LANG(?label)='en' AND LANG(?abstract)='en' )} Limit 1000";


      //   // GET request
      // Vue.http({
      //   url: wikiAPI, 
      //   method: 'GET',
      //   type: 'jsonp',
      //   data: {
      //       query: query
      //   }
      //   }).then(function (response) {
      //     // success callback
      //     // console.log("response: ", response);

      //     var wikiToGeosjonData = Wiki2Geojson.parse(response.data.results.bindings, {Point: ['lat', 'lng'],
      //               extra: {
      //                   'active': false,
      //                   'visible': true
      //               }
      //           });
      //     console.log("realData: ", wikiToGeosjonData);
      //     return wikiToGeosjonData;
      // }, function (response) {
      //     // error callback
      // });
        
    }

};