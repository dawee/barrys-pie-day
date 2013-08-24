function LayerGroup(options) {
    this.layers = [];
}

LayerGroup.prototype.addLayer = function (options) {
    this.layers.push(options.layer);
};

LayerGroup.prototype.draw = function (options) {
    var canvas = options.canvas;
    
    this.layers.forEach(function (layer) {
        layer.draw(options);
    });
};

module.exports = LayerGroup;