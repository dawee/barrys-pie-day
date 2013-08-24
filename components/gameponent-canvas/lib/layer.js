function Layer(options) {
    this.views = [];
}

Layer.prototype.addView = function (options) {
    this.views.push(options.view);
};

Layer.prototype.draw = function (options) {
    var canvas = options.canvas;
    
    this.views.forEach(function (view) {
        view.draw(options);
    });
};

module.exports = Layer;