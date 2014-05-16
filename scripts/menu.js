function initMenu() {
	alert("Menu script");

	// This block starts the game script:
	$.getScript("scripts/game.js", function(){
	   initGame();
	});
}