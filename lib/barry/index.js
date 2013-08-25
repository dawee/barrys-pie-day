var sprite = require('sprite');
var clone = require('clone');

function Barry(options) {
    this.screen = options.screen;
    options.tileset = options.tilesets.barry;
    options.animation = 'stand';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
}

Barry.prototype = clone(sprite.Sprite.prototype);

function _walk(barry) {
    var reached = false;

    if (barry.target !== null) {
        if (barry.direction === 1) {
            barry.setGeometry({x: barry.x + 1});
            reached = (barry.x >= barry.target);
        } else {
            barry.setGeometry({x: barry.x - 1});
            reached = (barry.x <= barry.target);
        }
    }

    if (reached === true) {
        barry.target = null;
        barry.loop({animation: 'stand'});
        barry.walkCallback();
    }
}

Barry.prototype.walkTo = function (options) {
    var x = options.offsetX === undefined ? options.layerX : options.offsetX;
    var target = (x * this.screen.viewport.width) / this.screen.width;

    if (!!options.name) {
        var target = options.x;
    }

    if (target !== this.x) {
        this.target = target;
        this.walkCallback = options.walkCallback || function () {};
        this.direction = (this.target > this.x) ? 1 : -1;

        if (this.target > this.x) {
            this.loop({animation: 'walk_right'});
        } else {
            this.loop({animation: 'walk_left'});
        }
    }
    if (!!options.name) {
        var length = Math.abs(options.x - this.x);
        length -= options.width;
        this.target = this.x + this.direction * length
    }

};

Barry.prototype.step = function () {
    _walk(this);
    sprite.Sprite.prototype.step.apply(this);
}

module.exports = Barry;