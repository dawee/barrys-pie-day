var Drawable = require('./drawable');

function ImageLayer(options) {
    options = options || {};
    this.image = null;
    var image = options.image || null;
    if (image !== null) {
        this.setImage({image: image});
    }
    this.width = options.width || this.image.width || 0;
    this.height = options.height || this.image.height || 0;
    this.x = options.x || 0;
    this.y = options.y || 0;
    this._calculationRequired = true;
}

function _calcReal(imageLayer, canvas) {
    var viewport = canvas.viewport;
    var leftX = imageLayer.x - imageLayer.width / 2;
    var topY = imageLayer.y + imageLayer.height / 2;
    var topReversedY = viewport.height - topY;

    imageLayer.reals = {
        y: (topReversedY * canvas.height) / viewport.height,
        x: (leftX * canvas.width) / viewport.width,
        width: (imageLayer.width * canvas.width) / viewport.width,
        height: (imageLayer.height * canvas.height) / viewport.height
    };
}

ImageLayer.prototype.setImage = function (options) {
    var image = options.image;

    if (image instanceof HTMLElement) {
        this.image = new Drawable({el: image});
    } else {
        this.image = image;
    }
};

ImageLayer.prototype.draw = function (options) {
    var canvas = options.canvas;

    if (this._calculationRequired) {
        _calcReal(this, canvas);
        this._calculationRequired = false;
    }

    this.image.draw({reals: this.reals, canvas: canvas});
};

ImageLayer.prototype.setGeometry = function (options) {
    this.x = options.x || this.x;
    this.y = options.y || this.y;
    this.width = options.width || this.width;
    this.height = options.height || this.height;

    this._calculationRequired = true;
};

module.exports = ImageLayer;