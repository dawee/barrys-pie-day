var TileGroup = require('./tilegroup');

function TileSet(options) {
    this.url = options.url;
    this.groups = options.groups;
    this.image = new Image();
}

TileSet.prototype.load = function (options) {
    options = options || {};
    var noop = function () {};
    var success = options.success || noop;
    var error = options.error || noop;
    var that = this;

    this.image.addEventListener('load', function () {
        that.loadGroups();
        success({tileset: that});
    });

    this.image.setAttribute('src', this.url);
};

TileSet.prototype.loadGroups = function () {
    var groups = {};

    this.groups.forEach(function (group) {
        group.image = this.image;

        groups[group.name] = new TileGroup(group);
        groups[group.name].load();
    }, this);

    this.groups = groups;
};

TileSet.prototype.group = function (options) {
    var group = options.group;

    return this.groups[group];
};

module.exports = TileSet;