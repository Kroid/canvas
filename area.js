'use strict';

function Area(area) {
  this.rect = new fabric.Rect({
    left: area.left,
    top: area.top,
    width: area.width,
    height: area.height,
    selectable: false,
    fill: '#F5F3F3',
    stroke : 'gray',
    strokeWidth : 1,
  });
}

Area.prototype.area = function() {
  return {
    left:   this.rect.left,
    top:    this.rect.top,
    width:  this.rect.width,
    height: this.rect.height,
  };
};

Area.prototype.moveTo = function(level) {
  this.rect.moveTo(level);
};
