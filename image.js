'use srtict';

var LEVEL_IMAGE = 0;

function Image(canvas, url, area, cb) {
  var self = this;

  fabric.Image.fromURL(url, function(img) {
    self.image = img;
    self.image.parent = self;

    self.image.hasRotatingPoint = false;
    self.image.lockUniScaling = true;
    self.image.lockRotation = true;

    self.scale(area);
    self.center(area);

    if (cb) {
      cb(self);
    }
  });
}

Image.prototype.area = function() {
  return {
    left:   this.image.left,
    top:    this.image.top,
    width:  this.image.width * this.image.scaleX,
    height: this.image.height * this.image.scaleY,
  };
}

Image.prototype.center = function(area) {
  var imageCenter = {
    x: this.image.width  * this.image.scaleX / 2,
    y: this.image.height * this.image.scaleY / 2,
  };

  var areaCenter = {
    x: area.width  / 2,
    y: area.height / 2,
  };

  this.image.set('left', areaCenter.x - imageCenter.x);
  this.image.set('top',  areaCenter.y - imageCenter.y);

  this.image.setCoords();
}

Image.prototype.changeZoomBy = function(value) {
  this.zoom(this.image.scaleX + value);
}

Image.prototype.moveTo = function(level) {
  self.image.image.moveTo(level);
}

Image.prototype.scale = function(area) {
  this.image.scaleToWidth(area.width);
  // this.image.scaleToHeight(area.height);

  if (this.image.height * this.image.scaleY > area.height) {
    this.image.scaleToHeight(area.height);
  }

  if(this.zoom() > 1) {
    this.zoom(1);
  }
}

Image.prototype.zoom = function(value) {
  if (!value) {
    return this.image.scaleX;
  }

  this.image.scaleX = value;
  this.image.scaleY = value;
}