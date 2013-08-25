var canvas = require('canvas');
var sprite = require('sprite');
var loop = require('loop');
var board = require('board');
var Area = require('area');
var stadium = require('stadium');

function Introduction() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Introduction.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_a.groups.introduction.tile(),
        x: 160,
        y: 64
    })});
    return this;
};

Introduction.prototype.reset = function() {
    console.log('reset introduction');
    board.setVerb({verb: {name: ''}});
    this.screen.root = this.root;
    board.hide();
    board.talk({
        sentences: [
            {text: 'Here are the results for this 33rd edition of "The Best Pie Eater"'},
            {text: 'John, with 9 pies : third place'},
            {text: 'Jim, with 12 pies : second place'},
            {text: 'Tom, with 12 pies : second place, ex-aequo'},
            {text: 'Peter, with 12 pies : second place, ex-aequo'},
            {text: 'Tom, with 12 pies : second place, ex-aequo'},
            {text: 'William, with 12 pies : second place, ex-aequo'},
            {text: 'Jonathan, with 12 pies : second place, ex-aequo'},
            {text: 'David, with 12 pies : second place, ex-aequo'},
            {text: 'Colin, with 12 pies : second place, ex-aequo'},
            {text: 'Philip, with 12 pies : second place, ex-aequo'},
            {text: 'Mickael, with 12 pies : second place, ex-aequo'},
            {text: 'Barry, with 12 pies : second place, ex-aequo'},
            {text: 'You got to be kidding me ...', talker: 'barry'},
            {text: 'And Chuck, with 15 pies, first place.'},
            {text: 'Congratulations, all of you'},
            {text: 'I need to talk to the judges', talker: 'barry'},
        ],
        callback: function () {
            loop.setMode({mode: stadium});
        }
    })
};

Introduction.prototype.draw = function () {
    this.screen.draw();
};

module.exports = new Introduction();