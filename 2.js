var Gpio = require('onoff').Gpio,
    redled = new Gpio(17, 'out'),
    yellowled = new Gpio(27, 'out'),
    greenled = new Gpio(22, 'out'),
    button = new Gpio(18, 'in', 'both');

button.watch(function(err, value) {
    if (err) exit();
    redled.writeSync(value);
    yellowled.writeSync(1 - value);
    console.log(greenled.readSync());
    if (value == 1)
        greenled.writeSync(1 - greenled.readSync());
});

redled.writeSync(1);
yellowled.writeSync(1);
greenled.writeSync(1);

function exit() {
    yellowled.writeSync(0);
    yellowled.unexport();
    redled.writeSync(0);
    redled.unexport();
    greenled.writeSync(0);
    greenled.unexport();
    button.unexport();
    process.exit();
}

process.on('SIGINT', exit);
