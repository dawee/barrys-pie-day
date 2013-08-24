var canvas = require('canvas');
var sprite = require('sprite');
var Barry = require('barry');
var loop = require('loop');
var map = require('map');
var JudgeWoman = require('./judgewoman');
var JudgeGlass = require('./judgeglass');
var JudgeYoung = require('./judgeyoung');

function Stadium() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Stadium.prototype.init = function (options) {
    this.screen = options.screen;
    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.stadium.tile(),
        x: 160,
        y: 64
    })});
    this.barry = new Barry({screen: this.screen, tilesets: this.tilesets, x: 150, y: 50});
    this.judgeYoung = new JudgeYoung({screen: this.screen, tilesets: this.tilesets, x: 49, y: 100});
    this.judgeGlass = new JudgeGlass({screen: this.screen, tilesets: this.tilesets, x: 40, y: 88});
    this.judgeWoman = new JudgeWoman({screen: this.screen, tilesets: this.tilesets, x: 28, y: 66});
    this.layer.addView({view: this.barry});

    this.layer.addView({view: this.judgeYoung});
    this.layer.addView({view: this.judgeGlass});
    this.layer.addView({view: this.judgeWoman});
    return this;
};

Stadium.prototype.reset = function() {
    this.screen.root = this.root;
};

Stadium.prototype.onMouseDown = function (event) {
    var options = event;
    var that = this;
    
    options.callback = function () {
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {
            loop.setMode({mode: map});
        }

    };
    
    this.barry.walkTo(event);
};

Stadium.prototype.update = function () {
    this.barry.step();
    this.judgeWoman.step();
    this.judgeGlass.step();
    this.judgeYoung.step();
};

Stadium.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Stadium();