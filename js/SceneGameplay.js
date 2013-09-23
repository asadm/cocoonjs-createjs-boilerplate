/*
Gameplay Scene
Author: Asad Memon

A basic gameplay scene that renders a bg and a sprite. Scene pops back to splash on tap.

*/

var SceneGameplay = function() {

	
	this.isBlocking=true;
	this.isReady = false;
	this.stage;
	//this.x =0;
	this.bg;
	this.isActive = false;

	this.stagebg = 0;
	this.stage = 0;
	this._alpha=1;

	this.preloadqueue = new createjs.LoadQueue();

	this._preloadimages();

};

SceneGameplay.prototype.setAlpha = function(val) {
//set everythings alpha to this value.
	this.stage.alpha = val;
	this.stagebg.alpha = val;
	this._alpha=val;
};

SceneGameplay.prototype.getAlpha = function() {
//get scenes alpha to this value.
	return this._alpha;
};

SceneGameplay.prototype.setActive = function(val) {

	this.isActive=val;
};


SceneGameplay.prototype._preloadimages = function() {

 //queue.installPlugin(createjs.Sound);
 this.preloadqueue.addEventListener("complete", this._handleComplete.bind(this));
 //this.preloadqueue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
 this.preloadqueue.loadFile({id:"bg", src:"img/bg.jpg"});
 this.preloadqueue.loadFile({id:"spider", src:"img/spider.png"});

};

SceneGameplay.prototype._handleComplete= function() {
	 //createjs.Sound.play("sound");
	 console.log("loaded images");
	 var imgbg = this.preloadqueue.getResult("bg");
	 var imgspider = this.preloadqueue.getResult("spider");

	 this.bg = new createjs.Bitmap(imgbg);
	 this.spider = new createjs.Bitmap(imgspider);

	 this._init();
};	

SceneGameplay.prototype._init = function() {
	console.log("SceneGamplay::init");
	
	//if(this.isActive) this.cloth.start();

	this.stage = new createjs.Stage("c");
	this.stage.autoClear=false;
	scaleStagetoFill(this.stage);

	this.stagebg = new createjs.Stage("c");
	this.stagebg.autoClear=false;
	scaleStagetoFill(this.stagebg,true);

	//stage.addChild(graphics);
	this.stagebg.addChild(this.bg);

	this.spider.scaleX = this.spider.scaleY = 0.5;
	this.spider.x=100;
	this.spider.y=100;
	this.stage.addChild(this.spider);


	canvas.oncontextmenu = function(e) {
		e.preventDefault(); 
	};

	this.isReady = true;

	console.log("scene ready");

};

SceneGameplay.prototype.draw = function(ctx) {

	var now = new Date().getTime()/1000;
	this._dt = now - this.lasttime;
	this.lasttime = now;


	if (!this.isReady) return;

	this.stagebg.update();
	
	//draw anything else you want on ctx(canvas context) here

	this.stage.update();

};




SceneGameplay.prototype.mousedown =  function(e)
{
	sharedSceneManager.popScene(true);
	e.preventDefault();
}

SceneGameplay.prototype.mouseup= function(e)
{

	e.preventDefault();
}

SceneGameplay.prototype.mousemove= function(e)
{
	if (mouse.down) this.mousedown(e);
}


SceneGameplay.prototype.touchdown= function(touchEvent)
{
	var e= touchEvent.targetTouches[0];
	this.mousedown(e);
}

SceneGameplay.prototype.touchup = function(touchEvent) {
	var e= touchEvent.targetTouches[0];
	this.mouseup(e);
}