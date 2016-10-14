//var Cities = require('../constants/Cities');

// var POI = require('../constants/poi');

import Vue from 'vue'

module.exports = {
    

//directives
Vue.directive('twitter', function () {

    this.el.addEventListener('click', function () {

        var width = 818,
            height = 400,
            left = (document.documentElement.clientWidth - width) / 2,
            top = (document.documentElement.clientHeight - height) / 2,
            //url = 'https://twitter.com/intent/tweet?text=' + message + '&url=http://vegibit.com',
            url = 'https://twitter.com/intent/tweet?text=' + "post.title" + '&url=http://leapspotleap.com' + "post.url",
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

        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + "post.title" + '&p[url]=http://news.spatialdev.com' + "post.url", + 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    });
});


};