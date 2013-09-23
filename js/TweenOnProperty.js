/*
Tween On Property v.0.1
Description: This class helps you tween between two values of any object or anything that has numberic/float values

Example: Object.opacity, you just give setter method to object's opacity value and a starting and ending values.
Along with stepsize and a callback which will be called on completion of this tween.

Known Issue:
currently the animation is on fixed step 0.015.

Author: Asad Memon


Example Usage:

function set (val) { console.log(val); };
var t = new TweenOnProperty(set,0.1,1,0.1,null);

*/
var TweenOnProperty = function(setvalmethod,startval,endval,stepsize,OnCompletedCallback){
	
	//animation stuff for timing and stuff
	this._dt =0;
	this.lasttime= new Date().getTime()/1000;
	this.updateid = 0;

	//values and values
	this.currentval = startval;
	this.isPlusPlus = (startval<endval);
	this.stepsize = stepsize;
	this.endval = endval;

	//methods for setting, getting values and OnComplete method to be called when we are done.
	//this.getvalmethod = getvalmethod;
	this.setvalmethod = setvalmethod;
	this.OnCompletedCallback = OnCompletedCallback;

	this.tick();
};

TweenOnProperty.prototype.tick = function() {

	// first we find the delta time from lasttime
	var now = new Date().getTime()/1000;
	this._dt = now - this.lasttime;

	if (this._dt > 0.015) //if enough time has passed, do this tick
	{
		//update lasttime with current time.
		this.lasttime = now;

		//use the callback to set current value
		this.setvalmethod(this.currentval);


		//if this is a ++ add stepsize to current val otherwise subtract it
		if (this.isPlusPlus) this.currentval += this.stepsize;
		else this.currentval -= this.stepsize;
		
	}

	//check if we are done
	if ( (this.isPlusPlus && this.currentval>=this.endval) ||
		 (!this.isPlusPlus && this.currentval<=this.endval) ) 
	{
		//set val equal to endval
		this.setvalmethod(this.endval);
		//stop calling updates and execute the OnComplete
		window.cancelAnimFrame(this.updateid);
		if (this.OnCompletedCallback) this.OnCompletedCallback();
	}
	else
	{
		//schedule next tick if we are not done yet
		this.updateid = window.requestAnimFrame(this.tick.bind(this));
	}

};