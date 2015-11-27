/**
 * Created by ethienneroy on 2015-11-26.
 */
bullet = function(x,y,game){
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.time = 0;

    this.bullet = game.add.image(x,y,'bullet');
    game.physic.enable(this.bullet,Phaser.Physics.ARCADE);

    this.bullet.body.velocity.x =300;
    //var spritePlayer;
    //this.player = game.add.sprite( 200, 1001, 'player', 26);
    //game.physics.enable(this.player, Phaser.Physics.ARCADE);
    //this.player.body.gravity.y = 600;
    //this.player.body.collideWorldBounds = true;

    //game.physics.arcade.enableBody(this);
}

bullet.prototype = Object.create(Phaser.Sprite.prototype);
