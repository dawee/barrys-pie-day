var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');

function Stadium() {}

Stadium.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    console.log(this.tilesets)
    layer = this.screen.root.layers[0];
    layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.stadium.tile(),
        x: 160,
        y: 64
    })});
    this.barry = new Barry({
        screen: this.screen,
        tilesets: this.tilesets,
        x: 150,
        y: 50
    });

    layer.addView({view: this.barry});
};

Stadium.prototype.onMouseDown = function (event) {
    this.barry.walkTo(event);
};

Stadium.prototype.update = function () {
    this.barry.step();
};

Stadium.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Stadium();