function Tile(options) {
    this.image = options.image;
    this.x = options.x;
    this.y = options.y;
    this.width = options.width;
    this.height = options.height;
}

Tile.prototype.draw = function(options) {
    var reals = options.reals;
    var canvas = options.canvas;

    canvas.ctx.drawImage(
        this.image,
        this.x, this.y, this.width, this.height,
        reals.x, reals.y, reals.width, reals.height
    );
};

module.exports = Tile;