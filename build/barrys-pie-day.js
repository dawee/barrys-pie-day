
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("gameponent-canvas/index.js", Function("exports, require, module",
"exports.Canvas = require('./lib/canvas');\n\
exports.Layer = require('./lib/layer');\n\
exports.LayerGroup = require('./lib/layergroup');\n\
exports.ImageView = require('./lib/imageview');\n\
exports.Drawable = require('./lib/drawable');\n\
//@ sourceURL=gameponent-canvas/index.js"
));
require.register("gameponent-canvas/lib/canvas.js", Function("exports, require, module",
"var LayerGroup = require('./layergroup');\n\
\n\
function Canvas(options) {\n\
    options = options || {};\n\
    this.bg = options.bg || 'black';\n\
    this.id = options.id || 'gameponent-canvas';\n\
    this.width = options.width || 600;\n\
    this.height = options.height || parseInt(this.width * 2.0 / 3, 10);\n\
    this.viewport = options.viewport || {width: this.width, height: this.height};\n\
    this.parent = options.parent || document.body;\n\
    this.el = document.createElement('canvas');\n\
    this.el.setAttribute('id', this.id);\n\
    this.el.setAttribute('style', 'width:' + this.width + 'px;height;' + this.height + 'px');\n\
    this.parent.appendChild(this.el);\n\
    this.ctx = this.el.getContext('2d');\n\
    this.ctx.canvas.width = this.width;\n\
    this.ctx.canvas.height = this.height;\n\
    this.root = options.root || new LayerGroup();\n\
}\n\
\n\
Canvas.prototype.draw = function () {\n\
    this.ctx.fillStyle = this.bg;\n\
    this.ctx.fillRect(0, 0, this.width, this.height);\n\
    this.root.draw({canvas: this});\n\
};\n\
\n\
module.exports = Canvas;//@ sourceURL=gameponent-canvas/lib/canvas.js"
));
require.register("gameponent-canvas/lib/layer.js", Function("exports, require, module",
"function Layer(options) {\n\
    this.views = [];\n\
}\n\
\n\
Layer.prototype.addView = function (options) {\n\
    this.views.push(options.view);\n\
};\n\
\n\
Layer.prototype.draw = function (options) {\n\
    var canvas = options.canvas;\n\
    \n\
    this.views.forEach(function (view) {\n\
        view.draw(options);\n\
    });\n\
};\n\
\n\
module.exports = Layer;//@ sourceURL=gameponent-canvas/lib/layer.js"
));
require.register("gameponent-canvas/lib/layergroup.js", Function("exports, require, module",
"function LayerGroup(options) {\n\
    this.layers = [];\n\
}\n\
\n\
LayerGroup.prototype.addLayer = function (options) {\n\
    this.layers.push(options.layer);\n\
};\n\
\n\
LayerGroup.prototype.draw = function (options) {\n\
    var canvas = options.canvas;\n\
    \n\
    this.layers.forEach(function (layer) {\n\
        layer.draw(options);\n\
    });\n\
};\n\
\n\
module.exports = LayerGroup;//@ sourceURL=gameponent-canvas/lib/layergroup.js"
));
require.register("gameponent-canvas/lib/imageview.js", Function("exports, require, module",
"var Drawable = require('./drawable');\n\
\n\
function ImageLayer(options) {\n\
    options = options || {};\n\
    this.image = null;\n\
    var image = options.image || null;\n\
    if (image !== null) {\n\
        this.setImage({image: image});\n\
    }\n\
    this.width = options.width || this.image.width || 0;\n\
    this.height = options.height || this.image.height || 0;\n\
    this.x = options.x || 0;\n\
    this.y = options.y || 0;\n\
    this._calculationRequired = true;\n\
}\n\
\n\
function _calcReal(imageLayer, canvas) {\n\
    var viewport = canvas.viewport;\n\
    var leftX = imageLayer.x - imageLayer.width / 2;\n\
    var topY = imageLayer.y + imageLayer.height / 2;\n\
    var topReversedY = viewport.height - topY;\n\
\n\
    imageLayer.reals = {\n\
        y: (topReversedY * canvas.height) / viewport.height,\n\
        x: (leftX * canvas.width) / viewport.width,\n\
        width: (imageLayer.width * canvas.width) / viewport.width,\n\
        height: (imageLayer.height * canvas.height) / viewport.height\n\
    };\n\
}\n\
\n\
ImageLayer.prototype.setImage = function (options) {\n\
    var image = options.image;\n\
\n\
    if (image instanceof HTMLElement) {\n\
        this.image = new Drawable({el: image});\n\
    } else {\n\
        this.image = image;\n\
    }\n\
};\n\
\n\
ImageLayer.prototype.draw = function (options) {\n\
    var canvas = options.canvas;\n\
\n\
    if (this._calculationRequired) {\n\
        _calcReal(this, canvas);\n\
        this._calculationRequired = false;\n\
    }\n\
\n\
    this.image.draw({reals: this.reals, canvas: canvas});\n\
};\n\
\n\
ImageLayer.prototype.setGeometry = function (options) {\n\
    this.x = options.x || this.x;\n\
    this.y = options.y || this.y;\n\
    this.width = options.width || this.width;\n\
    this.height = options.height || this.height;\n\
\n\
    this._calculationRequired = true;\n\
};\n\
\n\
module.exports = ImageLayer;//@ sourceURL=gameponent-canvas/lib/imageview.js"
));
require.register("gameponent-canvas/lib/drawable.js", Function("exports, require, module",
"function Drawable(options) {\n\
    options = options || {};\n\
    this.el = options.el || document.createElement('img');\n\
    this.width = this.el.width;\n\
    this.height = this.el.height;\n\
}\n\
\n\
Drawable.prototype.draw = function (options) {\n\
    var reals = options.reals;\n\
    var canvas = options.canvas;\n\
\n\
    canvas.ctx.drawImage(this.el, reals.x, reals.y, reals.width, reals.height);\n\
};\n\
\n\
module.exports = Drawable;//@ sourceURL=gameponent-canvas/lib/drawable.js"
));
require.register("jofan-get-file/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Expose `getFile`.\n\
 */\n\
\n\
module.exports = getFile;\n\
\n\
/**\n\
 * Get the supported XHR object in current browser\n\
 *\n\
 * @return {object}\n\
 * @api private\n\
 */\n\
function getXHR() {\n\
  if (window.XMLHttpRequest) { return new XMLHttpRequest; } \n\
  else {\n\
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}\n\
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}\n\
  }\n\
  return false;\n\
}\n\
\n\
/**\n\
 * Get file using file:// (local) or http:// (server)\n\
 *\n\
 * @param {String} path\n\
 * @api public\n\
 */\n\
function getFile(path, callback) {\n\
\n\
  // TODO: Make sure no remote files are requested\n\
  // var isRemote = /^([\\w-]+:)?\\/\\/([^\\/]+)/.test(path) && RegExp.$2 != window.location.host,\n\
  \n\
  var xhr = getXHR();\n\
\n\
  if (xhr) {\n\
\n\
    xhr.open('GET', path, false);\n\
\n\
    xhr.onreadystatechange = function() {\n\
      if (xhr.readyState === 4) {\n\
        xhr.onreadystatechange = function() {};\n\
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && window.location.protocol == 'file:')) {\n\
          callback(null, xhr.responseText);\n\
        }\n\
        else {\n\
          if (xhr.status === 400) {\n\
            callback({error: 'Could not locate file'}, null);\n\
          }\n\
          else {\n\
            callback({error: xhr.status}, null);\n\
          }\n\
        }\n\
      }\n\
    }\n\
\n\
    xhr.send(null);\n\
\n\
  }\n\
  else {\n\
    throw new Error('XMLHttpRequest or ActiveXObject is not available. Cannot get file.')\n\
  }\n\
\n\
}//@ sourceURL=jofan-get-file/index.js"
));
require.register("gameponent-tile/index.js", Function("exports, require, module",
"var getFile = require('get-file');\n\
var TileSet = require('./lib/tileset');\n\
\n\
exports.load = function (options) {\n\
    var url = options.url;\n\
    var noop = function () {};\n\
    var success = options.success || noop;\n\
    var error = options.error || noop;\n\
\n\
    getFile(url + '/tilesets.json', function (error, rawData) {\n\
        var data = JSON.parse(rawData);\n\
        var tilesets = {};\n\
        var name;\n\
\n\
        data.tilesets.forEach(function (tileset) {\n\
            var options = tileset;\n\
            options.url = url + '/' + tileset.name + '.png';\n\
\n\
            tilesets[tileset.name] = new TileSet(options);\n\
        });\n\
\n\
        success({tilesets: tilesets});\n\
    });\n\
}//@ sourceURL=gameponent-tile/index.js"
));
require.register("gameponent-tile/lib/tileset.js", Function("exports, require, module",
"var TileGroup = require('./tilegroup');\n\
\n\
function TileSet(options) {\n\
    this.url = options.url;\n\
    this.groups = options.groups;\n\
    this.image = new Image();\n\
}\n\
\n\
TileSet.prototype.load = function (options) {\n\
    options = options || {};\n\
    var noop = function () {};\n\
    var success = options.success || noop;\n\
    var error = options.error || noop;\n\
    var that = this;\n\
\n\
    this.image.addEventListener('load', function () {\n\
        that.loadGroups();\n\
        success({tileset: that});\n\
    });\n\
\n\
    this.image.setAttribute('src', this.url);\n\
};\n\
\n\
TileSet.prototype.loadGroups = function () {\n\
    var groups = {};\n\
\n\
    this.groups.forEach(function (group) {\n\
        group.image = this.image;\n\
\n\
        groups[group.name] = new TileGroup(group);\n\
        groups[group.name].load();\n\
    }, this);\n\
\n\
    this.groups = groups;\n\
};\n\
\n\
TileSet.prototype.group = function (options) {\n\
    var group = options.group;\n\
\n\
    return this.groups[group];\n\
};\n\
\n\
module.exports = TileSet;//@ sourceURL=gameponent-tile/lib/tileset.js"
));
require.register("gameponent-tile/lib/tile.js", Function("exports, require, module",
"function Tile(options) {\n\
    this.image = options.image;\n\
    this.x = options.x;\n\
    this.y = options.y;\n\
    this.width = options.width;\n\
    this.height = options.height;\n\
}\n\
\n\
Tile.prototype.draw = function(options) {\n\
    var reals = options.reals;\n\
    var canvas = options.canvas;\n\
\n\
    canvas.ctx.drawImage(\n\
        this.image,\n\
        this.x, this.y, this.width, this.height,\n\
        reals.x, reals.y, reals.width, reals.height\n\
    );\n\
};\n\
\n\
module.exports = Tile;//@ sourceURL=gameponent-tile/lib/tile.js"
));
require.register("gameponent-tile/lib/tilegroup.js", Function("exports, require, module",
"var Tile = require('./tile');\n\
\n\
function TileGroup(options) {\n\
    this.image = options.image;\n\
    this.tiles = options.tiles;\n\
}\n\
\n\
TileGroup.prototype.load = function() {\n\
    var tiles = [];\n\
\n\
    this.tiles.forEach(function (tile) {\n\
        tile.image = this.image;\n\
\n\
        tiles.push(new Tile(tile));\n\
    }, this);\n\
\n\
    this.tiles = tiles;\n\
};\n\
\n\
TileGroup.prototype.tile = function (options) {\n\
    options = options || {};\n\
    var index = options.index || 0;\n\
\n\
    return this.tiles[index];\n\
};\n\
\n\
module.exports = TileGroup;//@ sourceURL=gameponent-tile/lib/tilegroup.js"
));
require.register("component-type/index.js", Function("exports, require, module",
"\n\
/**\n\
 * toString ref.\n\
 */\n\
\n\
var toString = Object.prototype.toString;\n\
\n\
/**\n\
 * Return the type of `val`.\n\
 *\n\
 * @param {Mixed} val\n\
 * @return {String}\n\
 * @api public\n\
 */\n\
\n\
module.exports = function(val){\n\
  switch (toString.call(val)) {\n\
    case '[object Function]': return 'function';\n\
    case '[object Date]': return 'date';\n\
    case '[object RegExp]': return 'regexp';\n\
    case '[object Arguments]': return 'arguments';\n\
    case '[object Array]': return 'array';\n\
    case '[object String]': return 'string';\n\
  }\n\
\n\
  if (val === null) return 'null';\n\
  if (val === undefined) return 'undefined';\n\
  if (val && val.nodeType === 1) return 'element';\n\
  if (val === Object(val)) return 'object';\n\
\n\
  return typeof val;\n\
};\n\
//@ sourceURL=component-type/index.js"
));
require.register("component-clone/index.js", Function("exports, require, module",
"\n\
/**\n\
 * Module dependencies.\n\
 */\n\
\n\
var type;\n\
\n\
try {\n\
  type = require('type');\n\
} catch(e){\n\
  type = require('type-component');\n\
}\n\
\n\
/**\n\
 * Module exports.\n\
 */\n\
\n\
module.exports = clone;\n\
\n\
/**\n\
 * Clones objects.\n\
 *\n\
 * @param {Mixed} any object\n\
 * @api public\n\
 */\n\
\n\
function clone(obj){\n\
  switch (type(obj)) {\n\
    case 'object':\n\
      var copy = {};\n\
      for (var key in obj) {\n\
        if (obj.hasOwnProperty(key)) {\n\
          copy[key] = clone(obj[key]);\n\
        }\n\
      }\n\
      return copy;\n\
\n\
    case 'array':\n\
      var copy = new Array(obj.length);\n\
      for (var i = 0, l = obj.length; i < l; i++) {\n\
        copy[i] = clone(obj[i]);\n\
      }\n\
      return copy;\n\
\n\
    case 'regexp':\n\
      // from millermedeiros/amd-utils - MIT\n\
      var flags = '';\n\
      flags += obj.multiline ? 'm' : '';\n\
      flags += obj.global ? 'g' : '';\n\
      flags += obj.ignoreCase ? 'i' : '';\n\
      return new RegExp(obj.source, flags);\n\
\n\
    case 'date':\n\
      return new Date(obj.getTime());\n\
\n\
    default: // string, number, boolean, …\n\
      return obj;\n\
  }\n\
}\n\
//@ sourceURL=component-clone/index.js"
));
require.register("gameponent-sprite/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
clone = require('clone');\n\
\n\
function Sprite(options) {\n\
    this.tileset = options.tileset;\n\
    this.setAnimation({animation: options.animation || Object.keys(this.tileset.groups)[0]});\n\
    options.image = this.image;\n\
    this.lastStep = null;\n\
    canvas.ImageView.apply(this, [options]);\n\
};\n\
\n\
Sprite.fps = 20;\n\
\n\
Sprite.prototype = clone(canvas.ImageView.prototype);\n\
\n\
Sprite.prototype.setAnimation = function (options) {\n\
    this.index = 0;\n\
    this.animation = this.tileset.group({group: options.animation});\n\
    this.fps = this.animation.fps || Sprite.fps;\n\
    this.periodMS = 1000.0 / this.fps;\n\
    this.image = this.animation.tile({index: this.index});\n\
};\n\
\n\
Sprite.prototype.loop = function (options) {\n\
    this.setAnimation(options);\n\
};\n\
\n\
Sprite.prototype.step = function () {\n\
    if (this.lastStep === null) {\n\
        this.lastStep = Date.now();\n\
    } else if (Date.now() - this.lastStep >= this.periodMS) {\n\
        this.index++;\n\
        if (this.index >= this.animation.tiles.length) {\n\
            this.index = 0;\n\
        }\n\
        this.image = this.animation.tile({index: this.index});\n\
        this.lastStep = Date.now();\n\
    }\n\
};\n\
\n\
exports.Sprite = Sprite;//@ sourceURL=gameponent-sprite/index.js"
));
require.register("gameponent-loop/index.js", Function("exports, require, module",
"var ModeStack = require('./lib/modestack');\n\
var modeStack = new ModeStack();\n\
\n\
var animationFrame = (function(){\n\
    var fallback = function (callback) {\n\
        window.setTimeout(callback, 1000 / 60);\n\
    };\n\
\n\
    return window.requestAnimationFrame\n\
        || window.webkitRequestAnimationFrame\n\
        || window.mozRequestAnimationFrame\n\
        || fallback;\n\
})();\n\
\n\
function _drawLoop() {\n\
    modeStack.draw();\n\
    animationFrame(_drawLoop);\n\
}\n\
\n\
function _updateLoop(periodMS) {\n\
    modeStack.update();\n\
    setTimeout(_updateLoop, periodMS);\n\
}\n\
\n\
exports.start = function (options) {\n\
    options = options || {};\n\
    var fps = options.fps || 30;\n\
    var periodMS = 1000.0 / fps;\n\
    var mouseArea = options.mouseArea || null;\n\
\n\
    modeStack.setMouseArea({mouseArea: mouseArea});\n\
    _drawLoop();\n\
    _updateLoop(periodMS);\n\
};\n\
\n\
exports.setMode = function (options) {\n\
    modeStack.set(options) \n\
};\n\
\n\
exports.pushMode = function (options) {\n\
    modeStack.push(options) \n\
};\n\
\n\
exports.popMode = function (options) {\n\
    modeStack.pop(options);\n\
};\n\
//@ sourceURL=gameponent-loop/index.js"
));
require.register("gameponent-loop/lib/modestack.js", Function("exports, require, module",
"var EventHandler = require('./eventhandler');\n\
\n\
function ModeStack(options) {\n\
    options = options || {};\n\
    this.mode = null;\n\
    this.stack = [];\n\
    this.eventHandler = new EventHandler();\n\
}\n\
\n\
ModeStack.prototype.setMouseArea = function (options) {\n\
    this.eventHandler.setMouseArea(options);\n\
};\n\
\n\
ModeStack.prototype.set = function (options) {\n\
    this.mode = options.mode;\n\
    this.eventHandler.setListener({listener: this.mode});\n\
    if (this.mode !== null && typeof this.mode.reset === 'function') {\n\
        this.mode.reset();\n\
    }\n\
};\n\
\n\
ModeStack.prototype.push = function (options) {\n\
    this.stack.push(this.mode);\n\
    this.set(options.mode);\n\
};\n\
\n\
ModeStack.prototype.pop = function (options) {\n\
    this.set(this.stack.pop());\n\
};\n\
\n\
ModeStack.prototype.update = function () {\n\
    if (this.mode !== null && typeof this.mode.update === 'function') {\n\
        this.mode.update();\n\
    }\n\
};\n\
\n\
ModeStack.prototype.draw = function () {\n\
    if (this.mode !== null && typeof this.mode.draw === 'function') {\n\
        this.mode.draw();\n\
    }\n\
};\n\
\n\
module.exports = ModeStack;\n\
//@ sourceURL=gameponent-loop/lib/modestack.js"
));
require.register("gameponent-loop/lib/eventhandler.js", Function("exports, require, module",
"function EventHandler(options) {\n\
    var that = this;\n\
    this.listener = {};\n\
\n\
    document.addEventListener('keydown', function (event) {\n\
        that.onKeyDown(event)\n\
    });\n\
\n\
    document.addEventListener('keyup', function (event) {\n\
        that.onKeyUp(event)\n\
    });\n\
}\n\
\n\
EventHandler.prototype.setListener = function (options) {\n\
    this.listener = options.listener;\n\
};\n\
\n\
EventHandler.prototype.setMouseArea = function (options) {\n\
    var that = this;\n\
    this.mouseArea = options.mouseArea;\n\
\n\
    if (this.mouseArea !== null) {\n\
        this.mouseArea.addEventListener('click', function (event) {\n\
            that.onClick(event);\n\
        });\n\
\n\
        this.mouseArea.addEventListener('mousemove', function (event) {\n\
            that.onMouseMove(event);\n\
        });\n\
\n\
        this.mouseArea.addEventListener('mousedown', function (event) {\n\
            that.onMouseDown(event);\n\
        });\n\
\n\
        this.mouseArea.addEventListener('mouseup', function (event) {\n\
            that.onMouseUp(event);\n\
        });\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onMouseUp = function (event) {\n\
    if (typeof this.listener.onMouseUp === 'function') {\n\
        this.listener.onMouseUp(event);\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onMouseDown = function (event) {\n\
    if (typeof this.listener.onMouseDown === 'function') {\n\
        this.listener.onMouseDown(event);\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onMouseMove = function (event) {\n\
    if (typeof this.listener.onMouseMove === 'function') {\n\
        this.listener.onMouseMove(event);\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onClick = function (event) {\n\
    if (typeof this.listener.onClick === 'function') {\n\
        this.listener.onClick(event);\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onKeyDown = function (event) {\n\
    if (typeof this.listener.onKeyDown === 'function') {\n\
        this.listener.onKeyDown(event);\n\
    }\n\
};\n\
\n\
EventHandler.prototype.onKeyUp = function (event) {\n\
    if (typeof this.listener.onKeyUp === 'function') {\n\
        this.listener.onKeyUp(event);\n\
    }\n\
};\n\
\n\
\n\
module.exports = EventHandler;//@ sourceURL=gameponent-loop/lib/eventhandler.js"
));
require.register("loader/index.js", Function("exports, require, module",
"var loader = {};\n\
\n\
loader.load = function (options) {\n\
    loader.callback = options.callback;\n\
    loader.tilesets = options.tilesets;\n\
    loader.keys = Object.keys(options.tilesets);\n\
    loader.index = 0;\n\
    loader.loadNext();\n\
};\n\
\n\
loader.loadNext = function () {\n\
    loader.tilesets[loader.keys[loader.index]].load({success: loader.onTileSetLoaded});\n\
};\n\
\n\
loader.onTileSetLoaded = function () {\n\
    loader.index++;\n\
    if (loader.index < loader.keys.length) {\n\
        loader.loadNext();\n\
    } else {\n\
        loader.callback();\n\
    }\n\
};\n\
\n\
\n\
module.exports = loader;//@ sourceURL=loader/index.js"
));
require.register("barry/index.js", Function("exports, require, module",
"var sprite = require('sprite');\n\
var clone = require('clone');\n\
\n\
function Barry(options) {\n\
    this.screen = options.screen;\n\
    options.tileset = options.tilesets.barry;\n\
    options.animation = 'stand';\n\
    this.target = null;\n\
    this.direction = null;\n\
\n\
    sprite.Sprite.apply(this, [options]);\n\
}\n\
\n\
Barry.prototype = clone(sprite.Sprite.prototype);\n\
\n\
function _walk(barry) {\n\
    var reached = false;\n\
\n\
    if (barry.target !== null) {\n\
        if (barry.direction === 1) {\n\
            barry.setGeometry({x: barry.x + 1});\n\
            reached = (barry.x >= barry.target);\n\
        } else {\n\
            barry.setGeometry({x: barry.x - 1});\n\
            reached = (barry.x <= barry.target);\n\
        }\n\
    }\n\
\n\
    if (reached === true) {\n\
        barry.target = null;\n\
        barry.loop({animation: 'stand'});\n\
        barry.walkCallback();\n\
    }\n\
}\n\
\n\
Barry.prototype.walkTo = function (options) {\n\
    var x = options.offsetX === undefined ? options.layerX : options.offsetX;\n\
    var target = (x * this.screen.viewport.width) / this.screen.width;\n\
\n\
    if (!!options.name) {\n\
        var target = options.x;\n\
    }\n\
\n\
    if (target !== this.x) {\n\
        this.target = target;\n\
        this.walkCallback = options.walkCallback || function () {};\n\
        this.direction = (this.target > this.x) ? 1 : -1;\n\
\n\
        if (this.target > this.x) {\n\
            this.loop({animation: 'walk_right'});\n\
        } else {\n\
            this.loop({animation: 'walk_left'});\n\
        }\n\
    }\n\
    if (!!options.name) {\n\
        var length = Math.abs(options.x - this.x);\n\
        length -= options.width;\n\
        this.target = this.x + this.direction * length\n\
    }\n\
\n\
};\n\
\n\
Barry.prototype.step = function () {\n\
    _walk(this);\n\
    sprite.Sprite.prototype.step.apply(this);\n\
}\n\
\n\
module.exports = Barry;//@ sourceURL=barry/index.js"
));
require.register("gameponent-geom/index.js", Function("exports, require, module",
"exports.Vector = require('./lib/vector');\n\
exports.Point = require('./lib/point');\n\
exports.Rect = require('./lib/rect');\n\
//@ sourceURL=gameponent-geom/index.js"
));
require.register("gameponent-geom/lib/point.js", Function("exports, require, module",
"var Vector = require('./vector');\n\
\n\
function Point (options) {\n\
    options = options || {};\n\
    this.x = options.x || 0;\n\
    this.y = options.y || 0;\n\
};\n\
\n\
Point.prototype.translate = function (options) {\n\
    if (options.vector instanceof Vector) {\n\
        _translateByVector(this, options.vector);\n\
    } else {\n\
        _translateByValues(this, options.tx || 0, options.ty || 0);\n\
    }\n\
    return this;\n\
};\n\
\n\
function _translateByVector(point, vector) {\n\
    point.x += vector.dx;\n\
    point.y += vector.dy;\n\
};\n\
\n\
function _translateByValues(point, tx, ty) {\n\
    point.x += tx;\n\
    point.y += ty;\n\
};\n\
\n\
module.exports = Point;//@ sourceURL=gameponent-geom/lib/point.js"
));
require.register("gameponent-geom/lib/vector.js", Function("exports, require, module",
"function Vector(dx, dy) {\n\
    this.dx = dx || 0;\n\
    this.dy = dy || 0;\n\
}\n\
\n\
Vector.prototype.getLength = function () {\n\
    Math.sqrt(Math.pow(this.dx) + Math.pow(this.dy));\n\
};\n\
\n\
module.exports = Vector;//@ sourceURL=gameponent-geom/lib/vector.js"
));
require.register("gameponent-geom/lib/rect.js", Function("exports, require, module",
"var Point = require('./point');\n\
\n\
function _containsRect(rect, other) {\n\
    return (rect.left <= other.left) && (rect.top >= other.top)\n\
        && (rect.left + rect.width >= other.left + other.width)\n\
        && (rect.top - rect.height <= other.top - other.height)\n\
        && (rect.left + rect.width > other.left)\n\
        && (rect.top - rect.height < other.top);\n\
};\n\
\n\
function _containsPoint(rect, other) {\n\
    return (rect.left <= other.x)\n\
        && (rect.top >= other.y)\n\
        && (rect.left + rect.width >= other.x)\n\
        && (rect.top - rect.height <= other.y);\n\
};\n\
\n\
function Rect(options) {\n\
    options = options || {};\n\
    this.left = options.left || 0;\n\
    this.top = options.top || 0;\n\
    this.width = options.width || 0;\n\
    this.height = options.height || 0;\n\
}\n\
\n\
Rect.prototype.right = function () {\n\
    return this.left + this.height;\n\
};\n\
\n\
Rect.prototype.bottom = function () {\n\
    return this.top - this.height;\n\
};\n\
\n\
Rect.prototype.contains = function (options) {\n\
    var result = false;\n\
    \n\
    if (options.rect instanceof Rect) {\n\
        result = _containsRect(this, options.rect);\n\
    } else {\n\
        result = _containsPoint(this, options.point);\n\
    }\n\
\n\
    return result;\n\
};\n\
\n\
Rect.prototype.intersectTop = function (options) {\n\
    var other = options.rect;\n\
\n\
    return (other.top > this.top && (\n\
        other.contains({point: this.topLeftPoint()})\n\
        || other.contains({point: this.topRightPoint()})\n\
        || this.contains({point: other.bottomLeftPoint()}) \n\
        || this.contains({point: other.bottomRightPoint()})\n\
    ));\n\
}\n\
\n\
Rect.prototype.intersectBottom = function (options) {\n\
    var other = options.rect;\n\
\n\
    return other.intersectTop({rect: this});\n\
}\n\
\n\
Rect.prototype.intersectLeft = function (options) {\n\
    var other = options.rect;\n\
\n\
    return (other.left < this.left && (\n\
        other.contains({point: this.topLeftPoint()})\n\
        || other.contains({point: this.bottomLeftPoint()})\n\
        || this.contains({point: other.topRightPoint()}) \n\
        || this.contains({point: other.bottomRightPoint()})\n\
    ));\n\
};\n\
\n\
Rect.prototype.intersectRight = function (options) {\n\
    var other = options.rect;\n\
\n\
    return other.intersectLeft({rect: this});\n\
};\n\
\n\
Rect.prototype.centerPoint = function () {\n\
    return new Point({x: this.left + this.width / 2, y: this.top - this.height / 2});\n\
};\n\
\n\
Rect.prototype.topLeftPoint = function () {\n\
    return new Point({x: this.left, y: this.top});\n\
};\n\
\n\
Rect.prototype.topRightPoint = function () {\n\
    return new Point({x: this.right(), y: this.top});\n\
};\n\
\n\
Rect.prototype.bottomLeftPoint = function () {\n\
    return new Point({x: this.left, y: this.bottom()});\n\
};\n\
\n\
Rect.prototype.bottomRightPoint = function () {\n\
    return new Point({x: this.right(), y: this.bottom()});\n\
};\n\
\n\
Rect.prototype.copy = function() {\n\
    return new Rect({left: this.left, top: this.top, width: this.width, height: this.height});\n\
};\n\
\n\
Rect.createCenteredHitbox = function (width, height) {\n\
    return new Rect(-width / 2, -height / 2, width, height);\n\
};\n\
\n\
module.exports = Rect;//@ sourceURL=gameponent-geom/lib/rect.js"
));
require.register("area/index.js", Function("exports, require, module",
"var geom = require('geom');\n\
\n\
Area.Rect = geom.Rect;\n\
\n\
function Area(options) {\n\
    this.screen = options.screen;\n\
    this.areas = options.areas || [];\n\
}\n\
\n\
Area.prototype.getPoint = function (options) {\n\
    var x = options.offsetX === undefined ? options.layerX : options.offsetX;\n\
    var y = options.offsetY === undefined ? options.layerY : options.offsetY;\n\
\n\
    return new geom.Point({\n\
        x: (x * this.screen.viewport.width) / this.screen.width,\n\
        y: this.screen.viewport.height - ((y * this.screen.viewport.height) / this.screen.height)\n\
    });\n\
};\n\
\n\
Area.prototype.onMouseMove = function (options) {\n\
    var point = this.getPoint(options);\n\
\n\
    this.areas.forEach(function (area) {\n\
        if (area.contains({point: point}) && typeof area.hover === 'function') {\n\
            area.hover();\n\
        }\n\
    });\n\
};\n\
\n\
Area.prototype.onMouseDown = function (options) {\n\
    var point = this.getPoint(options);\n\
    \n\
    this.areas.forEach(function (area) {\n\
        if (area.contains({point: point}) && typeof area.click === 'function') {\n\
            area.click();\n\
        }\n\
    });\n\
};\n\
\n\
Area.define = function (options) {\n\
    var rect = new geom.Rect(options);\n\
    rect.click = options.click;\n\
    rect.hover = options.hover;\n\
    return rect;\n\
};\n\
\n\
module.exports = Area;//@ sourceURL=area/index.js"
));
require.register("stadium/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
var JudgeWoman = require('./judgewoman');\n\
var JudgeGlass = require('./judgeglass');\n\
var JudgeYoung = require('./judgeyoung');\n\
var Area = require('area');\n\
\n\
function Stadium() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Stadium.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_b.groups.stadium.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({screen: this.screen, tilesets: this.tilesets, x: 150, y: 50});\n\
    this.judgeYoung = new JudgeYoung({screen: this.screen, tilesets: this.tilesets, x: 49, y: 100});\n\
    this.judgeGlass = new JudgeGlass({screen: this.screen, tilesets: this.tilesets, x: 40, y: 88});\n\
    this.judgeWoman = new JudgeWoman({screen: this.screen, tilesets: this.tilesets, x: 28, y: 66});\n\
\n\
    this.layer.addView({view: this.judgeYoung});\n\
    this.layer.addView({view: this.judgeGlass});\n\
    this.layer.addView({view: this.judgeWoman});\n\
\n\
    this.layer.addView({view: this.barry});\n\
\n\
    var town = Area.define({\n\
        left: this.screen.viewport.width * 7.0 / 8,\n\
        top: this.screen.viewport.height,\n\
        width: this.screen.viewport.width,\n\
        height: this.screen.viewport.height,\n\
        hover: function () {\n\
            board.setSubject(town);\n\
        },\n\
        click: function () {\n\
            this.x = this.left;\n\
            board.setSubject(town);\n\
            board.notify({text: 'I won\\'t go until I didn\\'t talk to the judges'});\n\
        },\n\
        go: function () {}\n\
    });\n\
    town.name = 'TOWN';\n\
\n\
    this.areas = new Area({screen: this.screen, areas: [\n\
        this.judgeWoman,\n\
        town\n\
    ]});\n\
    return this;\n\
};\n\
\n\
Stadium.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Stadium.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
\n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
    this.areas.onMouseDown(event);\n\
    board.activate();\n\
};\n\
\n\
Stadium.prototype.onMouseMove = function (event) {\n\
    board.setSubject(event);\n\
    this.areas.onMouseMove(event);\n\
};\n\
\n\
Stadium.prototype.update = function () {\n\
    this.barry.step();\n\
    this.judgeWoman.step();\n\
    this.judgeGlass.step();\n\
    this.judgeYoung.step();\n\
};\n\
\n\
Stadium.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Stadium();//@ sourceURL=stadium/index.js"
));
require.register("stadium/judgewoman.js", Function("exports, require, module",
"var sprite = require('sprite');\n\
var clone = require('clone');\n\
var Area = require('area');\n\
var board = require('board');\n\
\n\
function JudgeWoman(options) {\n\
    this.name = \"JUDGE WOMAN\";\n\
\n\
    this.screen = options.screen;\n\
    options.tileset = options.tilesets.judges;\n\
    options.animation = 'judge_woman_sit';\n\
    this.target = null;\n\
    this.direction = null;\n\
\n\
    sprite.Sprite.apply(this, [options]);\n\
    this.left = this.x - this.width / 2;\n\
    this.top = this.y + this.height / 2;\n\
    this.width = this.image.width;\n\
    this.height = this.image.height;\n\
}\n\
\n\
JudgeWoman.prototype = clone(sprite.Sprite.prototype);\n\
\n\
JudgeWoman.prototype.contains = Area.Rect.prototype.contains;\n\
\n\
JudgeWoman.prototype.hover = function () {\n\
    board.setSubject(this);\n\
};\n\
\n\
JudgeWoman.prototype.click = function () {\n\
    board.setSubject(this);\n\
};\n\
\n\
JudgeWoman.prototype.take = function () {\n\
    board.notify({text: 'She\\'s not my type'});\n\
};\n\
\n\
\n\
module.exports = JudgeWoman;//@ sourceURL=stadium/judgewoman.js"
));
require.register("stadium/judgeglass.js", Function("exports, require, module",
"var sprite = require('sprite');\n\
var clone = require('clone');\n\
\n\
function JudgeGlass(options) {\n\
    this.screen = options.screen;\n\
    options.tileset = options.tilesets.judges;\n\
    options.animation = 'judge_glass_sit';\n\
    this.target = null;\n\
    this.direction = null;\n\
\n\
    sprite.Sprite.apply(this, [options]);\n\
}\n\
\n\
JudgeGlass.prototype = clone(sprite.Sprite.prototype);\n\
\n\
module.exports = JudgeGlass;//@ sourceURL=stadium/judgeglass.js"
));
require.register("stadium/judgeyoung.js", Function("exports, require, module",
"var sprite = require('sprite');\n\
var clone = require('clone');\n\
\n\
function JudgeYoung(options) {\n\
    this.screen = options.screen;\n\
    options.tileset = options.tilesets.judges;\n\
    options.animation = 'judge_young_sit';\n\
    this.target = null;\n\
    this.direction = null;\n\
\n\
    sprite.Sprite.apply(this, [options]);\n\
}\n\
\n\
JudgeYoung.prototype = clone(sprite.Sprite.prototype);\n\
\n\
module.exports = JudgeYoung;//@ sourceURL=stadium/judgeyoung.js"
));
require.register("map/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Area = require('area');\n\
var loop = require('loop');\n\
var board = require('board');\n\
var places = {};\n\
\n\
var areas = {\n\
\n\
    stadium: Area.define({\n\
        left: 8,\n\
        top: 120,\n\
        width: 45,\n\
        height: 45,\n\
        click: function () {\n\
            loop.setMode({mode: places.stadium});\n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Stadium'});\n\
        }\n\
    }),\n\
\n\
    photograph: Area.define({\n\
        left: 52,\n\
        top: 128,\n\
        width: 40,\n\
        height: 22,\n\
        click: function () {\n\
            loop.setMode({mode: places.photograph});\n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Photograph'});\n\
        }\n\
    }),\n\
\n\
    lake: Area.define({\n\
        left: 269,\n\
        top: 110,\n\
        width: 40,\n\
        height: 30,\n\
        click: function () {\n\
            loop.setMode({mode: places.lake});    \n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Lake'});\n\
        }\n\
    }),\n\
\n\
    theater: Area.define({\n\
        left: 190,\n\
        top: 94,\n\
        width: 45,\n\
        height: 34,\n\
        click: function () {\n\
            loop.setMode({mode: places.theater});\n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Theater'});\n\
        }\n\
    }),\n\
\n\
    pizzeria: Area.define({\n\
        left: 44,\n\
        top: 53,\n\
        width: 36,\n\
        height: 21,\n\
        click: function () {\n\
            loop.setMode({mode: places.pizzeria});\n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Pizzeria'});\n\
        }\n\
    }),\n\
        \n\
    bakery: Area.define({\n\
        left: 112,\n\
        top: 30,\n\
        width: 36,\n\
        height: 33,\n\
        click: function () {\n\
            loop.setMode({mode: places.bakery});    \n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Bakery'});\n\
        }\n\
    }),\n\
\n\
    clockRepair: Area.define({\n\
        left: 100,\n\
        top: 108,\n\
        width: 32,\n\
        height: 27,\n\
        click: function () {\n\
            loop.setMode({mode: places.clockRepair});\n\
        },\n\
        hover: function () {\n\
            board.setSubject({name: 'Clock Repair'});\n\
        }\n\
    })\n\
\n\
};\n\
\n\
\n\
function Map() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Map.prototype.init = function (options) {\n\
    var that = this;\n\
\n\
    places = options.places;\n\
    this.screen = options.screen;\n\
    \n\
    this.areas = new Area({screen: this.screen, areas: Object.keys(areas).map(function (name) { return areas[name]; })})\n\
\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_b.groups.map.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
\n\
    return this;\n\
};\n\
\n\
Map.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset();\n\
    board.hide();\n\
};\n\
\n\
Map.prototype.onMouseDown = function (event) {\n\
    this.areas.onMouseDown(event);\n\
};\n\
\n\
Map.prototype.onMouseMove = function (event) {\n\
    this.areas.onMouseMove(event);\n\
};\n\
\n\
Map.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Map();//@ sourceURL=map/index.js"
));
require.register("photograph/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
\n\
function Photograph() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Photograph.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_b.groups.photograph.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 250,\n\
        y: 65\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
Photograph.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Photograph.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
Photograph.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
Photograph.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Photograph();//@ sourceURL=photograph/index.js"
));
require.register("lake/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
\n\
function Lake() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Lake.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_b.groups.lake.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 260,\n\
        y: 60\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
Lake.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Lake.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
Lake.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
Lake.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Lake();//@ sourceURL=lake/index.js"
));
require.register("theater/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var board = require('board');\n\
var map = require('map');\n\
\n\
function Theater() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Theater.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_a.groups.theater.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 250,\n\
        y: 90\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
Theater.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Theater.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
Theater.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
Theater.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Theater();//@ sourceURL=theater/index.js"
));
require.register("pizzeria/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
\n\
function Pizzeria() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Pizzeria.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_a.groups.pizzeria.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 150,\n\
        y: 50\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
Pizzeria.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Pizzeria.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
Pizzeria.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
Pizzeria.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Pizzeria();//@ sourceURL=pizzeria/index.js"
));
require.register("bakery/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
\n\
function Bakery() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
Bakery.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_a.groups.bakery.tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 250,\n\
        y: 70\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
Bakery.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
Bakery.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
Bakery.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
Bakery.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new Bakery();//@ sourceURL=bakery/index.js"
));
require.register("clock-repair/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var sprite = require('sprite');\n\
var Barry = require('barry');\n\
var loop = require('loop');\n\
var map = require('map');\n\
var board = require('board');\n\
\n\
function ClockRepair() {\n\
    this.root = new canvas.LayerGroup();\n\
    this.layer = new canvas.Layer();\n\
    this.root.addLayer({layer: this.layer});\n\
}\n\
\n\
ClockRepair.prototype.init = function (options) {\n\
    this.screen = options.screen;\n\
    this.tilesets = options.tilesets;\n\
    this.layer.addView({view: new canvas.ImageView({\n\
        image: this.tilesets.bg_a.groups['clock-repair'].tile(),\n\
        x: 160,\n\
        y: 64\n\
    })});\n\
    this.barry = new Barry({\n\
        screen: this.screen,\n\
        tilesets: this.tilesets,\n\
        x: 150,\n\
        y: 50\n\
    });\n\
\n\
    this.layer.addView({view: this.barry});\n\
    return this;\n\
};\n\
\n\
ClockRepair.prototype.reset = function() {\n\
    this.screen.root = this.root;\n\
    board.reset({mode: this});\n\
};\n\
\n\
ClockRepair.prototype.onMouseDown = function (event) {\n\
    var options = event;\n\
    var that = this;\n\
\n\
    board.setSubject(event);\n\
    \n\
    options.callback = function () {\n\
        if (that.barry.x > that.screen.viewport.width * 7.0 / 8) {\n\
            loop.setMode({mode: map});\n\
        }\n\
\n\
    };\n\
\n\
    board.activate();\n\
};\n\
\n\
ClockRepair.prototype.update = function () {\n\
    this.barry.step();\n\
};\n\
\n\
ClockRepair.prototype.draw = function () {\n\
    this.screen.draw();\n\
};\n\
\n\
\n\
module.exports = new ClockRepair();//@ sourceURL=clock-repair/index.js"
));
require.register("board/index.js", Function("exports, require, module",
"var VerbsDesk = require('./verbsdesk');\n\
\n\
function Board() {\n\
    this.el = document.createElement('div');\n\
    this.el.setAttribute('class', 'board');\n\
    this.dialog = document.createElement('div');\n\
    this.dialog.setAttribute('class', 'dialog');\n\
    this.verbsDesk = new VerbsDesk({board: this});\n\
    this.verb = null;\n\
    this.subject = null;\n\
    this.mode = null;\n\
}\n\
\n\
Board.prototype.notify = function (options) {\n\
    if (!!this.notifyId) {\n\
        clearTimeout(this.notifyId);\n\
    }\n\
    var dialogText = this.dialogText;\n\
    dialogText.data = options.text;\n\
    this.notifyId = setTimeout(function () {\n\
        dialogText.data = '';\n\
    }, 2000);\n\
};\n\
\n\
Board.prototype.setDefault = function (options) {\n\
    this.default = options.verb;\n\
    this.setVerb({verb: this.default});\n\
};\n\
\n\
Board.prototype.reset = function (options) {\n\
    options = options || {};\n\
    if (!!options.mode) {\n\
        this.mode = options.mode;\n\
    }\n\
    this.setVerb({verb: this.default});\n\
    this.subject = null;\n\
    this.show();\n\
};\n\
\n\
Board.prototype.show = function () {\n\
    this.verbsDesk.el.setAttribute('style', 'display: block');\n\
};\n\
\n\
Board.prototype.hide = function () {\n\
    this.verbsDesk.el.setAttribute('style', 'display: none');\n\
};\n\
\n\
Board.prototype.setStatus = function (options) {\n\
    this.status = options.status;\n\
    this.statusText.data = this.status;\n\
};\n\
\n\
Board.prototype.setVerb = function (options) {\n\
    this.verb = options.verb;\n\
    this.setStatus({status: this.verb.name});\n\
};\n\
\n\
Board.prototype.setSubject = function (subject) {\n\
    this.subject = subject;\n\
    if (typeof subject.name === 'string') {\n\
        this.setStatus({status: this.verb.name + ' ' + this.subject.name.toUpperCase()});\n\
    } else {\n\
        this.setStatus({status: this.verb.name});\n\
    }\n\
};\n\
\n\
Board.prototype.activate = function () {\n\
    if (typeof this.verb.activate !== 'function') {\n\
        console.log('verb with no activation');\n\
        return;\n\
    }\n\
    if (typeof this.subject === null) {\n\
        console.log('no subject defined');\n\
        return;\n\
    }\n\
    if (typeof this.mode === null) {\n\
        console.log('no mode defined');\n\
        return;\n\
    }\n\
    this.verb.activate({board: this});\n\
    this.reset({mode: this.mode});\n\
};\n\
\n\
Board.prototype.render = function () {\n\
    this.statusLine = document.createElement('div');\n\
    this.statusLine.setAttribute('class', 'status-line');\n\
    this.statusText = document.createTextNode('');\n\
    this.statusLine.appendChild(this.statusText);\n\
    this.dialogText = document.createTextNode('');\n\
    this.dialog.appendChild(this.dialogText);\n\
    this.el.appendChild(this.statusLine);\n\
    this.el.appendChild(this.verbsDesk.render().el);\n\
    return this;    \n\
};\n\
\n\
module.exports = new Board();//@ sourceURL=board/index.js"
));
require.register("board/verbsdesk.js", Function("exports, require, module",
"var verbs = {\n\
    get: {\n\
        pos: 0,\n\
        name: 'GET',\n\
        \n\
        activate: function (options) {\n\
\n\
        }\n\
    },\n\
\n\
    take: {\n\
        pos: 1,\n\
        name: 'TAKE',\n\
        \n\
        activate: function (options) {\n\
            var subject = options.board.subject;\n\
            options.callback = function () {\n\
                if (typeof subject.take === 'function') {\n\
                    subject.take(options);\n\
                }\n\
            };\n\
            verbs.go.activate(options);\n\
        }\n\
    },\n\
\n\
    use: {\n\
        pos: 2,\n\
        name: 'USE',\n\
\n\
        activate: function (options) {\n\
\n\
        }\n\
    },\n\
\n\
    go: {\n\
        pos: 3,\n\
        name: 'GO TO',\n\
\n\
        activate: function (options) {\n\
            var barry = options.board.mode.barry;\n\
            var subject = options.board.subject;\n\
            subject.walkCallback = options.callback || function () {};\n\
            if (typeof subject.go === 'function') {\n\
                subject.go(options);\n\
            } else {\n\
                barry.walkTo(subject);    \n\
            }\n\
            \n\
        }\n\
    },\n\
\n\
    look: {\n\
        pos: 4,\n\
        name: 'LOOK AT',\n\
\n\
        activate: function (options) {\n\
\n\
        }\n\
    },\n\
\n\
    talk: {\n\
        pos: 5,\n\
        name: 'TALK TO',\n\
\n\
        activate: function (options) {\n\
\n\
        }\n\
    },\n\
};\n\
\n\
function VerbsDesk(options) {\n\
    this.el = document.createElement('div');\n\
    this.el.setAttribute('class', 'verbs-desk');\n\
    this.board = options.board;\n\
}\n\
\n\
VerbsDesk.prototype.render = function () {\n\
    var verbsNames = Object.keys(verbs);\n\
    var board = this.board;\n\
\n\
    verbsNames.forEach(function (verbName) {\n\
        var el = document.createElement('div');\n\
        var verb = verbs[verbName];\n\
        \n\
        el.setAttribute('class', 'verb');\n\
        el.appendChild(document.createTextNode(verb.name));\n\
        el.addEventListener('click', function () {\n\
            board.setVerb({verb: verb});\n\
        });\n\
        this.el.appendChild(el);\n\
    }, this);\n\
\n\
    this.board.setDefault({verb: verbs.go});\n\
    return this;\n\
};\n\
\n\
module.exports = VerbsDesk;//@ sourceURL=board/verbsdesk.js"
));
require.register("boot/index.js", Function("exports, require, module",
"var canvas = require('canvas');\n\
var gameEl = document.getElementById('game');\n\
var tile = require('tile');\n\
var sprite = require('sprite');\n\
var loop = require('loop');\n\
var loader = require('loader');\n\
\n\
var board = require('board');\n\
var map = require('map');\n\
var stadium = require('stadium');\n\
var photograph = require('photograph');\n\
var lake = require('lake');\n\
var theater = require('theater');\n\
var pizzeria = require('pizzeria');\n\
var bakery = require('bakery');\n\
var clockRepair = require('clock-repair');\n\
\n\
\n\
sprite.Sprite.fps = 10;\n\
\n\
gameEl.appendChild(board.dialog);\n\
\n\
var screen = new canvas.Canvas({\n\
    width: 960,\n\
    height: 384,\n\
    viewport: {\n\
        width: 320,\n\
        height: 128\n\
    },\n\
    parent: gameEl\n\
});\n\
\n\
gameEl.appendChild(board.render().el);\n\
\n\
var url = location.host.match(/github/) ? '/barrys-pie-day/static/assets/tilesets' : '/static/assets/tilesets';\n\
\n\
tile.load({url: url, success: function (options) {\n\
    loader.load({tilesets: options.tilesets, callback: function () {\n\
        var opt = {screen: screen, tilesets: options.tilesets};\n\
\n\
        map.init({screen: screen, tilesets: options.tilesets, places: {\n\
            stadium: stadium.init(opt),\n\
            photograph: photograph.init(opt),\n\
            lake: lake.init(opt),\n\
            theater: theater.init(opt),\n\
            pizzeria: pizzeria.init(opt),\n\
            bakery: bakery.init(opt),\n\
            clockRepair: clockRepair.init(opt)\n\
        }});\n\
        \n\
\n\
        loop.setMode({mode: stadium});\n\
        loop.start({mouseArea: screen.el});\n\
    }});\n\
\n\
}});\n\
//@ sourceURL=boot/index.js"
));















