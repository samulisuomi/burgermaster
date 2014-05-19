function initMenu() {
	canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);

	//TODO: menu ui
	if (window.confirm('Start the game?')) {
		// This needs to be bind to a "Start" button
	    switchToGame();
	} else {
		// Blank page
	}
}

function switchToGame() {
	$.getScript("scripts/game.js", function(){
	   initGame();
	});
}