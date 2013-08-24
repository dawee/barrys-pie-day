function Drawable(options) {
    options = options || {};
    this.el = options.el || document.createElement('img');
    this.width = this.el.width;
    this.height = this.el.height;
}

Drawable.prototype.draw = function (options) {
    var reals = options.reals;
    var canvas = options.canvas;

    canvas.ctx.drawImage(this.el, reals.x, reals.y, reals.width, reals.height);
};

module.exports = Drawable;