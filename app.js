'use strict';

var LEVEL_IMAGE = 0,
    LEVEL_MARK = 1,
    LEVEL_AREA = 2,
    LEVEL_MARK_ON_AREA = 4;

var count = {
  item:  1,
  price: 1,
};

/**
 * Вычисляет, "наехала" ли точка на прямоугольник.
 */
function isCollision(point, rect) {
  var point = {
    x: point.x || point.x == 0 ? point.x : point.left,
    y: point.y || point.y == 0 ? point.y : point.top,
  };

  var rect = {
    x: rect.x || rect.x == 0 ? rect.x : rect.left,
    y: rect.y || rect.y == 0 ? rect.y : rect.top,
    width: rect.width,
    height: rect.height,
  };

  var horisontal = point.x >= rect.x && point.x <= (rect.x + rect.width);
  var vertical   = point.y >= rect.y && point.y <= (rect.y + rect.height);
  return horisontal && vertical;
}

function createNewItemMark(canvas, marksArea, marksStoreArea, image) {
  return new Mark(canvas, {
    label: null,
    type: 'item',
    left: marksArea.rect.left + marksArea.rect.width / 5,
    top: marksArea.rect.top + marksArea.rect.height / 2 - 30,
    marksArea: marksArea,
    marksStoreArea: marksStoreArea,
    image: image,
  });
}
function createNewPriceMark(canvas, marksArea, marksStoreArea, image) {
  return new Mark(canvas, {
    label: null,
    type: 'price',
    left: marksArea.rect.left + marksArea.rect.width / 5 * 3,
    top: marksArea.rect.top + marksArea.rect.height / 2 - 30,
    marksArea: marksArea,
    marksStoreArea: marksStoreArea,
    image: image,
  });
}



function MarksArea(canvas) {
  this.canvas = canvas;
  this.rect = new fabric.Rect({
    left: canvas.width / 3 * 2,
    top: 0,
    width: canvas.width / 3 - 1,
    height: canvas.height / 2,
    selectable: false,
    fill: '#F5F3F3',
    stroke : 'gray',
    strokeWidth : 1,
  });
  canvas.add(this.rect)
  this.rect.moveTo(LEVEL_AREA);
}

function MarksStoreArea(canvas) {
  this.canvas = canvas;
  this.rect = new fabric.Rect({
    left: canvas.width / 3 * 2,
    top: canvas.height / 2,
    width: canvas.width / 3 - 1,
    height: canvas.height / 2 - 1,
    selectable: false,
    fill: '#F5F3F3',
    stroke : 'gray',
    strokeWidth : 1,
  });
  canvas.add(this.rect)
  this.rect.moveTo(LEVEL_AREA);
}

function Mark(canvas, options) {
  this.canvas = canvas;

  options = options || {};
  options.label = options.label || '';

  // image, marksArea, marksStoreArea, false
  this.relation = options.relation || 'marksArea';

  // item, price
  this.type = options.type;

  this.position = {
    left: options.left,
    top: options.top,
  };

  this.image = options.image;
  this.marksArea = options.marksArea;
  this.marksStoreArea = options.marksStoreArea;

  this.image.marks.push(this);

  if (options.type == 'item') {
    this.figure = new fabric.Circle({
      radius: 25,
      fill: 'white',
      stroke : options.type == 'item' ? 'red' : 'blue',
      strokeWidth : 3,
      scaleY: 0.8,
      originX: 'center',
      originY: 'center',
    });
  } else if (options.type == 'price') {
    this.figure = new fabric.Rect({
      width: 50,
      height: 50,
      fill: 'white',
      stroke : options.type == 'item' ? 'red' : 'blue',
      strokeWidth : 3,
      scaleY: 0.8,
      originX: 'center',
      originY: 'center',
    });
  }

  this.text = new fabric.Text(options.label.toString(), {
    fontSize: 20,
    fill: options.type == 'item' ? 'red' : 'blue',
    originX: 'center',
    originY: 'center',
  });

  this.group = new fabric.Group([ this.figure, this.text ], {
    left: options.left,
    top: options.top,
    hasControls: false,
  });

  this.figure.parent = this;
  this.text.parent   = this;
  this.group.parent  = this;


  canvas.add(this.group);
  this.group.moveTo(LEVEL_MARK_ON_AREA);
}

Mark.prototype.goBack = function() {
  this.group.set({
    left: this.position.left,
    top: this.position.top,
  });

  this.group.setCoords();
  this.canvas.renderAll();
}

function Image(canvas, url) {
  this.canvas = canvas;

  this.area = {
    width: this.canvas.width / 3 * 2,
    height: this.canvas.height,
  };

  this.type = 'image';
  this.marks = [];

  var self = this;
  fabric.Image.fromURL(url, function(img) {
    self.image = img;
    self.image.hasRotatingPoint = false;
    self.image.lockUniScaling = true;
    self.image.lockRotation = true;
    self.image.parent = self;

    self.scale();
    self.center();

    self.image.previousPosition = {
      x: self.image.left,
      y: self.image.top,
    };

    canvas.add(self.image);
    self.image.moveTo(LEVEL_IMAGE);
  });
}

