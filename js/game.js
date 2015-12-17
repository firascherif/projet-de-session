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


    this.pointage = 0;
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
    this.enemyStrong;
    this.plateformArray;
    this.minX;
    this.maxX;
    var bullet;
    this.bulletTime = 0;
    this.plateformeLimite;
    this.nbEnemy;
    var star
    var score = 0;
    var scoreText;
    var kill = true;
    var explosions;
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

        this.plateformeLimite = this.game.add.group();
        // Core n Skin
        //this.core = this.game.add.sprite(0, 600, 'core');
        this.skin = this.game.add.sprite(0, 600, 'skin');
        //this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
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
        //this.score();


        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.checkCollision.down', false);
        this.platforms.setAll('body.checkCollision.left', false);
        this.platforms.setAll('body.checkCollision.right', false);

        //score
        this.score();

        // Player
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.player = new player(this.game, this.cursors);

        // Camera
        this.game.camera.y = 1000;

        // plein ecran
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.input.onDown.add(this.fullscreen, this);

//creation aleatoire des ennemies 

        this.platformArray = new Array();
        this.enemies = this.game.add.group();
        this.enemyStrong = this.game.add.group();
        this.generateEnemies();



        //  Explosion pool
        explosions = this.game.add.group();
        this.game.physics.arcade.enable(explosions);
        //for (var i = 0; i < 10; i++)
        //{
        //    var w = this.explosions.create(100, 1000, 'explosion');
        //}
        //
        //explosions.setAll('exists',false);
        //setter la distance min et max de x si sur plateforme
        //for(var i = 0;i<this.enemyArray.length;i++){
        //    this.enemyArray[i].verifierSurPlateforme(plateformArray);
        //}

        // Bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'test');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.setAll('exists',false);
        //this.enemyWave();

        // Initializing Controls
        //this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.actionKey3 = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        //this.actionKey3.onDown.add(creationBullet, this);

        this.time = this.game.time.now;
    },

    generateEnemies: function () {
        this.nbEnemy = 25 - this.enemies.alive;
        for(var i =0;i<this.nbEnemy;i++) {
            //console.log('coucou');
            posX  = Math.random() * 4800 + 400;
            //    posX = 800;
            posY = Math.random() * 900;
            //tmp = new Enemy(this.game, posX,posY)
            //this.enemyArray.push(tmp);
            var w = this.enemies.create(posX+400,posY,'enemy');
            //console.log(this.enemies);
            //this.enemyArray[i].enemy.set('body.checkCollision.left',true);
        }
        //this.enemies.checkCollision.left = true
        //this.enemies.setAll('body.checkCollision.left',true);
        this.enemies.enableBody = true;
        this.game.physics.enable(this.enemies);
        this.enemies.setAll('body.velocity.x',-100,true);
        this.enemies.setAll('checkCollision.up',true);
        this.enemies.setAll('body.gravity.y',500,true);
        this.enemies.callAll('animations.add', 'animations', 'left', [143,144,145,146,147,148,149,150], 10, true);
        this.enemies.callAll('animations.add', 'animations', 'right', [117,118,119,120,121,122,123,124], 10, true);
        this.enemies.setAll('body.collideWorldBounds',true);
        this.enemies.setAll('body.bounce.x',1,0);


        for (var i=0;i<4;i++){
            posX =  Math.random() * 3700 +300;
            posY = Math.random()*900;
            var e = this.enemyStrong.add(posX,posY,'enemie');
        }
        this.door = this.enemyStrong.create();
        this.door = this.door.create(5322,590,'door');
        this.door.enableBody = true;
        this.door.immovable=true;
    },

    update: function () {
        //this.explosions.setAll('animations.play','animations','explosion');

        //temporaire je crois***
        if(this.player.player.body.x >= 5330) {
            this.player.player.kill();
            this.player.levelOver = true;
            console.log("Loader le prochain niveau");
        }

        if(this.player.levelOver){
            this.generateEnemies();
            this.player.player.body.x = 200;
            this.player.player.body.y = 600;
            this.player.player.revive();
            this.player.levelOver = false;
            //this.player.player.reset(200,600);

        }
        if (this.game.physics.arcade.collide(this.player.player, this.enemies)) {
            this.player.player.kill();
            this.player.levelOver = true;
            //this.enemies
        }

        //if(this.game.physics.arcade.collideLeft(this.player.player,this.enemies.up)){
        //    console.log('toucher');
        //}
        this.game.physics.arcade.overlap(this.bullets, this.enemies, this.flecheCollisionEnemy);
        this.game.physics.arcade.overlap(this.stars,this.player.player,this.ramasseEtoile);

        //for(var i=0;i<this.bullets.length;i++) {
        //    this.game.physics.arcade.collide(this.bullets.getFirstAlive(), this.enemies,this.flecheCollisionEnemy,this);
        //        //this.bullets.getFirstAlive().kill();
        //}


        this.en.action("mofo");

        var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player.player, this.platforms, null, this.player.passerAtravers, this);
        this.game.physics.arcade.collide(this.enemies, this.ground);
        this.game.physics.arcade.collide(this.enemies, this.platforms);
        this.game.physics.arcade.collide(this.enemies, this.plateformeLimite);
        this.game.physics.arcade.collide(this.stars, this.platforms);
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.game.physics.arcade.overlap(this.enemy, this.skin, this.enemyVSskin, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemies, this.flecheCollisionEnemy);



        // Refresh changed values
        this.player.player.body.velocity.x = 0;
        this.player.player.body.acceleration.y = 0;

        this.player.movePlayer();

        this.moveCamera();


        //this.game.physics.arcade.overlap(this.bullets, this.enemy, this.bulletVSenemy, null, this);
        //this.game.physics.arcade.overlap(this.core, this.enemy, this.coreVSenemy, null, this);
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

    ramasseEtoile : function(player,etoile){
        etoile.kill();
    },

    score: function () {
        this.scoreText = this.game.add.text(0, 0, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
    },

    createPlatforms: function () {

        x = 300;
        this.plateformArray = new Array();

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
                var e = this.platforms.create(200, 950, 'platform');
                b.body.immovable = true;
                c.body.immovable = true;
                d.body.immovable = true;
                e.body.immovable = true;
                d.body.checkCollision.down = false;
                e.body.checkCollision.down = false;
                d.body.checkCollision.right = true;
                b.body.checkCollision.left = true;
                c.body.checkCollision.left = true;
                d.body.checkCollision.left = true;
                b.body.checkCollision.right = true;
                b.body.checkCollision.up = false;
                e.body.checkCollision.up = true;
                c.body.checkCollision.right = true;
                e.body.checkCollision.right = false;
                c.body.checkCollision.up = false;
                this.game.physics.arcade.collide(b,this.enemies);
                this.game.physics.arcade.collide(c,this.enemies);
                this.game.physics.arcade.collide(e,this.player);
                b.visible = true;
                b.exists = true;
                c.visible = true;
                c.exists = true;
                d.exists = true;
                b.scale.setTo(0.0001,0.1);
                c.scale.setTo(0.0001,0.1);
                this.plateformArray.push(d);
                this.plateformArray.push(e);
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
            if (this.game.time.now > this.bulletTime)
            {
                bullet = this.bullets.getFirstExists(false);
                this.resetBullet(bullet);
                if (bullet && this.player.playerFacing !== "idle")
                {
                    bullet.reset(this.player.player.x + 6, this.player.player.y);
                    bullet.lifespan = 2000;
                    if(this.player.playerFacing === "left") {
                            //bullet.reset();
                            bullet.scale.setTo(-1);
                        bullet.body.velocity.x = -300;
                    }
                    else if(this.player.playerFacing === "right") {
                        //bullet.reset();
                        bullet.body.velocity.x = 300;
                    }
                    this.bulletTime = this.game.time.now + 300;
                }
            }


        
    },
	

    resetBullet: function (bullet) {
        bullet.kill();
    },


    flecheCollisionEnemy: function(bullet, enemy){
        enemy.kill();
        var boom = explosions.create(enemy.x,enemy.y,'explosion');
        boom.animations.add('explosion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,15], 16, false);
        boom.animations.play('explosion',15,false,true);

        this.enemy--;
        bullet.kill();
    }


}