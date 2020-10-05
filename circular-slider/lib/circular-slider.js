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
    // angle in radians must always be positive
    // calculate the path
    // return an array of variables for slider

    };
    
    /*
     Calculates and creates all the values for sliders. init function
    */
    CircularSlider.prototype.Init = function () {

        // declaring the objects constructor 
        // we still need to initialize the slider

    };

    /*
    A method CalculateValue which takes in the degrees parameter and outputs 
    the value of a step.
    */ 
    CircularSlider.prototype.CalculateValueDegrees = function (degrees) {

        // calculating the whole range
        // calculating the step
        // calculating the step based on the input

    };

    /*
    A method CalculateStepValue which takes in the value parameter and outputs a step.
    */ 
    CircularSlider.prototype.CalculateStepValue = function (value) {

        //here we need to round the step 
    };

    /*
    A method CalculateDegreesStep which takes in the value parameter and outputs a step.
    */ 
    CircularSlider.prototype.CalculateDegreesStep = function (degrees) {
 
    };

    /*
    TODO:
    A method CalculateStepRad which takes in the radians parameter and outputs a step.
    */ 
    CircularSlider.prototype.CalculateStepRad = function (step) {

    };

    /*
    TODO:
    A method CalculateRadPoint which takes in the point coordinates and outputs a rad.
    */ 
    CircularSlider.prototype.CalculateRadPoint = function (x, y) {

    };

    /*
     A methods which sets step.
     */
    CircularSlider.prototype.SetStep = function (step) {

    };
    
    /* 
    We still need a function to update state.
    */
    CircularSlider.prototype.UpdateState = function (newPosition, nextStep) {
        // check if there was a change
        // update the step then
    };

    /* 
    Moves the slider on the orbit.
    TODO:
    */
    CircularSlider.prototype.MoveSlider = function (angleRad) {
        // we do not want to move past top zero point
        
        //update the state here

        // we need animation frame
    };

    /*
    Sets a boundary so the slider cannot be moved past top zero point.
    */
    CircularSlider.prototype.PastZero = function (newPosition) { 
    };

    /*
     Getting the current value, so we can update and display it later on UI.
     */

    CircularSlider.prototype.CurrentValue = function () {
    }


    /* 
    Adding a method InitSlider to CircularSlider constructor.
    Create a slider and slider background.
    */

    CircularSlider.prototype.InitSlider = function () {
        
    };


    /* 
    Creating a root svg.
    */
    CircularSlider.prototype.CreateRootSVG = function (boxSize) {
      
    };

    /*
    TODO:
    A method for creating a SVG circle.
    */ 
    CircularSlider.prototype.CreateSliderCircle = function () {
 
    };


    /* 
    Creating the handle on which u can click.
    */
    CircularSlider.prototype.CreateClickCircle = function () {
 
    };

    /* 
    Creating a background of a slider.
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
    };

    /* 
    A method to handle touches for mobile.
    Also ignore multi-touch as per requirements.
    */

    CircularSlider.prototype.TouchHandler = function (e) {

    };

