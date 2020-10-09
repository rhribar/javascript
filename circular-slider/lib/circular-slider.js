// SECTION 1: SETTING UP THE CIRCULAR SLIDER
/* 
Creating the CircularSlider function and 
passing in the options variables. 
*/
function CircularSlider(options) {

    // declaring the constructor
    this.options = {};
    this.options.container = options.container;
    this.options.color = options.color;
    this.options.max = options.max;
    this.options.min = options.min;
    this.options.step = options.step;
    this.options.radius = options.radius;

    // adding check for a change
    this.options.changedValue = options.changedValue;
    
    // we still need to initialize the slider
    this.Init();
}

/* 
Adding a method CalculateNewPosition to CircularSlider constructor.
It calculates new position and the corresponding path the slider travels.
*/
CircularSlider.prototype.CalculateNewPosition = function (angleRad) {

    //  calculating the x and y coordinates
    var xCoord = Math.sin(angleRad) * this.radius;
    var yCoord = (-1) * (Math.cos(angleRad) * this.radius) ;

    // angle in radians must always be positive, add full circle 2PI = 360 deg.
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

// setting up namespace and basic dimensions
const svg_namespace = "http://www.w3.org/2000/svg";
const slider_width = 23;
const handler_radius = (slider_width / 2)+2;
const tolerance = 46;

/*
 Calculates and creates (init) all the values for sliders.
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
    this.InitMouseEvents();
    this.InitTouchEvents();
}


// SECTION 2: WRITTING METHODS FOR CALCULATIONS

/*
A method CalculateValue which takes in the degrees parameter and outputs 
the value of a step.
*/ 
CircularSlider.prototype.CalculateValueDegrees = function (degrees) {

    var range = this.options.max - this.options.min; // calculating the whole range
    var circleDegrees = 360;
    var oneUnit = range / circleDegrees; // calculating one unit
    var value = oneUnit * degrees; // calculating the step based on the input

    return value;
};

/*
A method CalculateStepValue which takes in the value parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateStepValue = function (value) {
    
    var step = Math.round( value / this.options.step ) // here we need to round the step for 

    return step;
};

/*
A method CalculateDegreesStep which takes in the degrees parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateDegreesStep = function (degrees) {
    
    var value = this.CalculateValueDegrees(degrees);
    var step = this.CalculateStepValue(value)

    return step;
};

/*
A method CalculateStepRad which takes in the radians parameter and outputs a step.
*/ 
CircularSlider.prototype.CalculateStepRad = function (step) {
    var val = step * this.options.step + this.options.min;
    var adjustedVal = val - this.options.min;
    var range = this.options.max - this.options.min; // calculating the range
    var degrees;
    if(this.options.max === val) {
        degrees = 359.99;
    } else {
        degrees = (Math.round(adjustedVal * (360.0 / range))) % 360;
    } 
    return Math.round(degrees * Math.PI / 180 * 100) / 100;
};

// Calculates Radians from a given point coordinates.
CircularSlider.prototype.CalculateRadPoint = function (x, y) {
    return Math.atan2(x - this.centerX, -y - this.centerY);
};


// SECTION 3: IMPLEMENTING CALCULATION LOGIC AND ADDING ANIMATIONS

/*
 Setting a step of a drag.
 */
CircularSlider.prototype.SetStep = function (step) {
    
    var radiansEnd = this.CalculateStepRad(step); // calculating the radians from input step
    var newPosition = this.CalculateNewPosition(radiansEnd); // calculating the new position from radians

    // animation for setting the step
    requestAnimationFrame(function () {
        this.slider.setAttributeNS(null, 'stroke-dashoffset', `${this.perimeter - newPosition.path}`);
        this.handle.style.transform = "rotate(" + newPosition.degrees + "deg)";
        this.UpdateState(newPosition, step);
    }.bind(this));
};

/* Updating the state in this method. */
CircularSlider.prototype.UpdateState = function (newPosition, nextStep) {
    // Check if there was a change,
    // Update the step then!
    if (this.currentStep !== nextStep && (this.options.changedValue && typeof(this.options.changedValue) === 'function')) {
        this.currentStep = nextStep; 
        this.options.changedValue(this.CurrentValue());
    }

    // updating here
    this.value = this.CalculateValueDegrees(newPosition.degrees);
    this.currentStep = nextStep;
    this.position = newPosition;

};

/* 
Moves the slider on the orbit.
*/
CircularSlider.prototype.MoveSlider = function (angleRad) {
    var newPosition = this.CalculateNewPosition(angleRad); // calculating the position
    // we do not want to move past top zero point
    if (!this.PastZero(newPosition)) {
        return false;
    }

    // update the state here
    var nextStep = this.CalculateDegreesStep(newPosition.degrees);
    this.UpdateState(newPosition, nextStep);

    // animation of the slider movement
    requestAnimationFrame(function () {
        this.slider.setAttributeNS(null, 'stroke-dashoffset', `${this.perimeter - newPosition.path}`);
        this.handle.style.transform = "rotate(" + newPosition.degrees + "deg)";
    }.bind(this));

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
    return (this.currentStep * this.options.step) + this.options.min;
}


// SECTION 4: SETTING UP THE SVG SLIDERS

/* 
Adding a method InitSlider to CircularSlider constructor.
Create a slider and slider background.
*/

CircularSlider.prototype.InitSlider = function () {
    this.container = document.getElementById(this.options.container);

    // create root svg only when the first slider is added to the container.
    this.rootSVG = document.getElementById("sliderRootSVG");
    if (this.rootSVG === null) {
        this.rootSVG = this.CreateRootSVG(this.container.offsetWidth); // creates root
        this.container.appendChild(this.rootSVG);
    }

    this.slider = this.CreateSliderCircle(); //creating slider circle
    this.handle = this.CreateHandle(); //creating handle
    this.clickCircle = this.CreateClickCircle(); // creating click circle

    // apending previous instances to rootSVG
    this.rootSVG.appendChild(this.CreatePathCircle());
    this.rootSVG.appendChild(this.clickCircle);
    this.rootSVG.appendChild(this.slider);
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
    svg.setAttributeNS(null, "viewBox", "-200, -200, 400, 400");

    return svg;
};

/*
Transforming the coordinates here from client to local.
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

    slider.setAttributeNS(null, 'class', 'top-slider');
    slider.setAttributeNS(null, 'transform', 'rotate(-90)');
    slider.setAttributeNS(null, 'stroke-dasharray', `${this.perimeter} ${this.perimeter}`);
    slider.setAttributeNS(null, 'stroke-dashoffset', `${this.perimeter}`);

    // creating a tray behind drag
    slider.style.stroke = this.options.color;
    slider.style.strokeWidth = slider_width;

    return slider;
};


/* 
Creating the handle on which u can click.
*/
CircularSlider.prototype.CreateClickCircle = function () {
    var slider = this.CreateCircle();

    slider.style.strokeWidth = slider_width;
    slider.style.stroke = "transparent";

    return slider;
};

/*
For creating the underlying/background path circle.
*/

CircularSlider.prototype.CreatePathCircle = function () {
    var slider = this.CreateCircle();

    slider.setAttributeNS(null, 'class', 'path-circle');
    slider.setAttributeNS(null, 'transform', 'rotate(-90)');
    slider.style.strokeWidth = slider_width;
    slider.style.strokeDasharray = "6, 2";

    return slider;

};

/* 
SVG: creates a circle.
*/
CircularSlider.prototype.CreateCircle = function () {
    var slider = document.createElementNS(svg_namespace, 'circle');
    
    slider.setAttributeNS(null, "cx", this.centerX);
    slider.setAttributeNS(null, "cy", this.centerY);
    slider.setAttributeNS(null, "r", this.radius);
    slider.setAttributeNS(null, "fill", "none");

    return slider;
};


/* 
    A method to creating a handle for a slider.
*/
CircularSlider.prototype.CreateHandle = function () {
    var handle = document.createElementNS(svg_namespace, 'circle');

    handle.setAttributeNS(null, "cx", `${this.centerX}`); // x coordinate
    handle.setAttributeNS(null, "cy", `${this.centerY - this.radius}`); // y coordinate
    handle.setAttributeNS(null, "r", `${handler_radius}`); // radius r
    handle.setAttributeNS(null, "class", "handle"); // setting the class
    
    return handle;
};


// SECTION 5: HANDLING THE INPUT EVENTS HERE

/* Adding mouse events here.*/ 

CircularSlider.prototype.InitMouseEvents = function () {
    this.clickCircle.addEventListener('click', function (e) {
        this.HandleSliderClick(e);
    }.bind(this));
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

/* Adding touch events here.*/ 

CircularSlider.prototype.InitTouchEvents = function () {
    this.slider.addEventListener('click', function (e) {
        this.HandleSliderClick(e);
    }.bind(this));
    this.slider.addEventListener("touchend", function (e) {
        this.TouchHandler(e);
    }.bind(this));
    this.slider.addEventListener("touchstart", function (e) {
        this.TouchHandler(e);
    }.bind(this));
    this.handle.addEventListener("touchmove", function (e) {
        this.TouchHandler(e);
    }.bind(this));
    this.container.addEventListener("touchcancel", function (e) {
        this.TouchHandler(e);
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
Handles the drag.
 */
CircularSlider.prototype.HandleDrag = function (e) {
    e.preventDefault();
    if (!this.dragging) {
        return;
    }
    var svgPoint = this.rootSVG.createSVGPoint();
    var localCoordinates = this.TransformClientToLocalCoordinate(svgPoint, e);
    var mouseHandleOffsetX = this.position.x - localCoordinates.x;
    var mouseHandleOffsetY = this.position.y - localCoordinates.y;

    this.slider.style.transition = "";
    this.handle.style.transition = "";
    
    if (mouseHandleOffsetX > tolerance || mouseHandleOffsetY > tolerance) {
        this.CancelDrag(e);
    } else {
        var angelRadians = this.CalculateRadPoint(localCoordinates.x, localCoordinates.y);
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
    A method to move slider on click.
*/

CircularSlider.prototype.HandleSliderClick = function (e) {
    var svgPoint = this.rootSVG.createSVGPoint();
    var localCoordinates = this.TransformClientToLocalCoordinate(svgPoint, e);
    var newPosition = this.CalculateNewPosition(this.CalculateRadPoint(localCoordinates.x, localCoordinates.y));
    var nextStep = this.CalculateDegreesStep(newPosition.degrees);

    this.SetStep(nextStep);
};


/* 
    TODO: works in mozzila responsive design mode ?!
    A method to handle touches..
    Also ignore multi-touch as per requirements.
*/

CircularSlider.prototype.TouchHandler = function (e) {
    var changes = e.changedTouches; // check list of touch points that changed
    
    if (changes.length > 1) return; // Ignore multi touch here, we need only first touch
    // if there are more than 1 touch, return false

};
