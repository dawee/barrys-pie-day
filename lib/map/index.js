var canvas = require('canvas');
var sprite = require('sprite');
var Area = require('area');
var loop = require('loop');
var board = require('board');
var places = {};

var areas = {

    stadium: Area.define({
        left: 8,
        top: 120,
        width: 45,
        height: 45,
        click: function () {
            loop.setMode({mode: places.stadium});
        },
        hover: function () {
            board.setSubject({name: 'Stadium'});
        }
    }),

    photograph: Area.define({
        left: 52,
        top: 128,
        width: 40,
        height: 22,
        click: function () {
            // TODO : loop.setMode({mode: places.photograph});
        },
        hover: function () {
            board.setSubject({name: 'Photograph'});
        }
    }),

    lake: Area.define({
        left: 269,
        top: 110,
        width: 40,
        height: 30,
        click: function () {
            // TODO : loop.setMode({mode: places.lake});    
        },
        hover: function () {
            board.setSubject({name: 'Lake'});
        }
    }),

    theater: Area.define({
        left: 190,
        top: 94,
        width: 45,
        height: 34,
        click: function () {
            // TODO : loop.setMode({mode: places.theater});
        },
        hover: function () {
            board.setSubject({name: 'Theater'});
        }
    }),

    pizzeria: Area.define({
        left: 44,
        top: 53,
        width: 36,
        height: 21,
        click: function () {
            loop.setMode({mode: places.pizzeria});
        },
        hover: function () {
            board.setSubject({name: 'Pizzeria'});
        }
    }),
        
    bakery: Area.define({
        left: 112,
        top: 30,
        width: 36,
        height: 33,
        click: function () {
            loop.setMode({mode: places.bakery});    
        },
        hover: function () {
            board.setSubject({name: 'Bakery'});
        }
    }),

    clockRepair: Area.define({
        left: 100,
        top: 108,
        width: 32,
        height: 27,
        click: function () {
            // TODO : loop.setMode({mode: places.clockRepair});
        },
        hover: function () {
            board.setSubject({name: 'Clock Repair'});
        }
    })

};


function Map() {
    this.root = new canvas.LayerGroup();
    this.layer = new canvas.Layer();
    this.root.addLayer({layer: this.layer});
}

Map.prototype.init = function (options) {
    var that = this;

    places = options.places;
    this.screen = options.screen;
    
    this.areas = new Area({screen: this.screen, areas: Object.keys(areas).map(function (name) { return areas[name]; })})

    this.tilesets = options.tilesets;
    this.layer.addView({view: new canvas.ImageView({
        image: this.tilesets.bg_b.groups.map.tile(),
        x: 160,
        y: 64
    })});

    return this;
};

Map.prototype.reset = function() {
    this.screen.root = this.root;
    board.reset();
    board.hide();
};

Map.prototype.onMouseDown = function (event) {
    this.areas.onMouseDown(event);
};

Map.prototype.onMouseMove = function (event) {
    this.areas.onMouseMove(event);
};

Map.prototype.draw = function () {
    this.screen.draw();
};


module.exports = new Map();