var sprite = require('sprite');
var clone = require('clone');

function JudgeGlass(options) {
    this.screen = options.screen;
    options.tileset = options.tilesets.judges;
    options.animation = 'judge_glass_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
}

JudgeGlass.prototype = clone(sprite.Sprite.prototype);

module.exports = JudgeGlass;