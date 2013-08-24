var canvas = require('canvas');
var sprite = require('sprite');

function Map() {}

Map.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.map.tile(),
        x: 160,
        y: 64
    })});
};

Map.prototype.reset = function() {
    this.screen.root = this.root;
};

Map.prototype.onMouseDown = function (event) {
    
};

Map.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Map();