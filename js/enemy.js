Enemy = function (game,x,y) {

    this.minX = 130;
    this.maxX = 4800;
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

Enemy.prototype.verifierSurPlateforme = function(plateformArray)
{
    for (var i = 0; i < plateformArray.length; i++) {
        //console.log(plateformArray[i].y);
        if (this.enemy.x >= plateformArray[i].x
        && this.enemy.x <= plateformArray[i].x + plateformArray[i].width
        && this.enemy.y <= plateformArray[i].y){
            this.minX = plateformArray[i].x;
            this.maxX = plateformArray[i].x + plateformArray[i].scale.x * plateformArray[i].width;

        }

    }
}


