<template>
    
    <div class="categories" :class="{'activeCategories': showSidebar, 'hideCategories': showSidebar }">
        
        <!-- SET ACTIVE : active -->
        
        <ul class="categories-list">
            <!-- <li class="categoryIcon" v-link="{ path: '/map' }"><i class="fa fa-map" aria-hidden="true"></i></li> -->
            <li class="categoryIcon " @click="isSearching"><i class="fa fa-search" aria-hidden="true"></i></li>
            <!-- <li class="categoryIcon"><i class="fa fa-camera" aria-hidden="true"></i></li> -->
            <!-- <li class="categoryIcon"><i class="fa fa-map-pin" @click="toggleHome"></i></li> -->
            <li class="categoryIcon" @click="toggleShare"><i class="fa fa-share-alt" aria-hidden="true" v-el:trigger-d></i>
                <!-- <ui-menu
                    :trigger="$els.triggerD" :options="menuOptions" show-icons
                    dropdown-position="top left"
                ></ui-menu> -->
            </li>
        </ul>
        
        <div class="clearfix"></div> 
    
    </div>

</template>
<script>

import { isSearching, toggleShare, toggleHome } from '../../vuex/actions'
import { UiMenu } from 'keen-ui';

var menuOptions = [
    {
        id: 'edit',
        text: 'Edit',
        icon: 'edit',
        keyboardShortcut: 'Ctrl+E'
    }, {
        id: 'duplicate',
        text: 'Duplicate',
        icon: 'content_copy',
        keyboardShortcut: 'Ctrl+D'
    }, {
        id: 'share',
        text: 'Share',
        icon: 'share',
        keyboardShortcut: 'Ctrl+Shift+S',
        disabled: true
    }, {
        type: 'divider'
    }, {
        id: 'delete',
        text: 'Delete',
        icon: 'delete',
        keyboardShortcut: 'Del'
    }
];



export default {
  name: "Category",
  components:{
            UiMenu
  },
  vuex: {
    getters: {
      showSidebar: state => state.sidebarShow
    },
    actions: {
      isSearching,
      toggleShare,
      toggleHome
    }
  },
  data () {
    return {
            menuOptions
        };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="css">

.categoryIcon{
    font-size: 30px;
    text-align: center;
    line-height: 50px;

}
.map-view .categories {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 3;
    bottom: 30px;
    left: 0;
    -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
}

.map-view .activeCategories {
    background-color: rgba(0, 0, 0, 0.5);
    position: absolute;
    z-index: 3;
    bottom: 30px;
    -webkit-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -moz-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    -o-transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    transition: left .4s cubic-bezier(0.25, .8, .25, 1);
    left: 260px;

}

.map-view .categories i{
    color: #fff !important;
}

.map-view .categories ul {
    padding: 0;
    margin: 0;
    list-style: none;
    overflow-x: auto
}

.map-view .categories ul li {
    position: relative;
    float: left;
    cursor: pointer;
    width: 80px;
    height: 50px;
    background-position: center center;
    background-repeat: no-repeat;
    background-size: 65% 65%
}

.map-view .categories ul li.active {
    background-color: #eab701
}

.map-view .categories ul li.active:after {
    content: "";
    position: absolute;
    width: 10px;
    height: 10px;
    background: #ff8400;
    -webkit-transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    -moz-transform: rotate(-45deg);
    transform: rotate(-45deg);
    top: -5px;
    left: 50%;
    margin-left: -5px;
    z-index: 1
}

.map-view .categories ul li.active:hover {
    /*border-top: 4px solid #fff;*/
    color: #4fc08d;
}

.map-view .categories ul li:hover {
    background-color: rgba(0,0,0, 0.6);
}

.map-view .categories ul li:last-child {
    margin-right: 0
}

@media (max-width: 768px) {
    .map-view .categories {
        position: fixed;
        z-index: 3;
        bottom: 0;
        left: 0;
        width: 100%;
        -webkit-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        -moz-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        -o-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
    }

    .map-view .hideCategories {
        bottom: -70px;
        -webkit-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        -moz-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        -o-transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
        transition: bottom .4s cubic-bezier(0.25, .8, .25, 1);
    }

    .map-view .categories ul {
        padding: 0;
        margin: 0;
        list-style: none;
        width: 100%;
        display: flex
    }

    .map-view .categories ul li {
        -webkit-box-flex: 1;
        -webkit-flex: 1;
        -moz-box-flex: 1;
        -ms-flex: 1;
        flex: 1
    }
}

.layout-blur {
    /*filter: blur(40px);*/
    /*@include transition (all 0.4s linear);*/
}

</style>
