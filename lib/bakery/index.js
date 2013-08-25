var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');
var board = require('board');
var Area = require('area');
var Bin = require('./bin');


function Bakery() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Bakery.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_a.groups.bakery.tile(),
        x: 160,
        y: 64
    })});
    this.barry = new Barry({
        screen: this.screen,
        tilesets: this.tilesets,
        x: 250,
        y: 70
    });
    this.layer.addView({view: this.barry});

    var town = Area.define({
        left: this.screen.viewport.width * 7.0 / 8,
        top: this.screen.viewport.height,
        width: this.screen.viewport.width,
        height: this.screen.viewport.height,
        hover: function () {
            board.setSubject(town);
        },
        click: function () {
            loop.setMode({mode: map});
        },
        go: function () {}
    });
    town.name = "TOWN";

    var ventilation = Area.define({left: 145, top: 81, width: 46, height: 34,
        hover: function () {
            board.setSubject(ventilation);
        },
        click: function () {
            board.setSubject(ventilation);
        },
    });
    ventilation.x = ventilation.left + ventilation.width / 2;
    ventilation.name = 'VENTILATION';
    ventilation.look = function () {
        board.notify({text: 'It\'s warm and it smells good bread', talker: 'barry'});
    };

    this.bin = new Bin({screen: this.screen, tilesets: this.tilesets, x: 43, y: 82});
    this.layer.addView({view: this.bin});

    this.areas = new Area({screen: this.screen, areas: [
        town, ventilation, this.bin
    ]});
    return this;
};

Bakery.prototype.reset = function() {
    this.screen.root = this.root;
    board.reset({mode: this});
};

Bakery.prototype.onMouseDown = function (event) {
    var options = event;
    var that = this;

    board.setSubject(event);

    options.callback = function () {
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {
            loop.setMode({mode: map});
        }

    };
    this.areas.onMouseDown(event);
    board.activate();
};

Bakery.prototype.onMouseMove = function (event) {
    board.setSubject(event);
    this.areas.onMouseMove(event);
};

Bakery.prototype.update = function () {
    this.bin.step();
    this.barry.step();
};

Bakery.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Bakery();