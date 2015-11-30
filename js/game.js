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
    this.timer;
    this.enemies;
    this.plateformArray;
    this.minX;
    this.maxX;
    var bullets;
    var bulletTime = 0;

    var star
    var score = 0;
    var scoreText;
    var kill = true;

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

        //stars
        this.stars = this.game.add.group();
        this.stars.enableBody = true;


        for (var i = 0; i < 12; i++)
        {
            this.star = this.stars.create(i * 400, 20, 'star');
            this.star.body.gravity.y = 6;
            this.star.body.bounce.y = 0.2 + Math.random() * 0.2;
        }



        this.game.world.setBounds(0, 0, 5400, 1200);

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        //// Ground
        this.ground = this.platforms.create(0, 1180, 'platform2');
        this.ground.scale.setTo(10, 2);
        

        //this.plateformeLimite.setAll('body.immovable',true);
        this.plateformeLimite.setAll('body.checkCollision.left',true);
        this.plateformeLimite.setAll('body.checkCollision.right',true);
        this.plateformeLimite.setAll('body.checkCollision.down',false);
        this.plateformeLimite.setAll('body.checkCollision.up',false);
        this.plateformeLimite.setAll('body.checkCollision.up',false);
        this.plateformeLimite.setAll('visible',false);
        this.plateformeLimite.enableBody = true;
        //this.plateformeLimite.setAll('scale.setTo',0.1,0.2);


        //// Ledges
        this.createPlatforms();

        //score
        this.score();


        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.checkCollision.down', false);
        this.platforms.setAll('body.checkCollision.left', false);
        this.platforms.setAll('body.checkCollision.right', false);

        // Player
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.player = new player(this.game, this.cursors);

        // Camera
        this.game.camera.y = 1000;

        // plein ecran
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.input.onDown.add(this.fullscreen, this);

