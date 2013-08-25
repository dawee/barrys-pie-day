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
    board.notify({text: 'She\'s not my type', talker: 'barry'});
};

JudgeWoman.prototype.watch = function () {
    board.notify({text: 'She\'s not my type', talker: 'barry'});
};

JudgeWoman.prototype.talk = function () {
    board.talk({sentences: [
        {text: 'Hi', talker: 'barry'},
        {text: 'Hello darling !', talker: 'judge-woman'},
        {text: 'I want to be the only second of the competition', talker: 'barry'},
        {text: 'Sure my dear, and why would I do that for you ?', talker: 'judge-woman'},
        {text: 'Because I was faster than the other 9 dudes', talker: 'barry'},
        {text: 'I\'m affraid I don\'t care sweet heart', talker: 'judge-woman'},
        {text: '...', talker: 'judge-woman'},
        {text: 'Give me your phone number darling', talker: 'judge-woman'},
        {text: 'Wh... What ??', talker: 'barry'},
        {text: 'Give me your phone number and I\'ll do anything you want', talker: 'judge-woman'},
        {text: '*wink*', talker: 'judge-woman'},
        {text: 'brrrrrrrrrr', talker: 'barry'},
    ]});
};


module.exports = JudgeWoman;