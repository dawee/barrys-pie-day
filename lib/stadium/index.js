var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');

function Stadium() {}

Stadium.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
    this.layer.addView({view: new canvas.ImageView({
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

    this.layer.addView({view: this.barry});
};

Stadium.prototype.reset = function() {
    this.screen.root = this.root;
};

Stadium.prototype.onMouseDown = function (event) {
    var options = event;
    var that = this;
    
    options.callback = function () {
        if (that.barry.x > that.screen.viewport.width / 5) {
            loop.setMode({mode: map});
        }

    };
    
    this.barry.walkTo(event);
};

Stadium.prototype.update = function () {
    this.barry.step();
};

Stadium.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Stadium();