Turret = function(x,y,game){
	Phaser.Sprite.call(this, game, x, y, 'turret');
	this.time = 0;
	//game.physics.arcade.enableBody(this);
}

Turret.prototype = Object.create(Phaser.Sprite.prototype);
//Turret.prototype.constructor = Turret;