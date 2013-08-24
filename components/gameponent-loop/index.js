var ModeStack = require('./lib/modestack');
var modeStack = new ModeStack();

var animationFrame = (function(){
    var fallback = function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    return window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || fallback;
})();

function _drawLoop() {
    modeStack.draw();
    animationFrame(_drawLoop);
}

function _updateLoop(periodMS) {
    modeStack.update();
    setTimeout(_updateLoop, periodMS);
}

exports.start = function (options) {
    options = options || {};
    var fps = options.fps || 30;
    var periodMS = 1000.0 / fps;
    var mouseArea = options.mouseArea || null;

    modeStack.setMouseArea({mouseArea: mouseArea});
    _drawLoop();
    _updateLoop(periodMS);
};

exports.setMode = function (options) {
    modeStack.set(options) 
};

exports.pushMode = function (options) {
    modeStack.push(options) 
};

exports.popMode = function (options) {
    modeStack.pop(options);
};
