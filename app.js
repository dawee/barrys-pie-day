var path = require('path');
var express = require('express');
var app = express();

app.set('views', __dirname);
app.set('view engine', 'jade');
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use('/static', express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
    res.sendfile(path.join(__dirname, 'index.html'));
});

app.listen(8888);


