var express = require('express');

var app = express();

var fortune = require('./lib/fortune.js');

// 设置 handlebars 视图引擎
var handlebars = require('express3-handlebars').create({
defaultLayout:'main',
helpers: {
section: function(name, options){
if(!this._sections) this._sections = {};
this._sections[name] = options.fn(this);
return null;
}
}
});

var fortunes = [
"Conquer your fears or they will conquer you.",
"Rivers need springs.",
"Do not fear what you don't know.",
"You will have a pleasant surprise.",
"Whenever possible, keep it simple.",
];

//获取当期那天气数据
function getWeatherData(){
return {
locations: [
{
name: 'Portland',
forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
weather: 'Overcast',
temp: '54.1 F (12.3 C)',
},
{
name: 'Bend',
forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
weather: 'Partly Cloudy',
temp: '55.0 F (12.8 C)',
},
{
name: 'Manzanita',
forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
weather: 'Light Rain',
temp: '55.0 F (12.8 C)',
},
],
};
}

app.use(function(req, res, next){
if(!res.locals.partials) res.locals.partials = {};
res.locals.partials.weather = getWeatherData();
next();
});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
res.render('home');
});
app.get('/about', function(req, res){
res.render('about', { fortune: fortune.getFortune() } );
});

app.get('/nursery-rhyme', function(req, res){
res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
res.json({
animal: 'squirrel',
bodyPart: 'tail',
adjective: 'bushy',
noun: 'heck',
});
});
// 404 catch-all 处理器（中间件）
app.use(function(req, res, next){
console.log("error404");
res.status(404);
res.render('404');
});
// 500 错误处理器（中间件）
app.use(function(err, req, res, next){
console.error(err.stack);
res.status(500);
res.render('500');
});


app.listen(app.get('port'), function(){
     console.log( 'Express started on http://localhost:' +
        app.get('port') + '; press Ctrl-C to terminate.' );
});

