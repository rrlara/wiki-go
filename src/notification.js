import Vue from 'vue';
import store from './vuex/store';


let notification = new Vue({
  store,

  vuex: {
    getters: {
      // currentTrack: ({player}) => player.currentTrack,
      // apiUrl: ({player}) => player.apiUrl
      publicCalls: state => state.publicCalls,
    }
  },

  methods: {

    getCount () {
      return this.publicCalls.features.length;
    },
    searchSuccess () {
      this.notify(
          `☆ Search was successful ☆`,
          `Found ${this.getCount()} articles`
      );
    },

    notify(title, body, icon = '../static/marker.png', silent = false) {
      Notification.requestPermission();
      let n =  new Notification(
        title,
        {
          icon,
          body,
          silent
        }
      );

      setTimeout(n.close.bind(n), 5000);
    }
  }
});

export default notification;