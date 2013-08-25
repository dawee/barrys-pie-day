var geom = require('geom');

Area.Rect = geom.Rect;

function Area(options) {
    this.screen = options.screen;
    this.areas = options.areas || [];
}

Area.prototype.getPoint = function (options) {
    var x = options.offsetX === undefined ? options.layerX : options.offsetX;
    var y = options.offsetY === undefined ? options.layerY : options.offsetY;

    return new geom.Point({
        x: (x * this.screen.viewport.width) / this.screen.width,
        y: this.screen.viewport.height - ((y * this.screen.viewport.height) / this.screen.height)
    });
};

Area.prototype.onMouseMove = function (options) {
    var point = this.getPoint(options);

    this.areas.forEach(function (area) {
        if (area.contains({point: point}) && typeof area.hover === 'function') {
            area.hover();
        }
    });
};

Area.prototype.onMouseDown = function (options) {
    var point = this.getPoint(options);
    
    this.areas.forEach(function (area) {
        if (area.contains({point: point}) && typeof area.click === 'function') {
            area.click();
        }
    });
};

Area.define = function (options) {
    var rect = new geom.Rect(options);
    rect.click = options.click;
    rect.hover = options.hover;
    return rect;
};

module.exports = Area;