var getFile = require('get-file');
var TileSet = require('./lib/tileset');

exports.load = function (options) {
    var url = options.url;
    var noop = function () {};
    var success = options.success || noop;
    var error = options.error || noop;

    getFile(url + '/tilesets.json', function (error, rawData) {
        var data = JSON.parse(rawData);
        var tilesets = {};
        var name;

        data.tilesets.forEach(function (tileset) {
            var options = tileset;
            options.url = url + '/' + tileset.name + '.png';

            tilesets[tileset.name] = new TileSet(options);
        });

        success({tilesets: tilesets});
    });
}