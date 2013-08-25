var board;
var useCombinations = []

var items = {
    pen: {
        id: 'pen',
        name: 'Pen'
    }
}


function _areSubjectsHere(subject1, subject2, requirements) {
    return requirements.indexOf(subject1.id) >= 0 && requirements.indexOf(subject2.id) >= 0;
};

useCombinations.push({

    combine: function (options) {
        var handled = options.handled;
        var subject = options.subject;
        if (_areSubjectsHere(handled, subject, ['dry-pen', 'ventilation'])) {
            board.removeItem({item: handled});
            board.addItem({item: items.pen});
            board.notify({text: 'Cool, the steam seems to wet the pen'});
        }
    }

});

function Combination(options) {
    board = options.board;
}

Combination.prototype.tryUseCombination = function (options) {
    useCombinations.forEach(function (combination) {
        combination.combine(options);
    });
};

module.exports = Combination;