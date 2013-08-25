var verbs = {
    get: {
        pos: 0,
        name: 'GET',
        
        activate: function (options) {

        }
    },

    take: {
        pos: 1,
        name: 'TAKE',
        
        activate: function (options) {
            var subject = options.board.subject;
            options.callback = function () {
                if (typeof subject.take === 'function') {
                    subject.take(options);
                }
            };
            verbs.go.activate(options);
        }
    },

    use: {
        pos: 2,
        name: 'USE',

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

        }
    },

    talk: {
        pos: 5,
        name: 'TALK TO',

        activate: function (options) {

        }
    },
};

function VerbsDesk(options) {
    this.el = document.createElement('div');
    this.el.setAttribute('class', 'verbs-desk');
    this.board = options.board;
}

VerbsDesk.prototype.render = function () {
    var verbsNames = Object.keys(verbs);
    var board = this.board;

    verbsNames.forEach(function (verbName) {
        var el = document.createElement('div');
        var verb = verbs[verbName];
        
        el.setAttribute('class', 'verb');
        el.appendChild(document.createTextNode(verb.name));
        el.addEventListener('click', function () {
            board.setVerb({verb: verb});
        });
        this.el.appendChild(el);
    }, this);

    this.board.setDefault({verb: verbs.go});
    return this;
};

module.exports = VerbsDesk;