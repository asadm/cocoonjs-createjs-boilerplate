/*
SceneManager
Author: Asad Memon
Description: This is a barebone implementation of a sceneManager. It includes the basic push,pop,replace scene methods.
This class holds a Stack of all the scenes. 
When rendering, it will first go to the top most scene and see if it is a blocking scene
(ie. it is a complete scene and does not show anything behind it, fills screen completely)
if it is, it will start rendering from that scene and go upwards (render the scene on top of it) till the top.

Example:
3
2 (blocking scene)
1

This will render 2 and then 3 on top of it. Skipping scene 1.


*/


var sharedSceneManager = {} ; //global to hold singleton

var SceneManager = function(){

	this.transitionspeed = 0.06;
	this.currentScene=0;
	this.allscenes = [];
	

	//create a full screen stage, used as a bg to the scene list (rendered at the bottom of the scene stack )
	this.blackScreen = new createjs.Stage("c");
	scaleStagetoFill(this.blackScreen,true);
	var black = new createjs.Shape();
    black.graphics.beginFill(createjs.Graphics.getRGB(0,0,0,1));
    black.graphics.rect(0,0,CONSTANTS.WIDTH,CONSTANTS.HEIGHT);
    black.graphics.endFill();
    this.blackScreen.addChild(black);

    //canvas mouse events
    canvas.addEventListener("pointerdown",this.mousedown.bind(this),false);
	canvas.addEventListener("pointermove",this.mousemove.bind(this),false);
	canvas.addEventListener("pointerup",this.mouseup.bind(this),false);

	canvas.addEventListener("touchstart",this.touchdown.bind(this),false);
	canvas.addEventListener("touchmove",this.touchdown.bind(this),false);
	canvas.addEventListener("touchend",this.mouseup.bind(this),false);


};

//replace current scene with this newScene
SceneManager.prototype.replaceScene = function(newscene,withTransition) {

	if (this.currentScene) this.currentScene.setActive(false);
	newscene.setAlpha(0);

	function onComplete(noTransition){
			delete this.currentScene;
			this.allscenes[this.allscenes.length-1] = newscene;
			this.currentScene = this.allscenes[this.allscenes.length-1];
			this.currentScene.setActive(true);
			if (!noTransition)
				var t2 = new TweenOnProperty(newscene.setAlpha.bind(newscene),0,1,this.transitionspeed,null);
			else
				newscene.setAlpha(1);
		};

	if (withTransition)
	{
		if (this.currentScene)
			var t1 = new TweenOnProperty(this.currentScene.setAlpha.bind(this.currentScene),1,0,this.transitionspeed,onComplete.bind(this));
		else
			onComplete.bind(this)(false);

	}
	else
	{
		onComplete.bind(this)(true);
	}
	
};

//add a new scene on top of the current scene (in the scenes stack)
SceneManager.prototype.pushScene = function(newscene,withTransition) {
	if (this.currentScene) this.currentScene.setActive(false);
	newscene.setAlpha(0);

	function onComplete(noTransition){
			this.allscenes.push(newscene);
			this.currentScene = this.allscenes[this.allscenes.length-1];
			this.currentScene.setActive(true);
			if (!noTransition)
				var t2 = new TweenOnProperty(newscene.setAlpha.bind(newscene),0,1,this.transitionspeed,null);
			else
				newscene.setAlpha(1);
		};

	if (withTransition)
	{
		if (this.currentScene)
			var t1 = new TweenOnProperty(this.currentScene.setAlpha.bind(this.currentScene),1,0,this.transitionspeed,onComplete.bind(this));
		else
			onComplete.bind(this)(false);

	}
	else
	{
		onComplete.bind(this)(true);
	}

	
};

//remove the current scene and start rendering the one below it (in the stack)
SceneManager.prototype.popScene = function(withTransition) {
	
	function onComplete(noTransition){
		this.allscenes.pop();
		this.currentScene = this.allscenes[this.allscenes.length-1];
		this.currentScene.setActive(true);
		
		if (!noTransition)
				var t2 = new TweenOnProperty(this.currentScene.setAlpha.bind(this.currentScene),0,1,this.transitionspeed,null);
			else
				this.currentScene.setAlpha(1);

		//this.currentScene.setAlpha(1);
	};

	if (withTransition)
	{
			var t1 = new TweenOnProperty(this.currentScene.setAlpha.bind(this.currentScene),1,0,this.transitionspeed,onComplete.bind(this));
	}
	else
	{
		onComplete.bind(this)(true);
	}
	
};


//the main draw function, this will first draw the black screen and then the scenes from top to bottom.
SceneManager.prototype.draw = function(ctx) {

	this.blackScreen.update();
	
	var renderTill = 0;
	for (var i = this.allscenes.length-1; i>=0; i--)
	{
		var s = this.allscenes[i];

		if (s.isBlocking) {renderTill=i;break;}
	}

	for (var i = renderTill; i>=0; i--)
	{
		var s = this.allscenes[i];
		if (s._alpha>0.01)
			s.draw(ctx);
	}
	//console.log(s._alpha,s);

};



//mouse/touch events
SceneManager.prototype.mousedown =  function(e)
{
	if (this.currentScene) this.currentScene.mousedown(e);
}

SceneManager.prototype.mouseup= function(e)
{
	if (this.currentScene) this.currentScene.mouseup(e);
}

SceneManager.prototype.mousemove= function(e)
{
	if (this.currentScene) this.currentScene.mousemove(e);
}


SceneManager.prototype.touchdown= function(touchEvent)
{
	if (this.currentScene) this.currentScene.touchdown(touchEvent);
}

SceneManager.prototype.touchup = function(e) {
	if (this.currentScene) this.currentScene.touchup(e);
}
