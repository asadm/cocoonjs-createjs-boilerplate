/*
Splash Scene
Author: Asad Memon

A basic splash scene that renders a splash screen. Scene changes on tap.

*/

var SceneSplash = function() {
	this._dt =0;
	this.lasttime= new Date().getTime()/1000;

	this.isBlocking=true;
	this.isReady = false;
	this.bg;
	this.isActive = false;

	this.stagebg = 0;
	this._alpha=1;

	this.preloadqueue = new createjs.LoadQueue();

	this._preloadimages();

};

SceneSplash.prototype.setAlpha = function(val) {
//set everythings alpha to this value.
	this.stagebg.alpha = val;
	this._alpha=val;
};

SceneSplash.prototype.getAlpha = function() {
//get scenes alpha to this value.
	return this._alpha;
};

SceneSplash.prototype.setActive = function(val) {

this.isActive=val;

};


SceneSplash.prototype._preloadimages = function() {

 //queue.installPlugin(createjs.Sound);
 this.preloadqueue.addEventListener("complete", this._handleComplete.bind(this));
 //this.preloadqueue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
 this.preloadqueue.loadFile({id:"bg", src:"img/splash.jpg"});


};

SceneSplash.prototype._handleComplete= function() {
	 //createjs.Sound.play("sound");
	 console.log("loaded images");
	 var imgbg = this.preloadqueue.getResult("bg");


	 this.bg = new createjs.Bitmap(imgbg);
	 this._init();
};	

SceneSplash.prototype._init = function() {
	console.log("SceneSplash::init");
	

	this.stagebg = new createjs.Stage("c");
	this.stagebg.autoClear=false;
	scaleStagetoFill(this.stagebg,true);

	this.stagebg.addChild(this.bg);

	/*some text*/
	var text = new createjs.Text("Click To Play", "20px Arial", "#000000");
 	text.x = (CONSTANTS.WIDTH/2) + text.getMeasuredWidth()/2;
 	text.y = CONSTANTS.HEIGHT/2;
 	//this.stagebg.addChild(text);



	canvas.oncontextmenu = function(e) {
		e.preventDefault(); 
	};

	this.isReady = true;

	console.log("scene ready");

};

SceneSplash.prototype.draw = function(ctx) {

	var now = new Date().getTime()/1000;
	this._dt = now - this.lasttime;
	this.lasttime = now;


	if (!this.isReady) return;

	this.stagebg.update();

};




SceneSplash.prototype.mousedown =  function(e)
{
	sharedSceneManager.pushScene(new SceneGameplay(),true);
	e.preventDefault();
}

SceneSplash.prototype.mouseup= function(e)
{

	e.preventDefault();
}

SceneSplash.prototype.mousemove= function(e)
{
	//if (mouse.down) this.mousedown(e);
}


SceneSplash.prototype.touchdown= function(touchEvent)
{
	var e= touchEvent.targetTouches[0];
	this.mousedown(e);
}

SceneSplash.prototype.touchup = function(e) {
	this.mouseup(e);
}