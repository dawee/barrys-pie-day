var sprite = require('sprite');
var clone = require('clone');
var Area = require('area');
var board = require('board');

function JudgeWoman(options) {
    this.name = "JUDGE WOMAN";

    this.screen = options.screen;
    options.tileset = options.tilesets.judges;
    options.animation = 'judge_woman_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
    this.left = this.x - this.width / 2;
    this.top = this.y + this.height / 2;
    this.width = this.image.width;
    this.height = this.image.height;
}

JudgeWoman.prototype = clone(sprite.Sprite.prototype);

JudgeWoman.prototype.contains = Area.Rect.prototype.contains;

JudgeWoman.prototype.hover = function () {
    board.setSubject(this);
};

JudgeWoman.prototype.click = function () {
    board.setSubject(this);
};

JudgeWoman.prototype.take = function () {
    board.notify({text: 'She\'s not my type'});
};


module.exports = JudgeWoman;