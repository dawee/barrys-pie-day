var verbs = [
    'GET', 'TAKE', 'USE',
    'GO TO', 'LOOK AT', 'TALK'
];

function VerbsDesk() {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'verbs-desk');
}

VerbsDesk.prototype.render = function () {
    verbs.forEach(function (verb) {
        var el = document.createElement('div');
        el.setAttribute('class', 'verb');
        el.appendChild(document.createTextNode(verb));
        this.el.appendChild(el);
    }, this);
    return this;
};

module.exports = VerbsDesk;