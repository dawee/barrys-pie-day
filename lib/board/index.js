var VerbsDesk = require('./verbsdesk');
var switches = {};
var speechDuration = 500;
var defaultDuration = 2000;
var items = [];
var Combination = require('./combination');

window.setSpeechDuration = function (duration) {
    speechDuration = duration;
};

window.setDefaultDuration = function (duration) {
    defaultDuration = duration;
};

function Board() {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'board');
    this.dialog = document.createElement('div');
    this.dialog.setAttribute('class', 'dialog');
    this.inventory = document.createElement('div');
    this.inventory.setAttribute('class', 'inventory');
    this.verbsDesk = new VerbsDesk({board: this});
    this.combination = new Combination({board: this});
    this.verb = null;
    this.subject = null;
    this.mode = null;
    this.inventorySlot = 0;
    this.handled = null;
}

Board.prototype.notify = function (options) {
    var callback = options.callback || function () {};
    var dialogText = this.dialogText;
    var talker = options.talker || '';
    var delay = (options.text.split(' ').length) * speechDuration;
    delay = delay < defaultDuration ? defaultDuration : delay;
    this.dialog.setAttribute('class', 'dialog ' + talker);
    dialogText.data = options.text;
    console.log(talker.toUpperCase() + ' : ' + options.text, delay);
    this.notifyId = setTimeout(function () {
        dialogText.data = '';
        callback();
    }, delay);
};

Board.prototype.addItem = function (options) {
    items.push(options.item);
    this.updateInventory();
};

Board.prototype.getItem = function (options) {
    var result = null;
    
    items.forEach(function (item) {
        if (item.id === options.id) {
            result = item;
        }
    });

    return result;
};

Board.prototype.removeItem = function (options) {
    var slot = -1;
    var index = 0;

    items.forEach(function (item) {
        if (item.id === options.item.id) {
            console.log(slot);
            slot = index;
        }
        index++;
    });

    if (slot >= 0) {
        items.splice(slot, 1);
    }

    this.updateInventory();
};

Board.prototype.set = function (name, value) {
    switches[name] = value;
};

Board.prototype.is = function (names) {
    names = (typeof names === 'string') ? [names] : names;
    var result = true;
    names.forEach(function (name) {
        if (!switches[name]) {
            result = false;
        }
    });

    return result;
};

Board.prototype.updateInventory = function () {
    
    while (this.inventory.hasChildNodes()) {
        this.inventory.removeChild(this.inventory.firstChild);
    }

    items.reverse().forEach(function (item) {
        var el = document.createElement('div');
        el.setAttribute('class', 'item');
        el.appendChild(document.createTextNode(item.name));
        if (typeof item.select === 'function') {
            el.addEventListener('click', item.select);
        } else {
            var that = this;
            el.addEventListener('click', function () {
                that.selectItem({item: item});
            });
        }
        this.inventory.appendChild(el);
    }, this);
};

Board.prototype.talk = function (options) {
    this.hide();
    this.talkCallback = options.callback || function () {};
    this.sentences = options.sentences.reverse();
    this.showNextSentence();
};

Board.prototype.showNextSentence = function() {
    if (this.sentences.length === 0) {
        this.show();
        this.talkCallback();
    } else {
        var sentence = this.sentences.pop();
        var that = this;
        sentence.callback = function () {
            that.showNextSentence();
        }
        this.notify(sentence);
    }
};

Board.prototype.selectItem = function (options) {
    var item = options.item;

    if (this.handled === null && typeof this.verb.name === 'function') {
        this.handled = item;
        var verbName = typeof this.verb.name === 'function' ? this.verb.name() : this.verb.name;
        this.setStatus({status: verbName});
    } else {
        this.setSubject(item);
        this.activate();
    }
};

Board.prototype.setDefault = function (options) {
    this.default = options.verb;
    this.setVerb({verb: this.default});
};

Board.prototype.reset = function (options) {
    options = options || {};
    if (!!options.mode) {
        this.mode = options.mode;
    }
    this.setVerb({verb: this.default});
    this.subject = null;
    this.handled = null;
    this.show();
};

Board.prototype.show = function () {
    this.verbsDesk.el.setAttribute('style', 'display: block');
};

Board.prototype.hide = function () {
    this.verbsDesk.el.setAttribute('style', 'display: none');
};

Board.prototype.setStatus = function (options) {
    this.status = options.status;
    this.statusText.data = this.status;
};

Board.prototype.setVerb = function (options) {
    this.verb = options.verb;
    var verbName = typeof this.verb.name === 'function' ? this.verb.name() : this.verb.name;
    this.handled = null;
    this.setStatus({status: verbName});
};

Board.prototype.setSubject = function (subject) {
    this.subject = subject;
    var verbName = typeof this.verb.name === 'function' ? this.verb.name() : this.verb.name;

    if (typeof subject.name === 'string') {
        this.setStatus({status: verbName + ' ' + subject.name});
    } else {
        this.setStatus({status: verbName});
    }
};

Board.prototype.activate = function () {
    if (typeof this.verb.activate !== 'function') {
        console.log('verb with no activation');
        return;
    }
    if (typeof this.subject === null) {
        console.log('no subject defined');
        return;
    }
    if (typeof this.mode === null) {
        console.log('no mode defined');
        return;
    }
    this.verb.activate({board: this});
    this.setVerb({verb: this.default});
    this.subject = null;
    this.handled = null;
};

Board.prototype.render = function () {
    this.statusLine = document.createElement('div');
    this.statusLine.setAttribute('class', 'status-line');
    this.statusText = document.createTextNode('');
    this.statusLine.appendChild(this.statusText);
    this.dialogText = document.createTextNode('');
    this.dialog.appendChild(this.dialogText);
    this.el.appendChild(this.statusLine);
    this.el.appendChild(this.verbsDesk.render().el);
    this.el.appendChild(this.inventory);
    return this;    
};

module.exports = new Board();