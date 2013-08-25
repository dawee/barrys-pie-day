var canvas = require('canvas');
var gameEl = document.getElementById('game');
var tile = require('tile');
var sprite = require('sprite');
var loop = require('loop');
var loader = require('loader');

var board = require('board');
var map = require('map');
var stadium = require('stadium');
var photograph = require('photograph');
var lake = require('lake');
var theater = require('theater');
var pizzeria = require('pizzeria');
var bakery = require('bakery');
var clockRepair = require('clock-repair');


sprite.Sprite.fps = 10;

gameEl.appendChild(board.dialog);

var screen = new canvas.Canvas({
    width: 960,
    height: 384,
    viewport: {
        width: 320,
        height: 128
    },
    parent: gameEl
});

gameEl.appendChild(board.render().el);

var url = location.host.match(/github/) ? '/barrys-pie-day/static/assets/tilesets' : '/static/assets/tilesets';

tile.load({url: url, success: function (options) {
    loader.load({tilesets: options.tilesets, callback: function () {
        var opt = {screen: screen, tilesets: options.tilesets};

        map.init({screen: screen, tilesets: options.tilesets, places: {
            stadium: stadium.init(opt),
            photograph: photograph.init(opt),
            lake: lake.init(opt),
            theater: theater.init(opt),
            pizzeria: pizzeria.init(opt),
            bakery: bakery.init(opt),
            clockRepair: clockRepair.init(opt)
        }});
        

        loop.setMode({mode: stadium});
        loop.start({mouseArea: screen.el});
    }});

}});
