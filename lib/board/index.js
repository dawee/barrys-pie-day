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
    if (!!this.notifyId) {
        clearTimeout(this.notifyId);
    }
    var dialogText = this.dialogText;
    dialogText.data = options.text;
    this.notifyId = setTimeout(function () {
        dialogText.data = '';
    }, 2000);
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
    this.reset({mode: this.mode});
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