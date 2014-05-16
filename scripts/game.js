var canvas;
var stage;
var pileContainer;
var queue;
var loadingText;

var currentText;
var mausteOffset;
var pileHeight;

var mausteList;
var hampurilaiset;
var currentBurgerIndex;
var currentMausteIndex;

function initGame() {
	canvas = document.getElementById("gameCanvas");
	stage = new createjs.Stage(canvas);
	createjs.Touch.enable(stage);

	loadingText = new createjs.Text("Loading...", "24px Averia Sans Libre", "#000000");
	loadingText.x = canvas.width * 0.45;
	loadingText.y = canvas.height * 0.5;
	stage.addChild(loadingText);
	stage.update();

	queue = new createjs.LoadQueue();
	createjs.Sound.alternateExtensions = ["mp3"];
	queue.installPlugin(createjs.Sound);
	queue.addEventListener("complete", handleComplete);

	// Mauste and mausteastia graphics
	mausteList = ["sinappi", "ketsuppi", "sipuli", "kurkku", "juusto", "salaatti", "tomaatti", "paprikamajoneesi", "kurkkumajoneesi", "kansi", "vali", "pohja", "pihvi_pieni", "pihvi_iso", "pekoni"];
	for (var i = 0; i < mausteList.length; i++) {
		queue.loadFile({id: mausteList[i], src: "assets/mausteastiat/" + mausteList[i] + ".png"});
		queue.loadFile({id: "mauste_" + mausteList[i], src: "assets/mausteet/" + mausteList[i] + ".png"});
	}

	// Other files
	queue.loadManifest([
			{id: "sound_blop", src: "assets/sound/blop.ogg"},
			{id: "sound_ketchup", src: "assets/sound/ketchup.ogg"},
			{id: "sound_fail", src: "assets/sound/fail.ogg"},
			{id: "sound_success", src: "assets/sound/success.ogg"},
			{id: "background", src: "assets/misc/background.png"},
			{id: "hampurilaiset", src: "assets/hampurilaiset.json"}
	]);

	mausteOffset = 0;
	pileHeight = 0;
}

function handleComplete(event) {
	stage.removeChild(loadingText);

	var background = new createjs.Bitmap(queue.getResult("background"));
	stage.addChild(background);

	hampurilaiset = queue.getResult("hampurilaiset");

	initGui();
	initAstiat();

	pileContainer = new createjs.Container();
	stage.addChild(pileContainer);

	createjs.Ticker.addEventListener("tick", tick);

	drawBurger();

}

function addMauste(event) {

	var imageSource = event.target.image.src.split("/");
	var fileName = imageSource[imageSource.length-1];
	var mausteId = fileName.substring(0, fileName.length-4);

	if (mausteId == hampurilaiset["hampurilaiset"][currentBurgerIndex]["mausteet"][currentMausteIndex]) {
		var bmp = new createjs.Bitmap(queue.getResult("mauste_" + mausteId));

		if (mausteId == "kansi") {
			mausteOffset += canvas.height * 0.06;
		}
		else if (mausteId == "vali") {
			mausteOffset -= canvas.height * 0.012;
		}

		bmp.regX = bmp.image.width/2|0;
		bmp.regY = bmp.image.height/2|0;
		bmp.scaleX = 0.5;
		bmp.scaleY = 0.5;
		bmp.x = canvas.width * 0.5;
		bmp.y = canvas.height * 0.65 - mausteOffset;

		mausteOffset += canvas.height * 0.016;
		pileHeight++;

		pileContainer.addChild(bmp);
		
		if ((mausteId == "ketsuppi") || (mausteId == "sinappi") || (mausteId == "kurkkumajoneesi") || (mausteId == "paprikamajoneesi")) {
			createjs.Sound.play("sound_ketchup").volume = 0.5;
		}
		else {
			createjs.Sound.play("sound_blop").volume = 0.5;
		}
		currentMausteIndex++;
	}
	else {
		// TODO: 
		drawBurger();
		cleanTheTable();
		createjs.Sound.play("sound_fail").volume = 0.5;
	}

	if (mausteId == "kansi") {
		// TODO:
		drawBurger();
		cleanTheTable();
		createjs.Sound.play("sound_success").volume = 0.5;
	}

}

