var sprite = require('sprite');
var clone = require('clone');
var Area = require('area');
var board = require('board');

var items = {
    doll: {
        id: 'doll',
        name: 'Barbie Doll'
    },
    'dry-pen': {
        id: 'dry-pen',
        name: 'Dry Ball Pen'
    }
};

function Bin(options) {
    this.name = "PUBLIC BIN";

    this.screen = options.screen;
    options.tileset = options.tilesets.decoration;
    options.animation = 'bin_flies';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
    this.left = this.x - this.width / 2;
    this.top = this.y + this.height / 2;
    this.width = this.image.width;
    this.height = this.image.height;    
}

Bin.prototype = clone(sprite.Sprite.prototype);
Bin.prototype.contains = Area.Rect.prototype.contains;

Bin.prototype.hover = function () {
    board.setSubject(this);
};

Bin.prototype.click = function () {
    board.setSubject(this);
};

Bin.prototype.look = function() {
    if (!board.is('bin:look')) {
        board.talk({
            sentences: [
                {text: 'I have to say', talker: 'barry'},
                {text: 'I never do that', talker: 'barry'},
                {text: 'NEVER', talker: 'barry'},
                {text: 'But ... in my situation', talker: 'barry'},
                {text: '...', talker: 'barry'},
                {text: 'erk erk erk', talker: 'barry'},
                {text: 'Oh my ... oh crap', talker: 'barry'},
                {text: 'Something is moving in there ?', talker: 'barry'},
                {text: '...', talker: 'barry'},
            ],
            callback: function () {
                board.addItem({item: items.doll});
                board.addItem({item: items['dry-pen']});
                board.notify({text: '2 OBJECTS FOUND'});
                board.set('bin:look', true);
            }
        });
    } else {
        board.notify({text: 'Enough of that for me today, thanks.', talker: 'barry'});

    }
};

module.exports = Bin;