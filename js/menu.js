MyGame.Menu = function (game) {
    this.music = null;
    this.playButton = null;
};

MyGame.Menu.prototype = {
    
    create: function () {
		this.state.start('game');
		
        // On démarre la musique
        this.music = this.add.audio('maingame');
        this.music.play();
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