var VerbsDesk = require('./verbsdesk');

function Board() {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'board');
    this.dialog = document.createElement('div');
    this.dialog.setAttribute('class', 'dialog');
    this.verbsDesk = new VerbsDesk({board: this});
    this.verb = null;
    this.subject = null;
    this.mode = null;
}

Board.prototype.notify = function (options) {
    var callback = options.callback || function () {};
    var dialogText = this.dialogText;
    var talker = options.talker || '';
    var delay = (options.text.split(' ').length) * 500;
    delay = delay < 2000 ? 2000 : delay;
    this.dialog.setAttribute('class', 'dialog ' + talker);
    dialogText.data = options.text;
    this.notifyId = setTimeout(function () {
        dialogText.data = '';
        callback();
    }, delay);
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
    this.setStatus({status: this.verb.name});
};

Board.prototype.setSubject = function (subject) {
    this.subject = subject;
    if (typeof subject.name === 'string') {
        this.setStatus({status: this.verb.name + ' ' + this.subject.name.toUpperCase()});
    } else {
        this.setStatus({status: this.verb.name});
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
    return this;    
};

module.exports = new Board();