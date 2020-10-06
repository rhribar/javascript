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
    
    // we still need to initialize the slider
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
    var oneUnit = range / circleDegrees; // calculating the step
    var value = oneUnit * degrees;// calculating the step based on the input

    return value;
};

/*
A method CalculateStepValue which takes in the value parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateStepValue = function (value) {
    
    var step = Math.round( value / this.options.step ) //here we need to round the step 

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

// Calculates Radians from a given point
CircularSlider.prototype.CalculateRadPoint = function (x, y) {
    return Math.atan2(x - this.centerX, -y - this.centerY);
};

/*
 Sets a step of a drag.
 */
CircularSlider.prototype.SetStep = function (step) {

    var radiansEnd = this.CalculateStepRad(step);
    var newPosition = this.CalculateNewPosition(radiansEnd);

    requestAnimationFrame(function () {
        this.slider.setAttributeNS(null, 'stroke-dashoffset', `${this.perimeter - newPosition.path}`);
        this.handle.style.transform = "rotate(" + newPosition.degrees + "deg)";
        this.UpdateState(newPosition, step);
    }.bind(this));
};

    /* Updating the state in this method. */
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
    // update the state here
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
*/

CircularSlider.prototype.InitSlider = function () {
    this.container = document.getElementById(this.options.container);

    // create root svg only when the first slider is added to the container.
    this.rootSVG = document.getElementById("sliderRootSVG");
    if (this.rootSVG === null) {
        this.rootSVG = this.CreateRootSVG(this.container.offsetWidth);
        this.container.appendChild(this.rootSVG);
    }

    this.slider = this.CreateSliderCircle(); //creating slider circle
    this.handle = this.CreateHandle(); //creating handle
    this.rootSVG.appendChild(this.handle);
};

/* 
Creating a root svg.
*/
CircularSlider.prototype.CreateRootSVG = function (boxDimensions) {
    var svg = document.createElementNS(svg_namespace, "svg");

    svg.setAttributeNS(null, "id", "sliderRootSVG");
    svg.setAttributeNS(null, "width", boxDimensions);
    svg.setAttributeNS(null, "height", boxDimensions);
    svg.setAttributeNS(null, "viewBox", "-200 -200 400 400");

    return svg;
};

/*
Transforming the coordinates here.
*/

CircularSlider.prototype.TransformClientToLocalCoordinate = function (svgPoint, event) {
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;
    // Creating variable transform, calling the getScreenCTM() function,
    // To convert document coordinates to screen coordinates.
    // I want the transform matrix in other direction => used inverse()
    var transform = svgPoint.matrixTransform(this.rootSVG.getScreenCTM().inverse()); 
    return transform;
};

/*
 Creates new SVG circle used as a top slider.
 */
CircularSlider.prototype.CreateSliderCircle = function () {
    var slider = this.CreateCircle();
    return slider;
};


/* 
Creating the handle on which u can click.
*/
CircularSlider.prototype.CreateClickCircle = function () {
    var slider = this.CreateCircle();
    return slider;
};

/*
    For creating the underlying/background path circle.
 */
CircularSlider.prototype.CreatePathCircle = function () {
};

/* 
SVG: creates a circle.
*/
CircularSlider.prototype.CreateCircle = function () {
    var slider = document.createElementNS(svg_namespace, 'circle');
    return slider;
};


/* 
    A method to creating a handle for a slider.
    TODO:
*/
CircularSlider.prototype.CreateHandle = function () {
    var handle = document.createElementNS(svg_namespace, 'circle');
    handle.setAttributeNS(null, "cx", `${this.centerX}`); // x coordinate
    handle.setAttributeNS(null, "cy", `${this.centerY - this.radius}`); // y coordinate
    handle.setAttributeNS(null, "r", `${handler_radius}`); // radius r
    handle.setAttributeNS(null, "class", "handle"); // setting the class

    return handle;
};

/* 
    A method for creating events. Mobile + web here.
*/

CircularSlider.prototype.InitEvents = function () {
    this.container.addEventListener("mousemove", function (e) {
        this.HandleDrag(e);
    }.bind(this));
    this.container.addEventListener("mouseup", function (e) {
        this.CancelDrag(e);
    }.bind(this));
    this.container.addEventListener("mouseleave", function (e) {
        this.CancelDrag(e);
    }.bind(this));
    this.handle.addEventListener("mousedown", function (e) {
        this.StartDrag(e);
    }.bind(this));
};

CircularSlider.prototype.StartDrag = function (e) {
    e.preventDefault();
    this.dragging = true;
};

/*
TODO:
Handles the drag.
 */
CircularSlider.prototype.HandleDrag = function (e) {
    e.preventDefault();
    if (!this.dragging) {
        return;
    }
    var svgPoint = this.rootSVG.createSVGPoint();
    var localCoords = this.TransformClientToLocalCoordinate(svgPoint, e);
    var mouseHandleOffsetX = this.position.x - localCoords.x;
    var mouseHandleOffsetY = this.position.y - localCoords.y;
    
    if (mouseHandleOffsetX > tolerance || mouseHandleOffsetY > tolerance) {
        this.CancelDrag(e);
    } else {
        var angelRadians = this.CalculateRadPoint(localCoords.x, localCoords.y);
        this.MoveSlider(angelRadians);
    }
};

/*
A method for cancelling the drag.
*/
CircularSlider.prototype.CancelDrag = function (event) {
    event.preventDefault();
    // only complete step if you are currently moving
    if (this.dragging) {
        this.SetStep(this.CalculateStepValue(this.value));
    }
    this.dragging = false;
};

/* 
    A method to handle touches.
    Also ignore multi-touch as per requirements.
*/

CircularSlider.prototype.HandleSliderClick = function (e) {
};

/* 
    A method to handle touches for mobile.
    Also ignore multi-touch as per requirements.
*/

CircularSlider.prototype.TouchHandler = function (e) {
};
