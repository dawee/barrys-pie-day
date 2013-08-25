var sprite = require('sprite');
var clone = require('clone');
var Area = require('area');
var board = require('board');

function JudgeYoung(options) {
    this.name = "YOUNG JUDGE";

    this.screen = options.screen;
    options.tileset = options.tilesets.judges;
    options.animation = 'judge_young_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
    this.left = this.x - this.width / 2;
    this.top = this.y + this.height / 2;
    this.width = this.image.width;
    this.height = this.image.height;     
}

JudgeYoung.prototype = clone(sprite.Sprite.prototype);
JudgeYoung.prototype.contains = Area.Rect.prototype.contains;


JudgeYoung.prototype.hover = function () {
    board.setSubject(this);
};

JudgeYoung.prototype.click = function () {
    board.setSubject(this);
};

JudgeYoung.prototype.talk = function () {
    if (!board.is('judge-young:talk:first')) {
        board.talk({sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hi man !', talker: 'judge-young'},
                {text: 'I\'ve heard you were disapointed about your score', talker: 'judge-young'},
                {text: 'I can help you to change your place if you want, huhu.', talker: 'judge-young'},
                {text: 'Oh yeah ? Great !', talker: 'barry'},
                {text: 'Ya man, but it\'s giving giving you know ?', talker: 'judge-young'},
                {text: 'Yes ... I start to understand this, what do you want ?', talker: 'barry'},
                {text: 'Don\'t know dude, something hot and cool', talker: 'judge-young'},
                {text: '... and hot, huhu', talker: 'judge-young'},
            ],
            callback: function () {
                board.set('judge-young:talk:first', true);
            }
        });
    } else {
        board.talk({sentences: [
            {text: 'Hi', talker: 'barry'},
            {text: 'Don\'t loose your mojo man !', talker: 'judge-young'},
        ]});
    }
};

module.exports = JudgeYoung;