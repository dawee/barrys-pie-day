var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');

function Lake() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Lake.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.lake.tile(),
        x: 160,
        y: 64
    })});
    this.barry = new Barry({
        screen: this.screen,
        tilesets: this.tilesets,
        x: 260,
        y: 60
    });

    this.layer.addView({view: this.barry});
    return this;
};

Lake.prototype.reset = function() {
    this.screen.root = this.root;
};

Lake.prototype.onMouseDown = function (event) {
    var options = event;
    var that = this;
    
    options.callback = function () {
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {
            loop.setMode({mode: map});
        }

    };
    
    this.barry.walkTo(event);
};

Lake.prototype.update = function () {
    this.barry.step();
};

Lake.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Lake();