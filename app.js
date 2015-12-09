const KEY = 'ntalk.sid', SECRET = 'ntalk';
var express = require('express')
, load = require('express-load')
, bodyParser = require('body-parser')
, cookieParser = require('cookie-parser')
, expressSession = require('express-session')
, methodOverride = require('method-override')
, error = require('./middlewares/error')
, app = express()
, server = require('http').Server(app)
, io = require('socket.io')(server)
, cookie = cookieParser(SECRET)
, store = new expressSession.MemoryStore()
, mongoose = require('mongoose');
global.db = mongoose.connect('mongodb://localhost/ntalk');
db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("vai que sua tafarel");
});


app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser('ntalk'));
app.use(expressSession());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(express.static(__dirname + '/public'));

load('models')
    .then('controllers')
    .then('routes')
    .into(app);

io.sockets.on('connection', function (client) {
  client.on('send-server', function (data) {
  var msg = "<b>"+data.nome+":</b> "+data.msg+"<br>";
  client.emit('send-client', msg);
  client.broadcast.emit('send-client', msg);
  });
});

app.use(error.notfound);
app.use(error.serverError);

app.listen(3000, function(){
   console.log("Ntalk no ar.");
});