function initGui() {
	var kasaaText = new createjs.Text("Kasaa:", "30px Averia Sans Libre", "#444444");
	kasaaText.x = canvas.width * 0.02;
	kasaaText.y = canvas.height * 0.9;
	stage.addChild(kasaaText);

	currentText = new createjs.Text("<hampurilaista ei ole asetettu>", "30px Averia Sans Libre", "#000000");
	currentText.x = canvas.width * 0.12;
	currentText.y = canvas.height * 0.9;
	stage.addChild(currentText);

	var resetBg = new createjs.Shape();
	resetBg.graphics.beginFill("#444444").drawRoundRect(0, 0, 100, 50, 10);

	var resetText = new createjs.Text("Uusi", "24px Averia Sans Libre", "#999999");
	resetText.textAlign = "center";
	resetText.textBaseline = "middle";
	resetText.x = 100/2;
	resetText.y = 50/2;

	var resetButton = new createjs.Container();
	resetButton.x = canvas.width * 0.87;
	resetButton.y = canvas.height * 0.87;
	resetButton.addChild(resetBg, resetText);
	resetButton.addEventListener("click", function() {
		drawBurger();
		cleanTheTable();
	});

	stage.addChild(resetButton);
}

function initAstiat() {
	var astiaOffset = 0;

	// sinappi ja ketsuppi
	for (i = 0; i <= 1; i++) {
		var astia = new createjs.Bitmap(queue.getResult(mausteList[i]));
		astia.addEventListener("click", addMauste);
		astia.regX = astia.image.width/2|0;
		astia.regY = astia.image.height/2|0;
		astia.x = canvas.width * 0.21;
		astia.y = canvas.height * 0.25 + astiaOffset;
		astiaOffset += canvas.height * 0.17;
		stage.addChild(astia);
	}

	astiaOffset = 0;

	// sipuli...tomaatti
	for (i = 2; i <= 6; i++) {
		var astia = new createjs.Bitmap(queue.getResult(mausteList[i]));
		astia.addEventListener("click", addMauste);
		astia.regX = astia.image.width/2|0;
		astia.regY = astia.image.height/2|0;
		astia.x = canvas.width * 0.26 + astiaOffset;
		astia.y = canvas.height * 0.1;
		astiaOffset += canvas.width * 0.12;
		stage.addChild(astia);
	}

	astiaOffset = 0;

	// kurkkumajoneesi ja paprikamajoneesi
	for (i = 7; i <= 8; i++) {
		var astia = new createjs.Bitmap(queue.getResult(mausteList[i]));
		astia.addEventListener("click", addMauste);
		astia.regX = astia.image.width/2|0;
		astia.regY = astia.image.height/2|0;
		astia.x = canvas.width * 0.79;
		astia.y = canvas.height * 0.25 + astiaOffset;
		astiaOffset += canvas.height * 0.17;
		stage.addChild(astia);
	}

	astiaOffset = 0;

	// sämpylät
	for (i = 9; i <= 11; i++) {
		var astia = new createjs.Bitmap(queue.getResult(mausteList[i]));
		astia.addEventListener("click", addMauste);
		astia.regX = astia.image.width/2|0;
		astia.regY = astia.image.height/2|0;
		astia.x = canvas.width * 0.08;
		astia.y = canvas.height * 0.12 + astiaOffset;
		astiaOffset += canvas.height * 0.18;
		stage.addChild(astia);
	}

	astiaOffset = 0;

	// lihat
	for (i = 12; i <= 14; i++) {
		var astia = new createjs.Bitmap(queue.getResult(mausteList[i]));
		astia.addEventListener("click", addMauste);
		astia.regX = astia.image.width/2|0;
		astia.regY = astia.image.height/2|0;
		astia.x = canvas.width * 0.92;
		astia.y = canvas.height * 0.12 + astiaOffset;
		astiaOffset += canvas.height * 0.18;
		stage.addChild(astia);
	}

}

function tick(event) {
	stage.update();
}

function drawBurger() {
	var previousBurgerIndex = currentBurgerIndex;

	currentBurgerIndex = Math.floor(Math.random() * hampurilaiset["hampurilaiset"].length);
	while (currentBurgerIndex == previousBurgerIndex) {
		currentBurgerIndex = Math.floor(Math.random() * hampurilaiset["hampurilaiset"].length);
	}

	currentText.text = hampurilaiset["hampurilaiset"][currentBurgerIndex]["name"];
	currentMausteIndex = 0;
}

function cleanTheTable() {
	pileContainer.removeAllChildren();
	mausteOffset = 0;
}