MyGame.Menu = function (game) {
    this.music = null;
    this.playButton = null;
};

MyGame.Menu.prototype = {
    
    create: function () {
        // On démarre la musique
        this.music = this.add.audio('maingame');
        this.music.play();

        this.speed = 10;

            this.bg = this.game.add.tileSprite(0,0,1782,600,'menu');
            this.bg.autoScroll(-this.speed,0);

            var style = { font: "48px Arial", fill: "#FFFFFF", align: "center" };
            this.title = this.game.add.text(370,190,"Game Shooter",style);

            var style2 = { font: "28px Arial", fill: "#FFFFFF", align: "center" };
            this.help = this.game.add.text(370,250,"Press `Enter` Key to start",style2);


		//this.state.start('game');
		
        
    },

    update: function () {
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER))
                this.game.state.start('game');
       
    },

    //startGame: function (pointer) {
        // On arrête la musique avant de démarrer le jeu
    //    this.music.stop();
        // Puis on démarre !
    //    this.state.start('game');
    //}
};