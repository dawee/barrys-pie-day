function EventHandler(options) {
    var that = this;
    this.listener = {};

    document.addEventListener('keydown', function (event) {
        that.onKeyDown(event)
    });

    document.addEventListener('keyup', function (event) {
        that.onKeyUp(event)
    });
}

EventHandler.prototype.setListener = function (options) {
    this.listener = options.listener;
};

EventHandler.prototype.setMouseArea = function (options) {
    var that = this;
    this.mouseArea = options.mouseArea;

    if (this.mouseArea !== null) {
        this.mouseArea.addEventListener('click', function (event) {
            that.onClick(event);
        });

        this.mouseArea.addEventListener('mousemove', function (event) {
            that.onMouseMove(event);
        });

        this.mouseArea.addEventListener('mousedown', function (event) {
            that.onMouseDown(event);
        });

        this.mouseArea.addEventListener('mouseup', function (event) {
            that.onMouseUp(event);
        });
    }
};

EventHandler.prototype.onMouseUp = function (event) {
    if (typeof this.listener.onMouseUp === 'function') {
        this.listener.onMouseUp(event);
    }
};

EventHandler.prototype.onMouseDown = function (event) {
    if (typeof this.listener.onMouseDown === 'function') {
        this.listener.onMouseDown(event);
    }
};

EventHandler.prototype.onMouseMove = function (event) {
    if (typeof this.listener.onMouseMove === 'function') {
        this.listener.onMouseMove(event);
    }
};

EventHandler.prototype.onClick = function (event) {
    if (typeof this.listener.onClick === 'function') {
        this.listener.onClick(event);
    }
};

EventHandler.prototype.onKeyDown = function (event) {
    if (typeof this.listener.onKeyDown === 'function') {
        this.listener.onKeyDown(event);
    }
};

EventHandler.prototype.onKeyUp = function (event) {
    if (typeof this.listener.onKeyUp === 'function') {
        this.listener.onKeyUp(event);
    }
};


module.exports = EventHandler;