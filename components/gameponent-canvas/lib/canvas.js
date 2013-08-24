var LayerGroup = require('./layergroup');

function Canvas(options) {
    options = options || {};
    this.bg = options.bg || 'black';
    this.id = options.id || 'gameponent-canvas';
    this.width = options.width || 600;
    this.height = options.height || parseInt(this.width * 2.0 / 3, 10);
    this.viewport = options.viewport || {width: this.width, height: this.height};
    this.parent = options.parent || document.body;
    this.el = document.createElement('canvas');
    this.el.setAttribute('id', this.id);
    this.el.setAttribute('style', 'width:' + this.width + 'px;height;' + this.height + 'px');
    this.parent.appendChild(this.el);
    this.ctx = this.el.getContext('2d');
    this.ctx.canvas.width = this.width;
    this.ctx.canvas.height = this.height;
    this.root = options.root || new LayerGroup();
}

Canvas.prototype.draw = function () {
    this.ctx.fillStyle = this.bg;
    this.ctx.fillRect(0, 0, this.width, this.height);
    this.root.draw({canvas: this});
};

module.exports = Canvas;