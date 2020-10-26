# javascript

In this repository I have created a reusable circular slider class in pure JS without the use of external JS libraries. 

(a POC = proof of concept) 

Stack: JS, CSS, HTML

Features:
- when creating new instance of the slider, options object is passed
- multiple sliders are rendered in the same container
- each slider has its own adjustable max/min limit and step value
- value number (on the left in the image) changes in real time based on the slider’s position
- touch events on one slider don’t affect others (even if finger goes out of touched slider range)
- slider value changes when you drag the handle or if you tap the spot on a slider
- the solution works on mobile devices
- no external JS libraries were used

