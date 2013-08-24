var canvas = require('canvas');
clone = require('clone');

function Sprite(options) {
    this.tileset = options.tileset;
    this.setAnimation({animation: options.animation || Object.keys(this.tileset.groups)[0]});
    options.image = this.image;
    this.lastStep = null;
    canvas.ImageView.apply(this, [options]);
};

Sprite.fps = 20;

Sprite.prototype = clone(canvas.ImageView.prototype);

Sprite.prototype.setAnimation = function (options) {
    this.index = 0;
    this.animation = this.tileset.group({group: options.animation});
    this.fps = this.animation.fps || Sprite.fps;
    this.periodMS = 1000.0 / this.fps;
    this.image = this.animation.tile({index: this.index});
};

Sprite.prototype.loop = function (options) {
    this.setAnimation(options);
};

Sprite.prototype.step = function () {
    if (this.lastStep === null) {
        this.lastStep = Date.now();
    } else if (Date.now() - this.lastStep >= this.periodMS) {
        this.index++;
        if (this.index >= this.animation.tiles.length) {
            this.index = 0;
        }
        this.image = this.animation.tile({index: this.index});
        this.lastStep = Date.now();
    }
};

exports.Sprite = Sprite;