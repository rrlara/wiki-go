import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'

import VueMoment from 'vue-moment'

import VueTouch from 'vue-touch'

import Vuex from 'vuex'

import App from './App.vue'

// import Home from './components/home/index.vue'

import Map from './components/map-view/index.vue'

// import Directions from './components/directions/index.vue'

import store from './vuex/store'

import VueProgressBar from 'vue-progressbar'


Vue.use(VueResource)
Vue.use(VueRouter)
Vue.use(require('vue-moment'))
Vue.use(VueTouch)


Vue.use(VueProgressBar, {
  color: '#009ACD',
  failedColor: 'red',
  height: '7px'
})




// Vue.config.debug = process.env.DEBUG_MODE



export var router = new VueRouter({
  // history: true
})

router.map({
  '/map': {
  	component: Map
  }
  // ,
  // '/directions': {
  // 	component: Directions,
  // 	name: 'directions'
  // }
  
})

router.redirect({
  '*': '/map'
})

// router.start(App, '#app')
router.start({
  store,
  components: { App }
}, '#app')


// //directives for social media
Vue.directive('twitter', function () {

    this.el.addEventListener('click', function () {

        var width = 818,
            height = 400,
            left = (document.documentElement.clientWidth - width) / 2,
            top = (document.documentElement.clientHeight - height) / 2,
            //url = 'https://twitter.com/intent/tweet?text=' + message + '&url=http://vegibit.com',
            url = 'https://twitter.com/intent/tweet?text=' + "Search wikipedia articles around you" + '&url=https://www.leapspotleap.com' + "&hashtags=leapspotleap, wikipedia, wikidata, search",
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;

        window.open(url, 'twitter', opts);
        return false;
    });
});

Vue.directive('facebook', function () {

    this.el.addEventListener('click', function () {

        var winWidth = 520;
        var winHeight = 350;

        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);

        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + '&p[url]=https://www.leapspotleap.com', + 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    });
});

Vue.directive('twitter-modal', function (post) {

    this.el.addEventListener('click', function () {

      // console.log("post info: ", post);

        var width = 818,
            height = 400,
            left = (document.documentElement.clientWidth - width) / 2,
            top = (document.documentElement.clientHeight - height) / 2,
            url = post.title + '&url=' + post.url + "&hashtags=leapspotleap, wikipedia",
            opts = 'status=1' +
                ',width=' + width +
                ',height=' + height +
                ',top=' + top +
                ',left=' + left;

                var fullUrl = 'https://twitter.com/intent/tweet?text=' + url;

        window.open(fullUrl, 'intent', opts);
        return false;
    });
});

Vue.directive('facebook-modal', function (post) {

    this.el.addEventListener('click', function () {

        var winWidth = 520;
        var winHeight = 350;

        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);

        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + post.title + '&p[url]=' + post.url, + 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    });
});

Vue.filter('replaceHttp', function (value, input) {
  
  var tempURL = value.split( '//' )[1];

  return "https://" + tempURL;
  // return value + input
})
