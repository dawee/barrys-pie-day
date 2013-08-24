var canvas = require('canvas');
var sprite = require('sprite');
var Area = require('area');
var loop = require('loop');

function Map() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Map.prototype.init = function (options) {
    var that = this;

    this.places = options.places;
    this.screen = options.screen;
    this.areas = new Area({screen: this.screen, click: [
        Area.define({left: 8, top: 120, width: 45, height: 45, callback: this.goToStadium.bind(this)}),
        Area.define({left: 52, top: 128, width: 40, height: 22, callback: this.goToPhotograph.bind(this)}),
        Area.define({left: 269, top: 110, width: 40, height: 30, callback: this.goToLake.bind(this)})
    ]});
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.map.tile(),
        x: 160,
        y: 64
    })});

    return this;
};

Map.prototype.goToStadium = function () {
    loop.setMode({mode: this.places.stadium});
};

Map.prototype.goToPhotograph = function () {
    loop.setMode({mode: this.places.photograph});
};

Map.prototype.goToLake = function () {
    loop.setMode({mode: this.places.lake});
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