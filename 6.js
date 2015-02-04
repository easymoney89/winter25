var app = require('http').createServer(handler)
var io = require('socket.io')(app);
var fs = require('fs');

fs.readFile('/sys/class/thermal/thermal_zone0/temp', function(error, data){
            console.log(error);
        console.log(data.toString()/1000);
    });

var port = process.argv[2] || 8080;

app.listen(port,function(){
    console.log('Starting server on port', port);
});
function handler (req, res) {
    fs.readFile(__dirname + '/6.html',
        function (err, data) {
            res.writeHead(200);
            res.end(data);
        });
}

io.on('connection', function (socket) {
console.log('connected');   
 setInterval(function(){
        fs.readFile('/sys/class/thermal/thermal_zone0/temp', function(error, data){
            console.log(error);
        console.log(data.toString()/1000);
        socket.emit('cpuTemp',{number: data.toString()/1000});
    });
    }, 1000);
});
