var canvas = require('canvas');
var gameEl = document.getElementById('game');
var stadium = require('stadium');
var tile = require('tile');
var sprite = require('sprite');
var loop = require('loop');
var loader = require('loader');

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

var layer = new canvas.Layer();
screen.root.addLayer({layer: layer});


tile.load({url: '/static/assets/tilesets', success: function (options) {
    loader.load({tilesets: options.tilesets, callback: function () {
        stadium.init({screen: screen, tilesets: options.tilesets});
        loop.setMode({mode: stadium});
        loop.start({mouseArea: screen.el});
    }});

}});