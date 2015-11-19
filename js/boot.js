

var MyGame = {};

MyGame.Boot = function (game) {
};


MyGame.Boot.prototype = {
    
    init: function () {

    },

    preload: function () {

    },

    create: function () {

        this.state.start('preloader');
    }
};