Enemy = function (game) {

	Phaser.Sprite.call(this, game, 1, 1, "player")
	//this.sprite = game.add.sprite(500, 500, 'creep');
	//this.sprite.set.anchor.setTo(0.5, 0.5);
	//game.physics.arcade.enableBody(this.sprite);
	//this.sprite.body.collideWorldBounds = true;


};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);

Enemy.prototype.action = function(mofo){

	
}
