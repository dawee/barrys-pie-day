var sprite = require('sprite');
var clone = require('clone');

function JudgeYoung(options) {
    this.screen = options.screen;
    options.tileset = options.tilesets.judges;
    options.animation = 'judge_young_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
}

JudgeYoung.prototype = clone(sprite.Sprite.prototype);

module.exports = JudgeYoung;