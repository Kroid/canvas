'use strict';

function ZoomControl(image, options) {
  var color = 'black';

  this.image = image;

  this.figure = new fabric.Rect({
    width: 120,
    height: 30,
    fill: 'white',
    stroke : color,
    strokeWidth : 3,
    scaleY: 0.8,
    originX: 'center',
    originY: 'center',
  });

  this.label  = new fabric.Text(options.text, {
    fontSize: 20,
    fill: color,
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.label ], {
    left: options.left,
    top: options.top,
    hasControls: false,
    selectable: false,
  });

  this.group.parent = this;
}

ZoomControl.prototype.mouseDownCb = function(e) {
  this.image.changeZoomBy(0.3);
};

function ZoomOutControl(image, options) {
  var color = 'black';

  this.image = image;

  this.figure = new fabric.Rect({
    width: 120,
    height: 30,
    fill: 'white',
    stroke : color,
    strokeWidth : 3,
    scaleY: 0.8,
    originX: 'center',
    originY: 'center',
  });

  this.label  = new fabric.Text(options.text, {
    fontSize: 20,
    fill: color,
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.label ], {
    left: options.left,
    top: options.top,
    hasControls: false,
    selectable: false,
  });

  this.group.parent = this;
}

ZoomOutControl.prototype.mouseDownCb = function(e) {
  this.image.changeZoomBy(-0.3);
};

function CenterControl(image, options) {
  var color = 'black';

  this.image = image;

  this.figure = new fabric.Rect({
    width: 150,
    height: 30,
    fill: 'white',
    stroke : color,
    strokeWidth : 3,
    scaleY: 0.8,
    originX: 'center',
    originY: 'center',
  });

  this.label  = new fabric.Text(options.text, {
    fontSize: 20,
    fill: color,
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.label ], {
    left: options.left,
    top: options.top,
    hasControls: false,
    selectable: false,
  });

  this.group.parent = this;
}

CenterControl.prototype.mouseDownCb = function(e) {
  this.image.zoom(1);
  this.image.center();
};