//creation aleatoire des ennemies 

        this.enemyArray = new Array();
        this.enemies = this.game.add.group();

        for(var i =0;i<25;i++) {
            //console.log('coucou');
                posX  = Math.random() * 4800 + 100;
            //    posX = 800;
                posY = Math.random() * 900;
                //tmp = new Enemy(this.game, posX,posY)
                //this.enemyArray.push(tmp);
                var w = this.enemies.create(posX,posY,'enemy');
                //console.log(this.enemies);
                //this.enemyArray[i].enemy.set('body.checkCollision.left',true);
        }
        //this.enemies.checkCollision.left = true
        //this.enemies.setAll('body.checkCollision.left',true);
        this.enemies.enableBody = true;
        this.game.physics.enable(this.enemies);
        this.enemies.setAll('body.velocity.x',-100,true);
        this.enemies.setAll('body.gravity.y',500,true);
        this.enemies.callAll('animations.add', 'animations', 'left', [143,144,145,146,147,148,149,150], 10, true);
        this.enemies.callAll('animations.add', 'animations', 'right', [117,118,119,120,121,122,123,124], 10, true);
        this.enemies.setAll('body.collideWorldBounds',true);
        this.enemies.setAll('body.bounce.x',1,0);

        //setter la distance min et max de x si sur plateforme
        for(var i = 0;i<this.enemyArray.length;i++){
            this.enemyArray[i].verifierSurPlateforme(plateformArray);
        }

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
        if (this.game.physics.arcade.collide(this.player.player, this.enemies)) {
            this.player.player.kill();
            //this.enemies
        }
        this.en.action("mofo");

        var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player.player, this.platforms, null, this.player.passerAtravers, this);
        this.game.physics.arcade.collide(this.enemies, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.platforms);
        this.game.physics.arcade.collide(this.enemies, this.plateformeLimite);
        //for (var i = 0; i < this.enemies.length; i++) {
        //    if (this.game.physics.arcade.collide(this.enemies.getAt(i), this.platforms)) {
        //        this.enemies.getAt(i).body.velocity.x *= -1;
        //        console.log('vire de bord');
        //    }
        //}


        // Refresh changed values
        this.player.player.body.velocity.x = 0;
        this.player.player.body.acceleration.y = 0;

        this.player.movePlayer();
        for (var i = 0; i < this.enemyArray.length; i++) {
            this.enemyArray[i].moveEnemy();
            this.game.physics.arcade.collide(this.enemyArray[i].enemy, this.platforms);
        }
        this.moveCamera();


        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.core, this.enemy, this.coreVSenemy, null, this);
        this.game.physics.arcade.overlap(this.enemy, this.skin, this.enemyVSskin, null, this);


        //faire tirer le bonhomme :
        if (this.game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            this.fire();
        }

        for (var z = 0; z < this.enemies.length; z++) {
            enemy = this.enemies.getAt(z);

            if (this.enemies.getAt(z).body.velocity.x > 0) {
                this.enemies.getAt(z).animations.play('left');
            }
            else if (this.enemies.getAt(z).body.velocity.x < 0) {
                this.enemies.getAt(z).animations.play('right');
            }
            if (this.enemies.getAt(z).body.x < 130 || this.enemies.getAt(z).body.x > 4800) {
                this.enemies.getAt(z).body.velocity.x *= -1;
            }
        }

        //
        //        for(var i=0;i<this.platforms.length;i++){
        //                if ((this.enemies.getAt(z).body.x <= this.platforms.getAt(i).x
        //                    || this.enemies.getAt(z).body.x >= this.platforms.getAt(i).x + this.platforms.getAt(i).width)
        //                        //&& enemy.body.velocity.y == 0
        //                ) {
        //                    //console.log('coucou');
        //                    this.minX = this.platforms.getAt(i).x;
        //                    this.maxX = this.platforms.getAt(i).x + this.platforms.getAt(i).width;
        //                    verifierSortirPlateforme(this.minX,this.maxX,this.enemies.getAt(z));
        //                    //console.log("plateforme["+i+"] : " +  this.platforms.getAt(i).x + this.platforms.getAt(i).width);
        //                    //this.enemies.getAt(z).body.velocity.x *= -1;
        //                }
        //                else if(this.enemies.getAt(z).body.y == this.platforms.getAt(i).y){
        //                    //console.log('allo');
        //                    this.minX = 130;
        //                    this.maxX = 4800;
        //                    verifierSortirPlateforme(130,4800,enemy);
        //
        //                }
        //        }
        //        if(this.enemies.getAt(z).body.x < this.minX || this.enemies.getAt(z).body.x > this.maxX) {
        //            //console.log(this.maxX);
        //            this.enemies.getAt(z).body.velocity.x *= -1;
        //
        //            //console.log('switch side');
        //        }
        //
        //    }




    },



    bulletVSenemy: function (bullet, enemy) {
        bullet.kill();
        enemy.kill();
        this.enemyWave();
    },

    coreVSenemy: function (core, enemy) {
       // this.gui = this.game.add.text(0, 0, 'GAME OVER', {fontSize: '32px', fill: '#fff'});
        //this.gui.fixedToCamera = true;
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

        this.enemy = new Enemy(1000,500,this.game);
        this.enemy.body.velocity.x = -100;
        this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
        this.enemy.body.gravity.y = 500;
        this.enemy.body.collideWorldBounds = true;
        
		this.enemy.animations.add('left', [6,7,8], 5, true);
        this.enemy.animations.play('left');
        this.enemy.anchor.set(0.5);
    },

    createPlatforms: function () {

        x = 300;
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

            if(verifierVoisinPlateforme(this.plateformArray,x,y, tmp)) {
                //this.p = this.platforms.create(x, y, 'platform');
                //this.p.scale.setTo(tmp, 0.5);
                var b = this.plateformeLimite.create(x,y-50,'core');
                var c = this.plateformeLimite.create(x+190,y-50,'core');
                var d = this.platforms.create(x, y, 'platform');
                b.body.immovable = true;
                c.body.immovable = true;
                d.body.immovable = true;
                d.body.checkCollision.down = false;
                d.body.checkCollision.right = true;
                b.body.checkCollision.left = true;
                c.body.checkCollision.left = true;
                b.body.checkCollision.right = true;
                b.body.checkCollision.up = false;
                c.body.checkCollision.right = true;
                c.body.checkCollision.up = false;
                this.game.physics.arcade.collide(b,this.enemies);
                this.game.physics.arcade.collide(c,this.enemies);
                b.visible = true;
                b.exists = true;
                c.visible = true;
                c.exists = true;
                b.scale.setTo(0.0001,0.1);
                c.scale.setTo(0.0001,0.1);
                this.plateformArray.push(d);
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

      /*  var tmp = this.bullets.getFirstDead();
        console.log(tmp.x);
        if (tmp) {
            tmp.reset(this.player.x, this.player.y + 8);
            tmp.body.velocity.y = 30;
            this.bulletTime = this.game.time.now + 200;
        }
		*/
		
            // fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = -400;
            bulletTime = game.time.now + 200;
        
    },
	

    resetBullet: function (bullet) {
        bullet.kill();
    },


    verifierCollisionEnemy: function(enemy,player){

        //enemy.kill();
        //player.player.kill();
        //console.log('dead');
        //if(this.kill == true){
        //    this.kill = false;
        //}
        //this.game.time.events.add(Phaser.Timer.SECOND, function ()
        //{
        //    kill = true;
        //});



    }


}