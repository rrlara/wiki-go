<template>
    
    <div class="typeahead">

    <i class="fa fa-spinner fa-spin" v-if="loading"></i>
    
    <template v-else>
        <i class="fa fa-search" v-show="isEmpty"></i>
        <i class="fa fa-times" v-show="isDirty" @click="reset"></i>
    </template>

    <input type="text"
           placeholder="Search location..."
           autocomplete="off"
           v-model="query"
           @keydown.down="down"
           @keydown.up="up"
           @keydown.enter="hit"
           @keydown.esc="reset"
           @blur="reset"
           @input="update | debounce 500"/>

    <ul v-show="hasItems">
        <li v-for="item in items" :class="activeClass($index)" @mousedown="hit" @mousemove="setActive($index)">
            <span class="name" v-text="item.place_name"></span>
            <span class="screen-name" >revelance: {{item.relevance}}</span>
        </li>
    </ul>
    <span class="previousPlaceText">Previous locations</span>
    <ul v-show="!hasItems">
        <!-- <span class="previousPlaceText">Previous places searched</span> -->
        <li v-for="item in previousSearch" @click="hitPrevious(item)">
            <span class="name" v-text="item.name"></span>
        </li>
    </ul>
</div>


</template>
<script>

import { searchChangeLocation, 
        isSearching, 
        resetWikiData, 
        saveSearchPlace, 
        fecthRecentSearch } from '../../vuex/actions'


export default {
  name: "Search",
  // mixins: [VueTypeaheadMixin],
  vuex: {
    getters: {
      publicCalls: state => state.publicCalls,
      previousSearch: state => state.recentSearch
    },
    actions:{
      searchChangeLocation,
      isSearching,
      resetWikiData,
      saveSearchPlace,
      fecthRecentSearch
    }
  },
  created(){
    var self = this;
    self.fecthRecentSearch();
  },
  data () {
    return {
      limit: 5,
      src: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
      onHit (item) {
        window.location.href = 'http://twitter.com/' + item.screen_name
      },
      items: [],
      query: '',
      current: -1,
      loading: false
    }
  },
  computed: {
    geoURL(){
      return this.src + this.query + ".json?types=place&autocomplete=true&access_token=pk.eyJ1IjoicnJsYXJhIiwiYSI6IjNjSlJmUkkifQ.PlJc5PGK-7-EDMmsfqYKfg"
    },
    hasItems () {
      return this.items.length > 0
    },

    isEmpty () {
      return !this.query
    },

    isDirty () {
      return !!this.query
    }
  },
  methods: {
    warn (msg) {
      Vue.util.warn('Typeahead requires the ' + msg)
    },

    update () {
      if (! this.query) {
        this.reset()
        return
      }

      this.loading = true

      this.$http.get(this.geoURL)
        .then(function (response) {
          // console.log("response: ", response);
          if (this.query) {
            var data = response.data.features
            data = this.prepareResponseData ? this.prepareResponseData(data) : data
            this.items = !!this.limit ? data.slice(0, this.limit) : data
            this.current = -1
            this.loading = false
          }
        }.bind(this))
    },

    reset () {
      this.items = []
      this.query = ''
      this.loading = false
    },

    setActive (index) {
      this.current = index
    },

    activeClass (index) {
      return {
        active: this.current == index
      }
    },

    hit () {
      if (this.current === -1) return

        var self = this;

      // this.onHit(this.items[this.current])

      self.searchChangeLocation(this.items[this.current].geometry);

      var saveLocation = {}

      saveLocation.name = this.items[this.current].place_name;
      saveLocation.geometry = this.items[this.current].geometry;

      self.saveSearchPlace(saveLocation);

      this.resetWikiData();

      this.isSearching();
      
    },

    hitPrevious(item) {

      var self = this;

      self.searchChangeLocation(item.geometry);

      this.resetWikiData()
      
      this.isSearching()

      


    },

    up () {
      if (this.current > 0)
        this.current--
      else if (this.current == -1)
        this.current = this.items.length - 1
      else
        this.current = -1
    },

    down () {
      if (this.current < this.items.length-1)
        this.current++
      else
        this.current = -1
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">
.typeahead {
  position: relative;
}

.typeahead input {
  width: 100%;
  height: 34px;
  font-size: 16px;
  color: #2c3e50;
  line-height: 1.42857143;
  -webkit-box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  box-shadow: inset 0 1px 4px rgba(0,0,0,.4);
  -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
  font-weight: 300;
  padding: 22px 26px;
  border: none;
  border-radius: 22px;
  letter-spacing: 1px;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

.typeahead input:focus {
  border-color: #4fc08d;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075),0 0 8px #4fc08d;
}

.fa-times {
  cursor: pointer;
}



.typeahead i {
  float: right;
  position: relative;
  padding: 4px;
  top: 34px;
  right: 25px;
  opacity: 0.4;
}

.typeahead ul {
  position: absolute;
  padding: 0;
  margin-top: 30px;
  min-width: 100%;
  background-color: #fff;
  list-style: none;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0,0,0, 0.25);
  z-index: 1000;
}

.typeahead li {
  padding: 10px 16px;
  border-bottom: 1px solid #ccc;
  cursor: pointer;
}

.typeahead li:first-child {
  border-radius: 4px 4px 0 0;
}

.typeahead li:last-child {
  border-radius: 0 0 4px 4px;
  border-bottom: 0;
}

.typeahead span {
  display: block;
  color: #2c3e50;
}

.typeahead .active {
  background-color: #3aa373;
}

.typeahead .active span {
  color: white;
}

.typeahead .name {
  font-weight: 700;
  font-size: 18px;
}

.typeahead .screen-name {
  font-style: italic;
}

.previousPlaceText{
  padding: 5px;
  color: #fff !important;
}







</style>
