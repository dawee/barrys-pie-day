var canvas = require('canvas');
var sprite = require('sprite');
var loop = require('loop');
var board = require('board');
var Area = require('area');
var introduction = require('./introduction');

function Menu() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Menu.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.menu.tile(),
        x: 160,
        y: 64
    })});
    var play = Area.define({
        left: 255,
        top: 71,
        width: 60,
        height: 45,
        click: function () {
            console.log('set mode');
            loop.setMode({mode: introduction});
        },
    });
    this.areas = new Area({screen: this.screen, areas: [play]});
    return this;
};

Menu.prototype.reset = function() {
    board.setVerb({verb: {name: ''}});
    this.screen.root = this.root;
    board.hide();
};

Menu.prototype.onMouseDown = function (event) {
    this.areas.onMouseDown(event);
};

Menu.prototype.draw = function () {
    this.screen.draw();
};

module.exports = new Menu();