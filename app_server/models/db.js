var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/loc8r';
if (process.env.NODE_ENV === 'production') {
  dbURI = process.env.MONGOLAB_URI;
}
var gracefulShutdown;

mongoose.connect(dbURI);

// Emulate SIGINT from NodeJS process on Windows
var readline = require("readline");
if (process.platform === "win32") {
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.on("SIGINT", function() {
    process.emit("SIGINT");
  });
}

mongoose.connection.on('connected', function() {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
  console.log('Mongoose connection error ' + err);
});

mongoose.connection.on('disconnected', function() {
  console.log('Mongoose disconnected');
});

// Reusable shutdown function
gracefulShutdown = function(msg, callback) {
  mongoose.connection.close(function() {
    console.log('Mongoose disconnected through ' + msg);
    callback();
  });
}

// For nodemon restarts
process.once('SIGUSR2', function() {
  gracefulShutdown('nodemon restart', function() {
    process.kill(process.pid, 'SIGUSR2')
  });
});

// For application termination
process.once('SIGINT', function() {
  gracefulShutdown('application termination', function() {
    process.exit(0);
  });
});

// For Heroku app shutdown
process.once('SIGTERM', function() {
  gracefulShutdown('Heroku app shutdown', function() {
    process.exit(0);
  });
});

require('./locations');