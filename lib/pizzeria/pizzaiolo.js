var sprite = require('sprite');
var clone = require('clone');
var Area = require('area');
var board = require('board');

var items = {
    'pizzaiolo-business-card': {
        name: 'Business Card',
        id: 'pizzaiolo-business-card'
    }

};

function Pizzaiolo(options) {
    this.name = "PIZZAIOLO";

    this.screen = options.screen;
    options.tileset = options.tilesets.pnj;
    options.animation = 'pizzaiolo_stand';
    this.target = null;
    this.direction = null;

    sprite.Sprite.apply(this, [options]);
    this.left = this.x - this.width / 2;
    this.top = this.y + this.height / 2;
    this.width = this.image.width;
    this.height = this.image.height;    
}

Pizzaiolo.prototype = clone(sprite.Sprite.prototype);
Pizzaiolo.prototype.contains = Area.Rect.prototype.contains;

Pizzaiolo.prototype.hover = function () {
    board.setSubject(this);
};

Pizzaiolo.prototype.click = function () {
    board.setSubject(this);
};

Pizzaiolo.prototype.talk = function () {
    if (!board.is('pizzaiolo:talk:0')) {
        board.talk({
            sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello Sir ! Welcome to Pizza Nut', talker: 'pizzaiolo'},
                {text: 'Nut ? You mean Pizza ...', talker: 'barry'},
                {text: 'No sir', talker: 'pizzaiolo'},
            ],
            callback: function () {
                board.set('pizzaiolo:talk:0', true);
            }
        });
    } else if (!board.is('pizzaiolo:talk:1')) {
        board.talk({
            sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello Sir ! Welcome to Pizza Nut', talker: 'pizzaiolo'},
                {text: 'What kind of pizza do you have ?', talker: 'barry'},
                {text: 'We have plenty of flavours sir !', talker: 'pizzaiolo'},
                {text: 'We have salted, sweet', talker: 'pizzaiolo'},
                {text: 'With meat, or with bacon', talker: 'pizzaiolo'},
                {text: 'With laurel, that one comes from my neighbor\'s garden', talker: 'pizzaiolo'},
            ],
            callback: function () {
                board.set('pizzaiolo:talk:1', true);
            }
        });
    }  else if (!board.is('pizzaiolo:talk:2')) {
        board.talk({
            sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello Sir ! Welcome to Pizza Nut', talker: 'pizzaiolo'},
                {text: 'Sorry, I don\'t remember your pizzas flavours', talker: 'barry'},
                {text: 'No probleme sir !', talker: 'pizzaiolo'},
                {text: 'We have salted, sweet', talker: 'pizzaiolo'},
                {text: 'With meat, or with bacon', talker: 'pizzaiolo'},
                {text: 'With laurel, that one comes from my neighbor\'s garden', talker: 'pizzaiolo'},
            ],
            callback: function () {
                board.set('pizzaiolo:talk:2', true);
            }
        });
    } else if (!board.is('pizzaiolo:talk:3')) {
        board.talk({
            sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello Sir ! Welcome to Pizza Nut', talker: 'pizzaiolo'},
                {text: 'Could you tell me another time', talker: 'barry'},
                {text: 'Okay ... But maybe you could note it this time sir ?', talker: 'pizzaiolo'},
                {text: 'We have salted, sweet', talker: 'pizzaiolo'},
                {text: 'With meat, or with bacon', talker: 'pizzaiolo'},
                {text: 'With laurel, that one comes from my neighbor\'s garden', talker: 'pizzaiolo'},
            ],
            callback: function () {
                board.set('pizzaiolo:talk:3', true);
            }
        });
    } else if (!board.is('pizzaiolo:talk:4')) {
        board.talk({
            sentences: [
                {text: 'Hi', talker: 'barry'},
                {text: 'Hello Sir ! Welcome to Pizza Nut', talker: 'pizzaiolo'},
                {text: 'Sorry, another time ?', talker: 'barry'},
                {text: 'Sorry sir, but I have to work', talker: 'pizzaiolo'},
                {text: 'Take my business card', talker: 'pizzaiolo'},
                {text: 'I wrote the list for you', talker: 'pizzaiolo'},
            ],
            callback: function () {
                board.set('pizzaiolo:talk:4', true);
                board.addItem({item: items['pizzaiolo-business-card']});
            }
        });
    } else {
         board.talk({sentences: [
            {text: 'Hi', talker: 'barry'},
            {text: 'Sorry sir I have no time to talk', talker: 'pizzaiolo'}
        ]});
    }
};

module.exports = Pizzaiolo;