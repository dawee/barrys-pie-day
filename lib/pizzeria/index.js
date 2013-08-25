var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');
var board = require('board');
var Area = require('area');
var Pizzaiolo = require('./pizzaiolo');

function Pizzeria() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Pizzeria.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_a.groups.pizzeria.tile(),
        x: 160,
        y: 64
    })});
    this.pizzaiolo = new Pizzaiolo({screen: this.screen, tilesets: this.tilesets, x: 145, y: 112});
    this.layer.addView({view: this.pizzaiolo});

    this.barry = new Barry({
        screen: this.screen,
        tilesets: this.tilesets,
        x: 150,
        y: 50
    });
    this.layer.addView({view: this.barry});

    var town = Area.define({
        left: 0,
        top: this.screen.viewport.height / 8.0,
        width: this.screen.viewport.width,
        height: this.screen.viewport.height / 8.0,
        hover: function () {
            board.setSubject(town);
        },
        click: function () {
            this.x = this.left;
            board.setSubject(town);
            if (board.is(['judge-woman:talk:first', 'judge-glass:talk:first', 'judge-young:talk:first'])) {
                loop.setMode({mode: map});
            } else {
                board.notify({text: 'I won\'t go until I didn\'t talk to the judges', talker: 'barry'});
            }
        },
        go: function () {}
    });
    town.name = 'TOWN';


    this.areas = new Area({screen: this.screen, areas: [
        town, this.pizzaiolo
    ]});
    return this;
};

Pizzeria.prototype.reset = function() {
    this.screen.root = this.root;
    board.reset({mode: this});
};

Pizzeria.prototype.onMouseDown = function (event) {
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

Pizzeria.prototype.onMouseMove = function (event) {
    board.setSubject(event);
    this.areas.onMouseMove(event);
};


Pizzeria.prototype.update = function () {
    this.barry.step();
    this.pizzaiolo.step();
};

Pizzeria.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Pizzeria();