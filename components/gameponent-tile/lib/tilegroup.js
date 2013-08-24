var Tile = require('./tile');

function TileGroup(options) {
    this.image = options.image;
    this.tiles = options.tiles;
}

TileGroup.prototype.load = function() {
    var tiles = [];

    this.tiles.forEach(function (tile) {
        tile.image = this.image;

        tiles.push(new Tile(tile));
    }, this);

    this.tiles = tiles;
};

TileGroup.prototype.tile = function (options) {
    options = options || {};
    var index = options.index || 0;

    return this.tiles[index];
};

module.exports = TileGroup;