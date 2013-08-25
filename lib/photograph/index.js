var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');
var board = require('board');

function Photograph() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Photograph.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.photograph.tile(),
        x: 160,
        y: 64
    })});
    this.barry = new Barry({
        screen: this.screen,
        tilesets: this.tilesets,
        x: 250,
        y: 65
    });

    this.layer.addView({view: this.barry});
    return this;
};

Photograph.prototype.reset = function() {
    this.screen.root = this.root;
    board.reset({mode: this});
};

Photograph.prototype.onMouseDown = function (event) {
    var options = event;
    var that = this;

    board.setSubject(event);
    
    options.callback = function () {
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {
            loop.setMode({mode: map});
        }

    };

    board.activate();
};

Photograph.prototype.update = function () {
    this.barry.step();
};

Photograph.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Photograph();