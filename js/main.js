
function init() {

	if (navigator.isCocoonJS)
	{
		//use Cocoon's screencanvas if you want, not used here
		canvas= document.createElement('canvas');
		
	}
	else
	{ 
		canvas = document.createElement('canvas');
	}

	//full screen canvas
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	CONSTANTS.SCREENWIDTH =  window.innerWidth;
	CONSTANTS.SCREENHEIGHT =  window.innerHeight;

	//some nasty code inside there, used for my game. May be different for your testcase
	calcScale();

	
	console.log("Screen Size is: "+ window.innerWidth + "x"+window.innerHeight);
	canvas.setAttribute("id", "c");
	//canvas.setAttribute("screencanvas","true");
	canvas.style.cssText="idtkscale:ScaleAspectFill;";
	// CocoonJS extension | http://wiki.ludei.com/cocoonjs:featurelist?s[]=scaleaspectfit#cocoonjs_extended_properties

	document.body.appendChild(canvas);

	//create the holy sceneManager singleton
	sharedSceneManager = new SceneManager();

	//push the splash scene to it
	sharedSceneManager.pushScene(new SceneSplash(),true);

	//set the tick method to be called at regular interval 
	if (!createjs.Ticker.hasEventListener("tick")) { 
		createjs.Ticker.addEventListener("tick", tick);
	  };

	createjs.Ticker.setFPS(30);


}

document.body.onload = init(); //this will call init on page load



function tick() {
	var context = canvas.getContext('2d');
	sharedSceneManager.draw(context);
}

