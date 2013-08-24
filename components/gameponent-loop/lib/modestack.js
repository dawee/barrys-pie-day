var EventHandler = require('./eventhandler');

function ModeStack(options) {
    options = options || {};
    this.mode = null;
    this.stack = [];
    this.eventHandler = new EventHandler();
}

ModeStack.prototype.setMouseArea = function (options) {
    this.eventHandler.setMouseArea(options);
};

ModeStack.prototype.set = function (options) {
    this.mode = options.mode;
    this.eventHandler.setListener({listener: this.mode});
};

ModeStack.prototype.push = function (options) {
    this.stack.push(this.mode);
    this.set(options.mode);
};

ModeStack.prototype.pop = function (options) {
    this.set(this.stack.pop());
};

ModeStack.prototype.update = function () {
    if (this.mode !== null && typeof this.mode.update === 'function') {
        this.mode.update();
    }
};

ModeStack.prototype.draw = function () {
    if (this.mode !== null && typeof this.mode.draw === 'function') {
        this.mode.draw();
    }
};

module.exports = ModeStack;
