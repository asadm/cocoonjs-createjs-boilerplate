/*
Common stuff and Utils

TODO: This class needs a cleanup and is messy.
*/

var CONSTANTS = {
  WIDTH:640,
  HEIGHT:960,
  SCALERATIO:1,
  BGSCALERATIO:1,
  OFFSETX:0,
  OFFSETY:0,
  SCREENWIDTH:0,
  SCREENHEIGHT:0
};

  var mouse = {
    down: false,
    button: 1,
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    spiderdown: false
  };

var canvas,ctx;

// (4.22208334636).fixed(n) will return fixed point value to n places, default n = 3
Number.prototype.fixed = function(n) { n = n || 3; return parseFloat(this.toFixed(n)); };

//Simple linear interpolation
var lerp = function(p, n, t) { var _t = Number(t); _t = (Math.max(0, Math.min(1, _t))).fixed(); return (p + _t * (n - p)).fixed(); };
//Simple linear interpolation between 2 vectors
var v_lerp = function(v,tv,t) { return { x: this.lerp(v.x, tv.x, t), y:this.lerp(v.y, tv.y, t) }; };

//random between some interval
var random = function(from,to){ return Math.floor(Math.random()*(to-from+1)+from);}


//requestAnimationFrame polyfill to support all browsers
window.requestAnimFrame =
window.requestAnimationFrame       ||
//window.webkitRequestAnimationFrame ||
window.mozRequestAnimationFrame    ||
window.oRequestAnimationFrame      ||
window.msRequestAnimationFrame     ||
function(callback) {
    window.setTimeout(callback, 1000 / 60);
};

window.cancelAnimFrame =
window.cancelAnimationFrame       ||
//window.webkitCancelAnimationFrame ||
window.mozCancelAnimationFrame    ||
window.oCancelAnimationFrame      ||
window.msCancelAnimationFrame     ||
function(id) {
    window.clearTimeout(id);
};





function calcScale()
{
	var W = CONSTANTS.WIDTH;
	var H = CONSTANTS.HEIGHT;
	var ScreenW = window.innerWidth;
	var ScreenH = window.innerHeight;

	
	CONSTANTS.SCALERATIO = ScreenH/H;
  CONSTANTS.BGSCALERATIO = CONSTANTS.SCALERATIO; 

  //check if iphone 5ish resolution (low width high height)
  if (W/H > ScreenW/ScreenH ) 
  {
    console.log('iPhone5 like screen (low width/high height)');
    CONSTANTS.SCALERATIO = 1;
  }

	console.log("scale ratio(H): " + CONSTANTS.SCALERATIO);

	//calc offset now
	var diffx = ScreenW-(W*CONSTANTS.SCALERATIO);

  if (W/H != ScreenW/ScreenH)
  	CONSTANTS.OFFSETX = (diffx/2);
  console.log("OFFSETX: " +CONSTANTS.OFFSETX);
}

function scaleStagetoFill(stage,isbg){
	
	

	if (!isbg)
	{
		stage.x = CONSTANTS.OFFSETX;
    stage.scaleX = CONSTANTS.SCALERATIO;
    stage.scaleY = CONSTANTS.SCALERATIO;
	}
  else
  {
    stage.scaleX = CONSTANTS.BGSCALERATIO;
    stage.scaleY = CONSTANTS.BGSCALERATIO;

    if (!navigator.isCocoonJS)
    stage.x = CONSTANTS.OFFSETX;
  }

  //var off2 = CONSTANTS.SCREENWIDTH - CONSTANTS.WIDTH*CONSTANTS.SCALERATIO;

	
}

/* rect to rect intersect check */
function intersectRect(r1, r2) {
  return !(r2.x > r1.x+r1.width || 
           r2.x+r2.width < r1.x || 
           r2.y > r1.y+r1.height ||
           r2.y+r2.height < r1.y);
}






/*
 * Calculated the boundaries of an object.
 *
 * @method getBounds
 * @param {DisplayObject} the object to calculate the bounds from
 * @return {Rectangle} The rectangle describing the bounds of the object
 */
createjs.Bitmap.prototype.getBounds =  function () {

	obj = this;
  var bounds={x:Infinity,y:Infinity,width:0,height:0};
  if ( obj instanceof createjs.Container ) {
    var children = obj.children, l=children.length, cbounds, c;
    for ( c = 0; c < l; c++ ) {
      cbounds = getBounds(children[c]);
      if ( cbounds.x < bounds.x ) bounds.x = cbounds.x;
      if ( cbounds.y < bounds.y ) bounds.y = cbounds.y;
      if ( cbounds.width > bounds.width ) bounds.width = cbounds.width;
      if ( cbounds.height > bounds.height ) bounds.height = cbounds.height;
    }
  } else {
    var gp,gp2,gp3,gp4,imgr;
    if ( obj instanceof createjs.Bitmap ) {
      imgr = obj.image;
    } else if ( obj instanceof createjs.BitmapAnimation ) {
      if ( obj.spriteSheet._frames && obj.spriteSheet._frames[obj.currentFrame] && obj.spriteSheet._frames[obj.currentFrame].image )
        imgr = obj.spriteSheet.getFrame(obj.currentFrame).rect;
      else
        return bounds;
    } else {
      return bounds;
    }

    gp = obj.localToGlobal(0,0);
    gp2 = obj.localToGlobal(imgr.width,imgr.height);
    gp3 = obj.localToGlobal(imgr.width,0);
    gp4 = obj.localToGlobal(0,imgr.height);

    bounds.x = Math.min(Math.min(Math.min(gp.x,gp2.x),gp3.x),gp4.x);
    bounds.y = Math.min(Math.min(Math.min(gp.y,gp2.y),gp3.y),gp4.y);
    bounds.width = Math.max(Math.max(Math.max(gp.x,gp2.x),gp3.x),gp4.x) - bounds.x;
    bounds.height = Math.max(Math.max(Math.max(gp.y,gp2.y),gp3.y),gp4.y) - bounds.y;

    bounds.width /= CONSTANTS.SCALERATIO;
    bounds.height /= CONSTANTS.SCALERATIO;
  }

  return bounds ;
}