player = function(game, cursors){

	this.cursors = cursors;
	this.playerFacing = 'left';
	
	//Créer le player
	this.player = game.add.sprite( 200, 1001, 'player', 26);
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.gravity.y = 700;
	this.player.body.collideWorldBounds = true;


	this.player.animations.add('idleRight', [143], 1, true);
	//var tmp = new Phaser.Animation(this.game,this.player,'test',"assets/player.png",[7,8,9,10,11,12],true);
	//this.player.animations.add(tmp);
	this.player.animations.add('idleLeft', [117], 1, true);
	this.player.animations.add('right', [143,144,145,146,147,148,149,150], 10, true);
	this.player.animations.add('left', [117,118,119,120,121,122,123,124], 10, true);
	//this.player.animations.play('idle', 7, true);
	this.player.anchor.set(0.5);

	
};

player.prototype.passerAtravers = function(player, platform){
		
		return !this.actionKey2.isDown;
}

player.prototype.movePlayer = function(){

	if (this.cursors.left.isDown)
	{
		this.player.body.velocity.x = -200;

			this.player.animations.play('left');
			this.playerFacing = 'left';
	}else if (this.cursors.right.isDown)
	{
		this.player.body.velocity.x = 200;

			this.player.animations.play('right');
			this.playerFacing = 'right';
	}else
	{
        this.player.animations.stop();
	}

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
		this.player.body.velocity.y = -450;

    }

    if (this.cursors.down.isDown && this.player.body.touching.down)
    {
        this.player.body.velocity.y = 100;

    }

    if (!this.player.body.touching.down)
	{
        if (this.playerFacing === 'left')
            this.player.frame = 117;
        else if (this.playerFacing === 'idle')
            this.player.frame = 26;
        else if (this.playerFacing === 'right')
            this.player.frame = 143;
    }

    if (!this.player.body.touching.down && this.cursors.down.isDown)
	{
        this.player.body.acceleration.y = 2000;
    }else if (this.player.body.touching.down && this.cursors.down.isDown)
	{

            // crouching
    }

    if (this.player.body.touching.down && this.cursors.shiftKey && this.cursors.down.isDown){

            // getting down from platforms
    }
}