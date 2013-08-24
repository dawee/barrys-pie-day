var canvas = require('canvas');
var gameEl = document.getElementById('game');
var tile = require('tile');
var sprite = require('sprite');
var loop = require('loop');
var loader = require('loader');

var map = require('map');
var stadium = require('stadium');
var photograph = require('photograph');
var lake = require('lake');

sprite.Sprite.fps = 10;

var screen = new canvas.Canvas({
    width: 960,
    height: 384,
    viewport: {
        width: 320,
        height: 128
    },
    parent: gameEl
});

var board = document.createElement('div');
board.setAttribute('class', 'board');
gameEl.appendChild(board);

tile.load({url: '/static/assets/tilesets', success: function (options) {
    loader.load({tilesets: options.tilesets, callback: function () {
        var opt = {screen: screen, tilesets: options.tilesets};

        map.init({screen: screen, tilesets: options.tilesets, places: {
            stadium: stadium.init(opt),
            photograph: photograph.init(opt),
            lake: lake.init(opt)
        }});
        

        loop.setMode({mode: stadium});
        loop.start({mouseArea: screen.el});
    }});

}});