
// declaring the constants and container
const container = "slider";
const updateVal = (divId, val) => document.getElementById(divId).getElementsByClassName("amount")[0].innerHTML = "$" + val;

const transportation = new CircularSlider({container, color: "#4B0082", max: 950, min: 50, step: 50, radius: 190, changedValue: val => updateVal('transportation', val)});
const food = new CircularSlider({container, color: "#1E90FF", min: 0, max: 950, step: 50, radius: 160, changedValue: val => { updateVal('food', val)}});
const insurance = new CircularSlider({container, color: "#228B22", min: 0, max: 950, step: 50, radius: 130, changedValue: val => updateVal('insurance', val)});
const entertainment = new CircularSlider({container, color: "#FF8C00", min: 0, max: 950, step: 50, radius: 100, changedValue: val => updateVal('entertainment', val)});
const healthCare = new CircularSlider({ container, color: "#FF0000", min: 0, max: 950, step: 50, radius: 70, changedValue: val => updateVal('health-care', val)});

//updating the values
updateVal('transportation', transportation.CurrentValue());
updateVal('food', food.CurrentValue());
updateVal('insurance', insurance.CurrentValue());
updateVal('entertainment', entertainment.CurrentValue());
updateVal('health-care', healthCare.CurrentValue());


