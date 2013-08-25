var sprite = require('sprite');
var clone = require('clone');
var Area = require('area');
var board = require('board');

function JudgeGlass(options) {
    this.name = "JUDGE WITH GLASSES";

    this.screen = options.screen;
    options.tileset = options.tilesets.pnj;
    options.animation = 'judge_glass_sit';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
    this.left = this.x - this.width / 2;
    this.top = this.y + this.height / 2;
    this.width = this.image.width;
    this.height = this.image.height;    
}

JudgeGlass.prototype = clone(sprite.Sprite.prototype);
JudgeGlass.prototype.contains = Area.Rect.prototype.contains;

JudgeGlass.prototype.hover = function () {
    board.setSubject(this);
};

JudgeGlass.prototype.click = function () {
    board.setSubject(this);
};

JudgeGlass.prototype.talk = function () {
    if (!board.is('judge-glass:talk:first')) {
        board.talk({sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello mister', talker: 'judge-glass'},
                {text: 'I want to be the only second of the competition', talker: 'barry'},
                {text: 'There is no reason for that mister', talker: 'judge-glass'},
                {text: 'You ate exactly the same number of pie as the others 9', talker: 'judge-glass'},
                {text: 'Yeah, but I was faster', talker: 'barry'},                
                {text: 'Interesting ...', talker: 'judge-glass'},
                {text: 'Well this is a good idea to count time in the competition', talker: 'judge-glass'},
                {text: 'Great ! So you will look at my time ?', talker: 'barry'},                
                {text: 'No', talker: 'judge-glass'},
                {text: 'But, why not ?', talker: 'barry'},                
                {text: 'We don\'t have a chrono', talker: 'judge-glass'},
                {text: 'We have nothing to measure time', talker: 'judge-glass'},
                {text: 'Bring me something to measure time and I\'ll watch your time', talker: 'judge-glass'},
            ],
            callback: function () {
                board.set('judge-glass:talk:first', true);
            }
        });
    } else {
        board.talk({sentences: [
            {text: 'Hi', talker: 'barry'},
            {text: 'Hello mister', talker: 'judge-glass'},
            {text: 'Did you find the chrono ?', talker: 'judge-glass'},
            {text: 'No', talker: 'barry'},
            {text: 'Look for it !', talker: 'judge-glass'},
        ]});
    }
};

module.exports = JudgeGlass;