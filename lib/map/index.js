var canvas = require('canvas');
var sprite = require('sprite');
var Area = require('area');

function Map() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Map.prototype.init = function (options) {
    this.screen = options.screen;
    this.areas = new Area({screen: this.screen, click: [
        Area.define({left: 0, top: this.screen.viewport.height, width: 100, height: 100, callback: this.onAreaClicked})
    ]});
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.map.tile(),
        x: 160,
        y: 64
    })});
};

Map.prototype.onAreaClicked = function () {
    console.log('clicked');
};

Map.prototype.reset = function() {
    this.screen.root = this.root;
};

Map.prototype.onMouseDown = function (event) {
    this.areas.onMouseDown(event);
};

Map.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Map();