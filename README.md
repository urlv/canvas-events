# canvas-events
html5 canvas with events

## Quick Start

include the script
```html
<script src="canvasEvents.min.js"></script>
```
<br />

Init the canvas events object
```js
var canvas = document.querySelector('canvas');
var ce = new CanvasEvents(canvas);
```
<br />

To add event you have to use with ```on``` method
```js
ce.fillRect(20,20, 80, 115).on('click',function(){
  alert('clicked!');
});
```
<br />

Only for these methods you can call to ```on```/```off``` (because these methods create elements into the canvas while others not):
`rect` `fillRect` `strokeRect` `clearRect` `arc` `fillText` `strokeText` `drawImage` `putImageData`
<br /><br />

And only for mouse events:
`click` `contextmenu` `dbclick` `mousedown` `mouseenter` `mouseleave` `mousemove` `mouseover` `mouseout` `mouseup`
<br />
<br />

To remove all events associate to the element you have to use with ```off``` method
```js
var shape = ce.fillRect(20,20, 80, 115);

shape.on('mouseover',function(){
  alert('mouse over!');
});

shape.on('click',function(){
  shape.off();
  alert("all shape's events removed!");
});
```

For remove specific event from the shpae you have to call to ```off``` method like this:
```js
var shape = ce.fillRect(20,20, 80, 115);

var whenClick = function(){
  alret('click only once!');
  shape.off('click',whenClick);
}

var whenMouseOver = function(){
  alret('mouse over forever!');
}

shape.on('click',whenClick).on('mouseover',whenMouseOver);
```
By the way, as you can see above we can chain ```on```/```off``` method [ ```elem.on().on()...``` ]
<br />
<br />
<br />

## Functions declaration
```js
on(eventName, functionToInvoke)
off(eventName, registeredFunctionToRemove)
off()
