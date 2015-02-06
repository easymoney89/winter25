var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

var Gpio = require('onoff').Gpio,
    button = new Gpio(18, 'in', 'both'),
    lamp = new Gpio(22, 'out');
    redled = new Gpio(17, 'out');

function exit() {
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);

var port = process.argv[2] || 8080;
app.listen(port);
console.log('Starting server on port', port);
function handler(req, res) {
    fs.readFile(__dirname + '/adam5.html',
        function(err, data) {
            res.writeHead(200);
            res.end(data);
        });
}



io.on('connection', function(socket) {

    socket.on('clicked', function (data) {
        console.log(data);
        lamp.writeSync(1 - lamp.readSync());
        
    });

    socket.on('clickled', function (data) {
        console.log(data);
        
        redled.writeSync(1 - redled.readSync());
    });



    

  setInterval(function() {
        var d = new Date();
        var n = d.getTime();
        socket.volatile.emit('date', {
            date: d,
            milliseconds: n
        });
    }, 500);
});