Image.prototype.scale = function(area) {
  area = area || this.area;

  this.image.scaleToWidth(area.width);
  this.image.scaleToHeight(area.height);

  if (this.image.height * this.image.scaleX > area.height) {
    this.image.scaleToHeight(area.height);
  }

  if (this.image.scaleX > 1 || this.image.scaleY > 1) {
    this.image.scaleX = 1;
    this.image.scaleY = 1;
  }
  canvas.renderAll();
};

Image.prototype.center = function(area) {
  area = area || this.area;

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

  canvas.renderAll();
};



function onMarkMouceUp(e) {
  var mark   = e.target.parent;
  var center = mark.group.getCenterPoint();

  // if mark on marksArea
  if (isCollision(center, mark.marksArea.rect)) {
    mark.goBack();
    return;
  }

  // if mark on marksStoreArea
  if (isCollision(center, mark.marksStoreArea.rect)) {
    if (!mark.text.text) {
      mark.text.text = count[mark.type].toString();
      count[mark.type] += 1;

      if (mark.type == 'item') {
        createNewItemMark(mark.canvas, mark.marksArea, mark.marksStoreArea, mark.image);
      } else if (mark.type == 'price') {
        createNewPriceMark(mark.canvas, mark.marksArea, mark.marksStoreArea, mark.image);
      }
    }

    mark.relation = 'marksStoreArea';
    mark.position = {
      left: mark.group.left,
      top: mark.group.top,
    };


    canvas.renderAll();
    return;
  }

  // if mark on image
  if (isCollision(center, mark.image.image)) {
    if (!mark.text.text) {
      mark.text.text = count[mark.type].toString();
      count[mark.type] += 1;

      if (mark.type == 'item') {
        createNewItemMark(mark.canvas, mark.marksArea, mark.marksStoreArea, mark.image);
      } else if (mark.type == 'price') {
        createNewPriceMark(mark.canvas, mark.marksArea, mark.marksStoreArea, mark.image);
      }
    }

    mark.relation = 'image';
    mark.position = {
      left: mark.group.left,
      top: mark.group.top,
    };

    canvas.renderAll();
    return;
  }

  // if mark out of canvas
  if (!isCollision(center, {x: 0, y:0, width: mark.canvas.width, height: mark.canvas.height})) {
    mark.goBack();
    return;
  }

    mark.goBack();
  if (!mark.text.text) {
    return;
  }
}




var canvas = new fabric.Canvas('canvas', {
  width: 1024,
  height: 400,
  selection: false,
});

canvas.on({'mouse:up': function(e) {
  if (!e.target || !e.target.parent || !e.target.parent.type) {
    return;
  }

  var type = e.target.parent.type;

  if (type == 'item' || type == 'price') {
    onMarkMouceUp(e);
  }
}});

var marksArea      = new MarksArea(canvas);
var marksStoreArea = new MarksStoreArea(canvas);

var image = new Image(canvas, 'http://avatarbox.net/avatars/img19/homer_jamaica_avatar_picture_18399.gif');

var mark = createNewItemMark(canvas, marksArea, marksStoreArea, image);
var mark2 = createNewPriceMark(canvas, marksArea, marksStoreArea, image);

// var image = new Image(canvas, 'http://a4.files.biography.com/image/upload/c_fit,cs_srgb,dpr_1.0,h_1200,q_80,w_1200/MTE4MDAzNDEwNTU4NjgyNjM4.jpg')


// loop
var FPS = 60;

var previousImageSize = null;
setInterval(function() {
  if (!image.image) {
    return;
  }

  if (!previousImageSize) {
    previousImageSize = {
      x: image.image.scaleX * image.image.width,
      y: image.image.scaleY * image.image.height,
    };
  }

  var diffX = image.image.left - image.image.previousPosition.x;
  var diffY = image.image.top - image.image.previousPosition.y;

  // on move image
  image.marks.map(function(mark) {
    if (mark.relation !== 'image') {
      mark.group.moveTo(LEVEL_MARK_ON_AREA);
      return;
    }

    if (!diffX && !diffY) {
      return;
    }

    mark.group.set({
      left: mark.group.left + diffX,
      top:  mark.group.top  + diffY,
    });

    mark.position.x = mark.group.left;
    mark.position.y = mark.group.top;
    mark.group.setCoords();
    mark.group.moveTo(LEVEL_MARK);
  });
  // end on move image


  // on scale image
  if (previousImageSize.x != image.image.scaleX) {
    image.marks.map(function(mark) {
      if (mark.relation !== 'image') {
        return;
      }

      var scaleDiffX = (mark.group.left - image.image.left - diffX) * (image.image.scaleX - previousImageSize.x);
      var scaleDiffY = (mark.group.top  - image.image.top  - diffY) * (image.image.scaleY - previousImageSize.y);

      console.log(scaleDiffX)
      if (diffX > 0) {
        scaleDiffX = -scaleDiffX;
      }

      if (diffY > 0) {
        scaleDiffY = -scaleDiffY;
      }



      var left = mark.group.left + scaleDiffX + diffX;
      var top  = mark.group.top  + scaleDiffY + diffY;
      mark.group.set({
        left: left,
        top:  top,
      });

      mark.group.setCoords();
    });
  }
  // end on scale image


  image.image.previousPosition = {
    x: image.image.left,
    y: image.image.top,
  };

  previousImageSize = {
    x: image.image.scaleX * image.image.width,
    y: image.image.scaleY * image.image.height,
  };

  mark.canvas.renderAll();
}, 1000/FPS);
