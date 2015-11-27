MyGame.Preloader = function(game) {
    this.preloadBar = null;
    this.ready = false;
};

MyGame.Preloader.prototype = {

    preload: function () {

        this.stage.backgroundColor = '#78fdff';

        this.add.audio('maingame');
		this.load.image('core', 'assets/core.png');
        this.load.image('background', 'assets/Background3.png');
        this.load.image('skin', 'assets/skin.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.image('platform2', 'assets/platform2.png');
        this.load.spritesheet('player', 'assets/player.png',64,64);
        this.load.spritesheet('enemy', 'assets/ennemy.png', 64, 64);
        this.load.image('test', 'assets/bullet.png');
        this.load.audio('maingame', 'assets/audio/maingame.mp3');
    },

    create: function () {


        this.state.start('menu');

    },

    update: function () {

    }
};