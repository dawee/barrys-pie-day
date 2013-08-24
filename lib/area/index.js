var geom = require('geom');

function Area(options) {
    this.screen = options.screen;
    this.clickAreas = options.click || [];
}

Area.prototype.onMouseDown = function (options) {
    var point = new geom.Point({
        x: (options.offsetX * this.screen.viewport.width) / this.screen.width,
        y: this.screen.viewport.height - ((options.offsetY * this.screen.viewport.height) / this.screen.height)
    });
    
    this.clickAreas.forEach(function (area) {
        if (area.contains({point: point})) {
            area.callback();
        }
    });
};

Area.define = function (options) {
    var rect = new geom.Rect(options);
    rect.callback = options.callback;
    return rect;
};

module.exports = Area;