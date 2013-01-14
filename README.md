# jQuery TrackChanges

## Author
Sébastien Lavoie (sebastien@lavoie.sl)

## Description
TrackChanges enables to easily and unobtrusively add watches on forms, detect changes and revert to original value

## Example
```js
$('.myform :input').trackChanges({
    trackingClass: 'track-changes', // Class added on watched fields
    changedClass: 'changed', // Class added when field is changed
    events: 'change blur' // Events to bind for watching changes
});
```

## Prerequisites
  * jQuery, should work with any version but tested with 1.7

## Live demo
Here is a live demo, please fork it to report bugs.
http://jsfiddle.net/547cM/3/
