var sprite = require('sprite');
var clone = require('clone');

function JudgeWoman(options) {
    this.screen = options.screen;
    options.tileset = options.tilesets.judges;
    options.animation = 'judge_woman_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
}

JudgeWoman.prototype = clone(sprite.Sprite.prototype);

module.exports = JudgeWoman;