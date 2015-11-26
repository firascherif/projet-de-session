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
        this.load.image('turret', 'assets/turret.png');
        this.load.image('skin', 'assets/skin.png');
        this.load.image('platform', 'assets/platform.png');
        this.load.spritesheet('player', 'assets/player.png', 104.28, 89.5);
        this.load.spritesheet('ennemies', 'assets/ennemies.png', 50, 100);
        this.load.image('bullet', 'assets/bullet.png');
        this.load.audio('maintheme', 'assets/audio/maingame.mp3');
    },

    create: function () {


        this.state.start('menu');

    },

    update: function () {

    }
};