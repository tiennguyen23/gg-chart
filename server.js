var http = require('http'),
    express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser');
var app = express();

app.set('port', 8000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res, next) {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// https://github.com/jsguy/ga-api
var gaApi = require('ga-api');
var _ = require('lodash');
var ga_options = {
        clientId: "a60ba5973b160241a3167febf1539473c92c8755",
        email: "giang-nguyen@cms-nextgen-ga.iam.gserviceaccount.com",
        key: "./public/cms-nextgen.p12",
        ids: "ga:97251292"
    };

var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

app.post('/api/ga/data', function(req, res, next) {
  gaApi(_.extend({}, ga_options, {
      startDate: "2016-01-01",
      endDate: "2016-07-31",
      metrics: "ga:users,ga:sessions",
      dimensions: "ga:month"
  }), function(err, data) {
      if(err){
        console.log(err);
        res.json(null);
      }else{
        var dataResult = [];
        var dataMap = req.body;
        // Get array of object's keys
        dataResult.push(Object.keys(dataMap));
        data.rows.forEach(function(row){
           // convert string to int
           dataResult.push(row.map(function(item, index) {
                if(index == 0){
                    return monthNames[parseInt(item)-1];
                 }else{
                    return parseFloat(item);
                 }
            }));
        });
        console.log(dataResult);
        res.json(dataResult);
      }
  });
});

// create server
var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});