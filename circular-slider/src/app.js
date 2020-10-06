
// declaring the constants container, updateVal and variables
const container = "slider";
const updateVal = (divId, val) => document.getElementById(divId).getElementsByClassName("amount")[0].innerHTML = "$" + val;

const transportation = new CircularSlider({container, color: "#4B0082", max: 1000, min: 50, step: 50, radius: 190, changedValue: val => updateVal('transportation', val)});

//updating the values
updateVal('transportation', transportation.CurrentValue());


