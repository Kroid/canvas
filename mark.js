'use strict';

function Mark(options, objectsOnCanvas) {
  this.number = number;

  this.figure = null;
  this.label  = null;
  this.group  = null;

  this.image = objectsOnCanvas.image;
  this.marksArea = objectsOnCanvas.marksArea;
  this.marksStoreArea = objectsOnCanvas.marksStoreArea;

  throw new Error('Use ItemMark or PriceMark');
}

/**
 * Connect to object on canvas
 */
Mark.prototype.connect = function(connectType) {
  // marksArea, marksStoreArea, image;
  this.connectType = connectType;

  switch (connectType) {
    case 'marksArea':
    case 'marksStoreArea':
      this.group.moveTo(LEVEL_MARK_ON_AREA);

      this.connectCoordinates = {
        x: this.group.left - this.connectObject().area().left,
        y: this.group.top  - this.connectObject().area().top,
      };

      break;
    case 'image':
      this.group.moveTo(LEVEL_MARK_ON_IMAGE);

      this.connectCoordinates = {
        x: (this.group.left - this.connectObject().area().left) / this.image.image.scaleX,
        y: (this.group.top  - this.connectObject().area().top) / this.image.image.scaleY,
      };

      break;
  }
}

Mark.prototype.connectObject = function() {
  return this[this.connectType];
}

/**
 * Move to connected position
 */
Mark.prototype.home = function() {
  if (this.connectType != 'image') {
    this.group.set({
      left: this.connectObject().area().left + this.connectCoordinates.x,
      top:  this.connectObject().area().top  + this.connectCoordinates.y,
    });

    this.group.setCoords();
    return;
  }

  // check image scale, etc.
  this.group.set({
    left: this.connectObject().area().left + this.connectCoordinates.x * this.image.image.scaleX,
    top:  this.connectObject().area().top  + this.connectCoordinates.y * this.image.image.scaleY,
  });

  this.group.setCoords();
}

Mark.prototype.setNumber = function(number) {
  this.number     = number;
  this.label.text = number.toString();
}


Mark.prototype.mouseUpCb   = function(e) {
  this.selected = false;
}

Mark.prototype.mouseDownCb = function(e) {
  this.selected = true;
  this.moveTo(LEVEL_MARK_SELECTED);
}

Mark.prototype.moveTo = function(level) {
  this.group.moveTo(level);
  this.level = level;
};

Mark.prototype.isInside = function(object) {
  var horisontal = this.group.left >= object.left && this.group.left <= (object.left + object.width);
  var vertical   = this.group.top  >= object.top  && this.group.top  <= (object.top  + object.height);

  return horisontal && vertical;
}

Mark.prototype.isOutside = function(object) {
  return !this.isInside(object);
}


function ItemMark(options, objectsOnCanvas) {
  var color = 'red';

  this.number = null;
  this.type = 'item';

  this.figure = new fabric.Circle({
    radius: 25,
    fill: 'white',
    stroke : color,
    strokeWidth : 3,
    scaleY: 0.8,
    originX: 'center',
    originY: 'center',
  });

  this.label  = new fabric.Text('', {
    fontSize: 20,
    fill: color,
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.label ], {
    left: options.left,
    top: options.top,
    hasControls: false,
  });

  this.figure.parent = this;
  this.label.parent  = this;
  this.group.parent  = this;

  this.image = objectsOnCanvas.image;
  this.marksArea = objectsOnCanvas.marksArea;
  this.marksStoreArea = objectsOnCanvas.marksStoreArea;
}

ItemMark.prototype = Object.create(Mark.prototype);
ItemMark.prototype.constructor = ItemMark;


function PriceMark(options, objectsOnCanvas) {
  var color = 'blue';

  this.number = null;
  this.type = 'price';

  this.figure = new fabric.Rect({
    width: 50,
    height: 50,
    fill: 'white',
    stroke : color,
    strokeWidth : 3,
    scaleY: 0.8,
    originX: 'center',
    originY: 'center',
  });

  this.label = new fabric.Text('', {
    fontSize: 20,
    fill: color,
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.label ], {
    left: options.left,
    top: options.top,
    hasControls: false,
  });

  this.figure.parent = this;
  this.label.parent  = this;
  this.group.parent  = this;

  this.image = objectsOnCanvas.image;
  this.marksArea = objectsOnCanvas.marksArea;
  this.marksStoreArea = objectsOnCanvas.marksStoreArea;
}

PriceMark.prototype = Object.create(Mark.prototype);
PriceMark.prototype.constructor = PriceMark;
