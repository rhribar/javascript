 /* 
    Creating the CircularSlider function and 
    passing in the options variables. 
    */
   function CircularSlider(options) {

    // declaring the objects constructor
    this.options = {};
    this.options.container = options.container;
    this.options.color = options.color;
    this.options.max = options.max;
    this.options.min = options.min;
    this.options.step = options.step;
    this.options.radius = options.radius;
    this.options.changedValue = options.changedValue;
    
    // we still need to initialize the slider
    this.Init();
}

/* 
Adding a method calculateNewPosition to CircularSlider constructor.
It calculates new position and the corresponding path the slider travels.
*/
CircularSlider.prototype.CalculateNewPosition = function (angleRad) {

    //  calculating the x and y coordinates
    var xCoord = Math.sin(angleRad) * this.radius;
    var yCoord = (-1) * (Math.cos(angleRad) * this.radius) ;

    // angle in radians must always be positive
    var radCorrection;
    if(angleRad < 0) {
        radCorrection = angleRad + 2 * Math.PI;
    } else {
        radCorrection = angleRad;
    }

    // calculate the path
    var angleDeg = radCorrection * 180.0 / Math.PI;
    var path = this.radius * radCorrection;

    // return an array of variables for slider
    return {
        x: xCoord,
        y: yCoord,
        degrees: angleDeg,
        radians: radCorrection,
        path: path,
    };
};

// adding some basic dimension and importing namespace
const svg_namespace = "http://www.w3.org/2000/svg";
const slider_width = 23;
const handler_radius = (slider_width / 2);
const tolerance = 46;

/*
 Calculates and creates all the values for sliders.
*/
CircularSlider.prototype.Init = function () {
    this.centerX = 0;
    this.centerY = 0;
    this.radius = this.options.radius - handler_radius; 
    this.perimeter = this.options.radius * 2 * Math.PI;
    this.currentStep = 0;
    this.dragging = false;
    this.position = this.CalculateNewPosition(this.centerX, this.centerY - this.radius);
    this.value = this.options.min;
    
    // we still need to initialize the slider here, TODO: write this methods
    this.InitSlider();
    this.InitEvents();
}

/*
A method CalculateValue which takes in the degrees parameter and outputs 
the value of a step.
*/ 
CircularSlider.prototype.CalculateValueDegrees = function (degrees) {
    var range = this.options.max - this.options.min; // calculating the whole range
    var circleDegrees = 360;
    var oneUnit = range / circleDegrees; 
    var value = oneUnit * degrees;// calculating the value based on the input

    return value;
};

/*
A method CalculateStepValue which takes in the value parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateStepValue = function (value) {
    
    var step = Math.round(value / this.options.step) //here we need to round the step 

    return step;
};

/*
A method CalculateDegreesStep which takes in the value parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateDegreesStep = function (degrees) {
    
    var value = this.CalculateValueDegrees(degrees);
    var step = this.CalculateStepValue(value)
    return step;
};

/*
TODO:
A method CalculateStepRad which takes in the radians parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateStepRad = function (step) {
    var val = step * this.options.step + this.options.min;
    var adjustedVal = val - this.options.min;
    var range = this.options.max - this.options.min;
    var degrees;
    if(this.options.max === val) {
        degrees = 359.99;
    } else {
        degrees = (Math.round(adjustedVal * (360.0 / range))) % 360;
    } 

    return Math.round(degrees * Math.PI / 180 * 100) / 100;
};

CircularSlider.prototype.CalculateRadPoint = function (x, y) {
    return Math.atan2(x - this.centerX, -y - this.centerY);
};


/*
 Sets a step of a drag.
 */
CircularSlider.prototype.SetStep = function (step) {

    var radiansEnd = this.CalculateStepRad(step);
    var newPosition = this.CalculateNewPosition(radiansEnd);
};

    /* 
    Checking for change and updating the state in this method.
    */
CircularSlider.prototype.UpdateState = function (newPosition, nextStep) {
    // checking if there was a change
    // update the step then
    if (this.currentStep !== nextStep && (this.options.changedValue && typeof(this.options.changedValue) === 'function')) {
        
        this.currentStep = nextStep; 
        this.options.changedValue(this.CurrentValue());
    } else {
        this.value = this.CalculateValueDegrees(newPosition.degrees);
        this.currentStep = nextStep;
        this.position = newPosition;
    }
};

/* 
Moves the slider on the orbit.
TODO:
*/
CircularSlider.prototype.MoveSlider = function (angleRad) {
    var newPosition = this.CalculateNewPosition(angleRad);
    // we do not want to move past top zero point
    if (!this.PastZero(newPosition)) {
        return false;
    }
    //update the state here
    var nextStep = this.CalculateDegreesStep(newPosition.degrees);
    this.UpdateState(newPosition, nextStep);

};

/*
Sets a boundary so the slider cannot be moved past top zero point.
*/
CircularSlider.prototype.PastZero = function (newPosition) {
    return !(this.position.y < 0 && ((this.position.x >= 0 && newPosition.x < 0) || (this.position.x < 0 && newPosition.x >= 0))) 
};


/*
 Getting the current value, so we can update and display it later on UI.
 */

CircularSlider.prototype.CurrentValue = function () {
    return (this.currentStep * this.options.step) + this.options.min
}







/* 
Adding a method InitSlider to CircularSlider constructor.
Create a slider and slider background.
TODO:
*/

CircularSlider.prototype.InitSlider = function () {
    // create root svg only when the first slider is added to the container.

};

/* 
Creating a root svg for a specific slider.
*/
CircularSlider.prototype.CreateRootSVG = function (boxDimensions) {

};



CircularSlider.prototype.TransformClientToLocalCoordinate = function (svgPoint, event) {

};

/*
    Creates a top circle.
*/
CircularSlider.prototype.CreateSliderCircle = function () {

};


/* 
Creating the handle on which u can click.
*/
CircularSlider.prototype.CreateClickCircle = function () {
 
};

/**
 * Creates new SVG circle with dashed border used as empty "underlying" slider.
 */
CircularSlider.prototype.CreateEmptyCircle = function () {

};

/* 
SVG: creates a circle.
*/
CircularSlider.prototype.CreateCircle = function () {

};

/* 
A method to creating a handle.
*/
CircularSlider.prototype.CreateHandle = function () {

};

/* 
A method for creating events. Mobile + web here.
*/
CircularSlider.prototype.InitEvents = function () {

};

CircularSlider.prototype.StartDrag = function (e) {

};

/* 
A method for handling drags.
*/
CircularSlider.prototype.HandleDrag = function (e) {

};

/* 
A method for canceling drags.
*/
CircularSlider.prototype.CancelDrag = function (e) {

};

/* 
    Handle slider click.
*/

CircularSlider.prototype.HandleSliderClick = function (e) {

}

/* 
    A method to handle touches for mobile.
    Also ignore multi-touch as per requirements.
*/

CircularSlider.prototype.TouchHandler = function (e) {

};

