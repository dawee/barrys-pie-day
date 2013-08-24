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
        barry.callback();
    }
}

Barry.prototype.walkTo = function (options) {
    var target = (options.offsetX * this.screen.viewport.width) / this.screen.width;
    if (target !== this.x) {
        this.target = target;
        this.callback = options.callback || function () {};
        this.direction = (this.target > this.x) ? 1 : -1;

        if (this.target > this.x) {
            this.loop({animation: 'walk_right'});
        } else {
            this.loop({animation: 'walk_left'});
        }
    }
};

Barry.prototype.step = function () {
    _walk(this);
    sprite.Sprite.prototype.step.apply(this);
}

module.exports = Barry;