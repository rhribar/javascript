
// declaring the constants and container
const container = "slider";
const updateValue = (divId, val) => document.getElementById(divId).getElementsByClassName("amount")[0].innerHTML = "$" + val;

const transportation = new CircularSlider({container, color: "#4B0082", max: 950, min: 50, step: 50, radius: 190, changedValue: val => updateValue('transportation', val)});
const food = new CircularSlider({container, color: "#1E90FF", min: 0, max: 950, step: 50, radius: 160, changedValue: val => { updateValue('food', val)}});
const insurance = new CircularSlider({container, color: "#228B22", min: 0, max: 950, step: 50, radius: 130, changedValue: val => updateValue('insurance', val)});
const entertainment = new CircularSlider({container, color: "#FF8C00", min: 0, max: 950, step: 50, radius: 100, changedValue: val => updateValue('entertainment', val)});
const healthCare = new CircularSlider({ container, color: "#FF0000", min: 0, max: 950, step: 50, radius: 70, changedValue: val => updateValue('health-care', val)});

//updating the values
updateValue('transportation', transportation.CurrentValue());
updateValue('food', food.CurrentValue());
updateValue('insurance', insurance.CurrentValue());
updateValue('entertainment', entertainment.CurrentValue());
updateValue('health-care', healthCare.CurrentValue());


