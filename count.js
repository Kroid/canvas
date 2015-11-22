'use strict';

function Count() {
  this.item  = 1;
  this.price = 1;
}

Count.prototype.next = function(type) {
  var value = this[type];
  this[type] += 1;
  return value;
}

Count.prototype.set = function(type, value) {
  this[type] = value;
}