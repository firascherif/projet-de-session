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
    this.nbrTurrets = 0;
    this.turret;
    this.enemy;
    //this.bullet;
    this.timer;

    var bullets;
    var bulletTime = 0;
};

MyGame.Game.prototype = {

    create : function (game) {


        this.en = new Enemy(game);

        // Game stagetimer
        var background_image = game.add.tileSprite(0,0,1024,600, 'background');
        background_image.autoScroll(-30,0);
        background_image.fixedToCamera = true;

        // La physique du jeu ARCADE
        this.game.physics.startSystem(Phaser.Physics.ARCADE);


        // Core n Skin
        this.core = this.game.add.sprite(0,600, 'core');
        this.skin = this.game.add.sprite(60,600, 'skin');
        this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
        this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);

        //this.game.physics.arcade.gravity.y = 600;
        this.game.world.setBounds(0, 0, 2200, 1200);

        // Platforms
        this.platforms = this.game.add.group();
        this.platforms.enableBody = true;

        //// Ground
        this.ground = this.platforms.create(0,1170,'platform');
        this.ground.scale.setTo(10,2);
        this.jungleGround = this.platforms.create(0,600,'platform');
        this.jungleGround.scale.setTo(10,1);

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
        this.ennemies = this.game.add.group();
        this.ennemies.enableBody = true;
        this.ennemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.ennemies.setAll("body.gravity.y", 500);
        this.ennemies.setAll("body.collideWorldBounds", true);

        // Turrets
        this.turrets = this.game.add.group();
        this.turrets.enableBody = true;
        this.turrets.physicsBodyType = Phaser.Physics.ARCADE;

        // Bullets
        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(30, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 1);
        this.bullets.setAll('outOfBoundsKill', true);
        this.bullets.setAll('checkWorldBounds', true);

        this.enemyWave();

        // Initializing Controls
        //this.cursors = this.game.input.keyboard.createCursorKeys();
        this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
        this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
        this.actionKey.onDown.add(creationTurret, this);

        function creationTurret (){
         if (this.player.player.body.touching.down){

                this.nbrTurrets++;
				this.turrets.add(new Turret(this.player.player.x + 30, this.player.player.y + 14,this.game));

        }
    }

    this.time = this.game.time.now;
},

update : function () {

    this.en.action("mofo");

    var variable = this;
        // Collisions
        this.game.physics.arcade.collide(this.player.player, this.platforms,null,this.player.passerAtravers, this);
        this.game.physics.arcade.collide(this.ennemies, this.platforms);
        this.game.physics.arcade.collide(this.turrets, this.platforms);
        //this.game.physics.arcade.collide(ennemies, player);
        //this.game.physics.arcade.collide(ennemies);

        // Refresh changed values
        this.player.player.body.velocity.x = 0;
        this.player.player.body.acceleration.y = 0;

        this.player.movePlayer();
        this.moveCamera();

        this.changeBackgroundColor(this.game.time.now % 100000);

        
        
        for (var x in this.turrets.children){
			this.turrets.children[x].time += this.game.time.elapsed;
			
			
			
			var dis = Phaser.Point.distance(this.turrets.children[x].position, this.enemy.position);
			
			if(this.turrets.children[x].time > 1000 && dis < 400){
				console.log("bang bang");
				this.turrets.children[x].time = 0;
			}
		}
		
		
        this.game.physics.arcade.overlap(this.bullets, this.ennemies, this.bulletVSenemy, null, this);
        this.game.physics.arcade.overlap(this.core, this.ennemies, this.coreVSenemy, null, this);
        this.game.physics.arcade.overlap(this.ennemies, this.skin, this.enemyVSskin, null, this);


    //faire tirer le bonhomme :
    if(this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
        this.fire();
    }


    },

    changeBackgroundColor : function (time){

      if(time <= 50000){
         var red = (120 - 0.0022*time);
         var green = (253 - 0.002*time);
     }else{
         var timeMod = time % 50000;
         var red = (0.0022*timeMod + 10);
         var green = (153 + 0.002*timeMod);
     }

     this.game.stage.backgroundColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + 255).toString(16).slice(1);

 },

 bulletVSenemy : function(bullet, enemy) {
    bullet.kill();
    enemy.kill();
    this.enemyWave();
},

coreVSenemy : function(core, enemy) {
    this.gui = this.game.add.text(0,0,'YOU LOSE', { fontSize: '32px', fill: '#000' });
    this.gui.fixedToCamera = true;
},

enemyVSskin : function(skin, enemy) {

    enemy.body.velocity.x = -10;
},


turretShoot : function(){

    var speed = 50;

    this.time += this.game.time.now % 1000;

    if (this.time > 30000) {

        this.bullet = this.bullets.create(this.turret.x, this.turret.y, 'bullet');

        if (this.turret.x < this.enemy.x)
            this.bullet.body.velocity.x = speed;
        else
            this.bullet.body.velocity.x = -speed;

            //bullet.body.velocity.y = -(Math.abs(turret.y - enemy.y));

            this.game.physics.arcade.moveToObject(this.bullet, this.enemy,300);

            this.time = 0;
        }
    },

    moveCamera : function(){

        this.game.camera.x = this.player.player.x -512 ;

        if (this.player.player.y < 570){
            if (this.game.camera.y > 30){
                this.game.camera.y -= 15;
            }
        }else {
         if (this.game.camera.y < 600){
            this.game.camera.y += 15;
        }
    }
},

enemyWave : function(){

    this.enemy = this.ennemies.create(1900,1000,'player');
    this.enemy.body.velocity.x = -100;        
    this.game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.gravity.y = 500;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.animations.add('left', [6,7,8], 5, true);
    this.enemy.animations.play('left');
    this.enemy.anchor.set(0.5);
},

createPlatforms : function(){

    var x = 300;

    for (var j = 0; j < 5; j++){
        if(j % 2 === 0){
            for(var i = 0; i < 4 ; i++){
                var y = 1050 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        } else {
            for(var i = 0; i < 3 ; i++){
                var y = 1000 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        }
        x += 400;
    }
},


fullscreen : function() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }

},

render : function () {

        //game.debug.bodyInfo(enemy, 16, 50);
        //game.debug.cameraInfo(game.camera, 32, 32);

    },

fire : function(){
    //  To avoid them being allowed to fire too fast we set a time limit
    if (this.game.time.now > this.bulletTime)
    {
        //  Grab the first bullet we can from the pool
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //  And fire it
            bullet.reset(player.x, player.y + 8);
            bullet.body.velocity.y = 30;
            this.bulletTime = this.game.time.now + 200;
            game.physics.arcade.moveToPointer(bullet, 300);

        }
    }
    console.log('allo');
},

resetBullet : function(bullet){
    bullet.kill();
    //console.log("ca passe");
}



}