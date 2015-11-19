player = function(game, cursors){

	this.cursors = cursors;
	this.playerFacing = 'right';
	
	//Créer le player
	this.player = game.add.sprite(200,1000, 'player');    
	game.physics.enable(this.player, Phaser.Physics.ARCADE);
	this.player.body.gravity.y = 600;
	this.player.body.collideWorldBounds = true;
	this.player.animations.add('idleRight', [8,9,10,11,12,13,14], 5, true);
	this.player.animations.add('idleLeft', [29,30,31,32,33,34,35], 5, true);
	this.player.animations.add('right', [15,16,17,18,19,20,21], 5, true);
	this.player.animations.add('left', [1,2,3,4,5,6,7], 5, true);
	//player.animations.play('idle', 10, true);
	this.player.anchor.set(0.5);

	
};

player.prototype.passerAtravers = function(player, platform){
		
		return !this.actionKey2.isDown;
}

player.prototype.movePlayer = function(){

	if (this.cursors.left.isDown)
	{
		this.player.body.velocity.x = -300;

		if (this.playerFacing !== 'left')
		{
			this.player.animations.play('left');
			this.playerFacing = 'left';
		}
	}else if (this.cursors.right.isDown)
	{
		this.player.body.velocity.x = 300;

		if (this.playerFacing !== 'right')
		{
			this.player.animations.play('right');
			this.playerFacing = 'right';
		}
	}else 
	{

		if (this.playerFacing !== 'idle')
		{
			this.player.animations.stop();

			if (this.playerFacing === 'left')
			{
			   this.player.animations.play('idleLeft');
			}
			else
			{
			   this.player.animations.play('idleRight');
			}

			this.playerFacing = 'idle';
	   }
	}

    if (this.cursors.up.isDown && this.player.body.touching.down)
    {
		this.player.body.velocity.y = -400;

    }

    if (!this.player.body.touching.down)
	{

        if (this.playerFacing === 'left')
            this.player.frame = 12;
        else if (this.playerFacing === 'idle')
            this.player.frame = 13;
        else if (this.playerFacing === 'right')
            this.player.frame = 14;
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