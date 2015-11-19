MyGame.Menu = function (game) {
    this.music = null;
    this.playButton = null;
};

MyGame.Menu.prototype = {
    
    create: function () {
		this.state.start('game');
		
        // On démarre la musique
        this.music = this.add.audio('maintheme');
        this.music.play();
        // //this.playButton = this.add.button(this.world.centerX, this.world.centerY,
          // //                                'play-button', this.startGame, this,
            // //                              2, 1, 0, 2);
        // this.playButton.anchor.setTo(0.5, 0.5);
    },

    update: function () {
        // Normalement, il y a quelque chose ici
    },

    startGame: function (pointer) {
        // On arrête la musique avant de démarrer le jeu
        this.music.stop();
        // Puis on démarre !
        this.state.start('game');
    }
};