var board;

var verbs = {
    get: {
        pos: 0,
        name: 'GET',
        
        activate: function (options) {

        }
    },

    put: {
        pos: 1,
        name: 'PUT',
        
        activate: function (options) {
            var subject = options.board.subject;
            options.callback = function () {
                if (typeof subject.put === 'function') {
                    subject.put(options);
                }
            };
            verbs.go.activate(options);
        }
    },

    use: {
        pos: 2,
        name: function () {
            if (board.handled !== null) {
                return 'USE ' + board.handled.name + ' WITH';
            } else {
                return 'USE';
            }
        },

        activate: function (options) {

        }
    },

    go: {
        pos: 3,
        name: 'GO TO',

        activate: function (options) {
            var barry = options.board.mode.barry;
            var subject = options.board.subject;
            subject.walkCallback = options.callback || function () {};
            if (typeof subject.go === 'function') {
                subject.go(options);
            } else {
                barry.walkTo(subject);    
            }
            
        }
    },

    look: {
        pos: 4,
        name: 'LOOK AT',

        activate: function (options) {
            var subject = options.board.subject;
            options.callback = function () {
                console.log(subject, typeof subject.look === 'function');
                if (typeof subject.look === 'function') {
                    subject.look(options);
                }
            };
            verbs.go.activate(options);
        }
    },

    talk: {
        pos: 5,
        name: 'TALK TO',

        activate: function (options) {
            var subject = options.board.subject;
            options.callback = function () {
                if (typeof subject.talk === 'function') {
                    subject.talk(options);
                }
            };
            verbs.go.activate(options);
        }
    }

};

function VerbsDesk(options) {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'verbs-desk');
    board = options.board;
}

VerbsDesk.prototype.render = function () {
    var verbsNames = Object.keys(verbs);

    verbsNames.forEach(function (verbName) {
        var el = document.createElement('div');
        var verb = verbs[verbName];
        
        el.setAttribute('class', 'verb');
        el.appendChild(document.createTextNode(typeof verb.name === 'function' ? verb.name() : verb.name));
        el.addEventListener('click', function () {
            board.setVerb({verb: verb});
        });
        this.el.appendChild(el);
    }, this);

    board.setDefault({verb: verbs.go});
    return this;
};

module.exports = VerbsDesk;