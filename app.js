'use strict';

function sendEventCb(e, property) {
  if (!e.target || !e.target.parent || !e.target.parent[property]) {
    return;
  }

  e.target.parent[property](e);
}

function createDefaultMark(type) {
  var mark = null;

  if (type == 'item') {
    mark = new ItemMark({
      left: marksArea.rect.left + marksArea.rect.width  / 5,
      top:  marksArea.rect.top  + marksArea.rect.height / 2 - 30,
    }, {
      image: image,
      marksArea: marksArea,
      marksStoreArea: marksStoreArea,
    });
    canvas.add(mark.group);

    mark.connect('marksArea');
    mark.home();
  } else if (type == 'price') {
    mark = new PriceMark({
      left: marksArea.rect.left + marksArea.rect.width  / 5 * 3,
      top:  marksArea.rect.top  + marksArea.rect.height / 2 - 30,
    }, {
      image: image,
      marksArea: marksArea,
      marksStoreArea: marksStoreArea,
    });
    canvas.add(mark.group);

    mark.connect('marksArea');
    mark.home();
  }

  return mark;
}


var LEVEL_IMAGE = 0,
    LEVEL_AREA = 2,
    LEVEL_MARK_ON_AREA  = 3,
    LEVEL_MARK_ON_IMAGE = 1,
    LEVEL_MARK_SELECTED = 4;

var count = new Count();
var marks = [];

var canvas = new fabric.Canvas('canvas', {
  width: 1024,
  height: 400,
  selection: false,
});

canvas.on({
  'mouse:up':   function(e) { sendEventCb(e, 'mouseUpCb');   },
  'mouse:down': function(e) { sendEventCb(e, 'mouseDownCb'); },
});

var marksArea = new Area({
  left: canvas.width / 3 * 2,
  top: 0,
  width: canvas.width / 3 - 1,
  height: canvas.height / 2,
});
canvas.add(marksArea.rect);
marksArea.moveTo(LEVEL_AREA);

var marksStoreArea = new Area({
  left: canvas.width / 3 * 2,
  top: canvas.height / 2,
  width: canvas.width / 3 - 1,
  height: canvas.height / 2 - 1,
});
canvas.add(marksStoreArea.rect);
marksStoreArea.moveTo(LEVEL_AREA);


var imageUrl = 'http://avatarbox.net/avatars/img19/homer_jamaica_avatar_picture_18399.gif';
var imageArea = {
  left: 0,
  top: 0,
  width: this.canvas.width / 3 * 2,
  height: this.canvas.height,
};

var image = new Image(canvas, imageUrl, imageArea, function() {
  canvas.add(image.image);
  image.moveTo(LEVEL_IMAGE);

  marks.push(createDefaultMark('item'));
  marks.push(createDefaultMark('price'));

  var zoomOutControl = new ZoomOutControl(image, {
    left: 1,
    top: 1,
    text: 'Уменьшить',
  });
  canvas.add(zoomOutControl.group);


  var centerControl = new CenterControl(image, {
    left: 125,
    top: 1,
    text: 'По умолчанию',
  });
  canvas.add(centerControl.group);

  var zoomControl = new ZoomControl(image, {
    left: 280,
    top: 1,
    text: 'Увеличить',
  });
  canvas.add(zoomControl.group);

  loop()
});



function loop() {
  marks.forEach(function(mark) {
    if (mark.selected) {
      return;
    }

    if (mark.connectType == 'marksArea') {
      if (mark.isInside(marksArea.area())) {
        mark.moveTo(LEVEL_MARK_ON_AREA);
        mark.home();
      } else if (mark.isInside(marksStoreArea.area())) {
        mark.moveTo(LEVEL_MARK_ON_AREA);
        mark.setNumber(count.next(mark.type));
        mark.connect('marksStoreArea');
        mark.home();

        marks.push(createDefaultMark(mark.type));
      } else if (mark.isInside(image.area())) {
        mark.moveTo(LEVEL_MARK_ON_IMAGE);
        mark.setNumber(count.next(mark.type));
        mark.connect('image');
        mark.home();

        marks.push(createDefaultMark(mark.type));
      }

      mark.home();
      return;
    }

    if (mark.connectType == 'marksStoreArea') {
      if (mark.isInside(marksArea.area())) {
        mark.moveTo(LEVEL_MARK_ON_AREA);
        mark.home();
      } else if (mark.isInside(marksStoreArea.area())) {
        mark.moveTo(LEVEL_MARK_ON_AREA);
      } else if (mark.isInside(image.area())) {
        mark.moveTo(LEVEL_MARK_ON_IMAGE);
        mark.connect('image');
        mark.home();
      }

      mark.home();
      return;      
    }


    if (mark.connectType == 'image') {
      if (mark.level != LEVEL_MARK_SELECTED) {
        mark.home();
        return;
      }


      if (mark.isInside(marksArea.area())) {
        mark.home();
      } else if (mark.isInside(marksStoreArea.area()) && mark.level == LEVEL_MARK_SELECTED) {
        mark.moveTo(LEVEL_MARK_ON_AREA);
        mark.connect('marksStoreArea');
        mark.home();
      } else if (mark.isInside(image.area())) {
        mark.moveTo(LEVEL_MARK_ON_IMAGE);
        mark.connect('image');
        mark.home();
      }

      mark.home();
      return;
    }

    mark.home();
  });

  image.moveTo(LEVEL_IMAGE);
  marksArea.moveTo(LEVEL_AREA);
  marksStoreArea.moveTo(LEVEL_AREA);

  canvas.renderAll();
  requestAnimationFrame(loop.bind(this));
}