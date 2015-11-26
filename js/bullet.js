/**
 * Created by ethienneroy on 2015-11-26.
 */
Bullet = function(x,y,game){
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.time = 0;
    //game.physics.arcade.enableBody(this);
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);
//Turret.prototype.constructor = Turret;