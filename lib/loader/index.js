var loader = {};

loader.load = function (options) {
    loader.callback = options.callback;
    loader.tilesets = options.tilesets;
    loader.keys = Object.keys(options.tilesets);
    loader.index = 0;
    loader.loadNext();
};

loader.loadNext = function () {
    loader.tilesets[loader.keys[loader.index]].load({success: loader.onTileSetLoaded});
};

loader.onTileSetLoaded = function () {
    loader.index++;
    if (loader.index < loader.keys.length) {
        loader.loadNext();
    } else {
        loader.callback();
    }
};


module.exports = loader;