var VerbsDesk = require('./verbsdesk');

function Board() {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'board');
    this.verbsDesk = new VerbsDesk();
}

Board.prototype.render = function () {
    this.statusLine = document.createElement('div');
    this.statusLine.setAttribute('class', 'status-line');
    this.el.appendChild(this.statusLine);
    this.el.appendChild(this.verbsDesk.render().el);
    return this;    
};

module.exports = new Board();