require.alias("boot/index.js", "barrys-pie-day/deps/boot/index.js");
require.alias("boot/index.js", "boot/index.js");
require.alias("gameponent-canvas/index.js", "boot/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "boot/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "boot/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "boot/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "boot/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "boot/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "boot/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "boot/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "boot/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "boot/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "boot/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "boot/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "boot/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "boot/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "boot/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "boot/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "boot/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "boot/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("loader/index.js", "boot/deps/loader/index.js");
require.alias("gameponent-canvas/index.js", "loader/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "loader/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "loader/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "loader/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "loader/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "loader/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "loader/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "loader/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "loader/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "loader/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "loader/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "loader/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "loader/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "loader/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "loader/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "loader/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "loader/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "loader/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("stadium/index.js", "boot/deps/stadium/index.js");
require.alias("stadium/judgewoman.js", "boot/deps/stadium/judgewoman.js");
require.alias("stadium/judgeglass.js", "boot/deps/stadium/judgeglass.js");
require.alias("stadium/judgeyoung.js", "boot/deps/stadium/judgeyoung.js");
require.alias("gameponent-canvas/index.js", "stadium/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "stadium/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "stadium/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "stadium/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "stadium/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "stadium/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "stadium/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "stadium/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "stadium/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "stadium/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "stadium/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "stadium/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "stadium/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "stadium/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "stadium/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "stadium/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "stadium/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "stadium/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "stadium/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("barry/index.js", "stadium/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "stadium/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "stadium/deps/board/index.js");
require.alias("board/verbsdesk.js", "stadium/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "stadium/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "boot/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("photograph/index.js", "boot/deps/photograph/index.js");
require.alias("gameponent-canvas/index.js", "photograph/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "photograph/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "photograph/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "photograph/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "photograph/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "photograph/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "photograph/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "photograph/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "photograph/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "photograph/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "photograph/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "photograph/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "photograph/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "photograph/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "photograph/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "photograph/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "photograph/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "photograph/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "photograph/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "photograph/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "photograph/deps/board/index.js");
require.alias("board/verbsdesk.js", "photograph/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("lake/index.js", "boot/deps/lake/index.js");
require.alias("gameponent-canvas/index.js", "lake/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "lake/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "lake/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "lake/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "lake/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "lake/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "lake/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "lake/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "lake/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "lake/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "lake/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "lake/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "lake/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "lake/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "lake/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "lake/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "lake/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "lake/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "lake/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "lake/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "lake/deps/board/index.js");
require.alias("board/verbsdesk.js", "lake/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("theater/index.js", "boot/deps/theater/index.js");
require.alias("gameponent-canvas/index.js", "theater/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "theater/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "theater/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "theater/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "theater/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "theater/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "theater/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "theater/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "theater/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "theater/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "theater/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "theater/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "theater/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "theater/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "theater/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "theater/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "theater/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "theater/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "theater/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "theater/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "theater/deps/board/index.js");
require.alias("board/verbsdesk.js", "theater/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("pizzeria/index.js", "boot/deps/pizzeria/index.js");
require.alias("gameponent-canvas/index.js", "pizzeria/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "pizzeria/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "pizzeria/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "pizzeria/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "pizzeria/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "pizzeria/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "pizzeria/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "pizzeria/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "pizzeria/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "pizzeria/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "pizzeria/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "pizzeria/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "pizzeria/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "pizzeria/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "pizzeria/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "pizzeria/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "pizzeria/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "pizzeria/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "pizzeria/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "pizzeria/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "pizzeria/deps/board/index.js");
require.alias("board/verbsdesk.js", "pizzeria/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("bakery/index.js", "boot/deps/bakery/index.js");
require.alias("gameponent-canvas/index.js", "bakery/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "bakery/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "bakery/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "bakery/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "bakery/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "bakery/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "bakery/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "bakery/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "bakery/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "bakery/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "bakery/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "bakery/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "bakery/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "bakery/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "bakery/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "bakery/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "bakery/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "bakery/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "bakery/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "bakery/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "bakery/deps/board/index.js");
require.alias("board/verbsdesk.js", "bakery/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("clock-repair/index.js", "boot/deps/clock-repair/index.js");
require.alias("gameponent-canvas/index.js", "clock-repair/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "clock-repair/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "clock-repair/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "clock-repair/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "clock-repair/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "clock-repair/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "clock-repair/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "clock-repair/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "clock-repair/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "clock-repair/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "clock-repair/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "clock-repair/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "clock-repair/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "clock-repair/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "clock-repair/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "clock-repair/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "clock-repair/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "clock-repair/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("barry/index.js", "clock-repair/deps/barry/index.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "barry/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "barry/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "barry/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "barry/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "barry/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "barry/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "barry/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "barry/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "barry/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "barry/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "barry/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "barry/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "barry/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "barry/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "barry/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("map/index.js", "clock-repair/deps/map/index.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "map/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "map/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "map/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "map/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "map/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "map/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "map/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "map/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "map/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "map/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "map/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "map/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "map/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "map/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "map/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("area/index.js", "map/deps/area/index.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "area/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "area/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "area/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "area/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "area/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "area/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "area/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "area/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "area/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "area/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "area/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "area/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "area/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "area/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/lib/point.js", "area/deps/geom/lib/point.js");
require.alias("gameponent-geom/lib/vector.js", "area/deps/geom/lib/vector.js");
require.alias("gameponent-geom/lib/rect.js", "area/deps/geom/lib/rect.js");
require.alias("gameponent-geom/index.js", "area/deps/geom/index.js");
require.alias("gameponent-geom/index.js", "gameponent-geom/index.js");
require.alias("component-clone/index.js", "area/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "map/deps/board/index.js");
require.alias("board/verbsdesk.js", "map/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "clock-repair/deps/board/index.js");
require.alias("board/verbsdesk.js", "clock-repair/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("board/index.js", "boot/deps/board/index.js");
require.alias("board/verbsdesk.js", "boot/deps/board/verbsdesk.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "board/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "board/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "board/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "board/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "board/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "board/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("gameponent-tile/lib/tileset.js", "board/deps/tile/lib/tileset.js");
require.alias("gameponent-tile/lib/tile.js", "board/deps/tile/lib/tile.js");
require.alias("gameponent-tile/lib/tilegroup.js", "board/deps/tile/lib/tilegroup.js");
require.alias("gameponent-tile/index.js", "board/deps/tile/index.js");
require.alias("jofan-get-file/index.js", "gameponent-tile/deps/get-file/index.js");

require.alias("gameponent-tile/index.js", "gameponent-tile/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-sprite/index.js", "board/deps/sprite/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/lib/canvas.js", "gameponent-sprite/deps/canvas/lib/canvas.js");
require.alias("gameponent-canvas/lib/layer.js", "gameponent-sprite/deps/canvas/lib/layer.js");
require.alias("gameponent-canvas/lib/layergroup.js", "gameponent-sprite/deps/canvas/lib/layergroup.js");
require.alias("gameponent-canvas/lib/imageview.js", "gameponent-sprite/deps/canvas/lib/imageview.js");
require.alias("gameponent-canvas/lib/drawable.js", "gameponent-sprite/deps/canvas/lib/drawable.js");
require.alias("gameponent-canvas/index.js", "gameponent-sprite/deps/canvas/index.js");
require.alias("gameponent-canvas/index.js", "gameponent-canvas/index.js");
require.alias("component-clone/index.js", "gameponent-sprite/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");

require.alias("gameponent-sprite/index.js", "gameponent-sprite/index.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/lib/modestack.js", "board/deps/loop/lib/modestack.js");
require.alias("gameponent-loop/lib/eventhandler.js", "board/deps/loop/lib/eventhandler.js");
require.alias("gameponent-loop/index.js", "board/deps/loop/index.js");
require.alias("gameponent-loop/index.js", "gameponent-loop/index.js");
require.alias("component-clone/index.js", "board/deps/clone/index.js");
require.alias("component-type/index.js", "component-clone/deps/type/index.js");
