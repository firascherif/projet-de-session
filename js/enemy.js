Enemy = function (game,x,y,minX,maxX) {

    this.minX = minX;
    this.maxX = maxX;
	this.enemyFacing = 'left';

	//Créer l'enemy
	this.enemy = game.add.sprite(x,y, 'enemy', 26);
	game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
	this.enemy.body.gravity.y = 500;
	this.enemy.body.collideWorldBounds = true;

	this.enemy.animations.add('right', [143,144,145,146,147,148,149,150], 10, true);
	this.enemy.animations.add('left', [117,118,119,120,121,122,123,124], 10, true);
	this.enemy.body.velocity.x = -100;
    this.enemy.animations.play('left');
	this.enemy.anchor.set(0.5);

};


Enemy.prototype.action = function(mofo){

	
}

Enemy.prototype.moveEnemy = function(){
    if(this.enemy.x >= this.maxX){
        this.enemy.body.velocity.x = -100;
        this.enemy.animations.play('left');
    }else if(this.enemy.x <= this.minX){
        this.enemy.body.velocity.x = 100;
        this.enemy.animations.play('right');
    }


}



