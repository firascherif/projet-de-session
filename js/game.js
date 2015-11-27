/* global Phaser */


MyGame.Game = function (game) {

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)


    // Variables du jeu
    this.server = '';//http://localhost:8080/';
    this.player;
    this.cursors;
    this.actionKey;
    this.platforms;
    this.core;
    this.skin;
    this.enemy;
    //this.Bullet;
    this.timer;

    var bullets;
    var bulletTime = 0;
};

MyGame.Game.prototype = {

    create: function (game) {


        this.en = new Enemy(game);

        // Game stagetimer
        var background_image = game.add.tileSprite(0, 0, 2048, 600, 'background');
        background_image.autoScroll(-30, 0);
        background_image.fixedToCamera = true;

        // La physique du jeu ARCADE
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // Core n Skin
        this.core = this.game.add.sprite(0, 600, 'core');
        this.skin = this.game.add.sprite(60, 600, 'skin');
        this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);

        //this.game.physics.arcade.gravity.y = 600;
        this.game.world.setBounds(0, 0, 4400, 1200);

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        //// Ground
        this.ground = this.platforms.create(0, 1170, 'platform2');
        this.ground.scale.setTo(10, 2);
        //this.jungleGround = this.platforms.create(0,600,'platform2');
        //this.jungleGround.scale.setTo(10,1);

        //// Ledges
        this.createPlatforms();

        //platforms.create(200,1850,'platform');
        // platforms.create(580,1790,'platform');
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.checkCollision.down', false);
        this.platforms.setAll('body.checkCollision.left', false);
        this.platforms.setAll('body.checkCollision.right', false);

        // Player
        this.cursors = this.game.input.keyboard.createCursorKeys();
        //var spaceBar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        this.player = new player(this.game, this.cursors);

        // Camera
        this.game.camera.y = 1200;

        // Full screen
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //this.game.input.onDown.add(this.fullscreen, this);

        // Ennemies


        this.enemyArray = new Array();
        this.enemyArray.push(new Enemy(this.game, 365, 600, 100, 400),
            new Enemy(this.game, 500, 600, 300, 400),
            new Enemy(this.game, 765, 600, 715, 840),
            new Enemy(this.game, 1170, 600, 1100, 1240),
            new Enemy(this.game, 1965, 1000, 300, 400));


        // Bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'test');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        //this.enemyWave();

        // Initializing Controls
        //this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.actionKey3 = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.actionKey3.onDown.add(creationBullet, this);

        function creationBullet() {
            this.bullets.add(new Bullet(30, 30, this.game));
        }


        this.time = this.game.time.now;
    },

    update: function () {

        this.en.action("mofo");

        var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player.player, this.platforms, null, this.player.passerAtravers, this);

        // Refresh changed values
        this.player.player.body.velocity.x = 0;
        this.player.player.body.acceleration.y = 0;

        this.player.movePlayer();
        for (var i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].moveEnemy();
            this.game.physics.arcade.collide(this.enemyArray[i].enemy, this.platforms);
        }
        this.moveCamera();

        this.changeBackgroundColor(this.game.time.now % 100000);


        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.core, this.enemy, this.coreVSenemy, null, this);
        this.game.physics.arcade.overlap(this.enemy, this.skin, this.enemyVSskin, null, this);


        //faire tirer le bonhomme :
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.fire();
        }


    },

    changeBackgroundColor: function (time) {

        if (time <= 50000) {
            var red = (120 - 0.0022 * time);
            var green = (253 - 0.002 * time);
        } else {
            var timeMod = time % 50000;
            var red = (0.0022 * timeMod + 10);
            var green = (153 + 0.002 * timeMod);
        }

        this.game.stage.backgroundColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + 255).toString(16).slice(1);

    },

    bulletVSenemy: function (bullet, enemy) {
        bullet.kill();
        enemy.kill();
        //this.enemyWave();
    },

    coreVSenemy: function (core, enemy) {
        this.gui = this.game.add.text(0, 0, 'YOU LOSE', {fontSize: '32px', fill: '#000'});
        this.gui.fixedToCamera = true;
    },

    enemyVSskin: function (skin, enemy) {

        //enemy.body.velocity.x = -10;
    },


    moveCamera: function () {

        this.game.camera.x = this.player.player.x - 512;

        if (this.player.player.y < 570) {
            if (this.game.camera.y > 30) {
                this.game.camera.y -= 15;
            }
        } else {
            if (this.game.camera.y < 600) {
                this.game.camera.y += 15;
            }
        }
    },

    enemyWave: function () {

        //this.enemy = new Enemy(1000,500,this.game);
        //this.enemy.body.velocity.x = -100;
        //this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
        //this.enemy.body.gravity.y = 500;
        //this.enemy.body.collideWorldBounds = true;
        //this.enemy.animations.add('left', [6,7,8], 5, true);
        //this.enemy.animations.play('left');
        //this.enemy.anchor.set(0.5);
    },

    createPlatforms: function () {

        var x = 300;
        plateformArray = new Array();

        function verifierPlateformePosition(x, y) {
            if (y < 910 || x < 250) {
                return true;
            }
            return false//parametreOkay;
        }

        function verifierVoisinPlateforme(array,x,y, scale) {
            for (var i = 0; i < array.length; i++) {
                if (array[i].x + 300 >= x - scale && array[i].y + 350 >= y &&
                    array[i].x - 100 <= x - scale && array[i].y - 215 <= y){
                    console.log("false");
                    return false;
                }
            }
            return true;
        }
        for(var i = 0;i<1000;i++){//avec un while boucle infinie
                do {
                    y = Math.random(1100, 1250) * 1000 + 123;
                    x = Math.random(250, 4400) * 4400 + 500;
                } while (verifierPlateformePosition(x, y));
                //console.log(x);
                do {
                    tmp = Math.random(0.4, 0.5);
                } while (tmp < 0.4);

            if(verifierVoisinPlateforme(plateformArray,x,y, tmp)) {
                //this.p = this.platforms.create(x, y, 'platform');
                //this.p.scale.setTo(tmp, 0.5);
                plateformArray.push(this.platforms.create(x, y, 'platform'));
                //console.log(plateformArray.length);
            }

        }
    },


    fullscreen: function () {

        if (this.game.scale.isFullScreen) {
            this.game.scale.stopFullScreen();
        }
        else {
            this.game.scale.startFullScreen(false);
        }

    },

    render: function () {

        //game.debug.bodyInfo(enemy, 16, 50);
        //game.debug.cameraInfo(game.camera, 32, 32);

    },

    fire: function () {

        var tmp = this.bullets.getFirstDead();
        console.log(tmp.x);
        if (tmp) {
            tmp.reset(this.player.x, this.player.y + 8);
            tmp.body.velocity.y = 30;
            this.bulletTime = this.game.time.now + 200;
        }

    },

    resetBullet: function (bullet) {
        bullet.kill();
    }


}