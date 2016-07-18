var React = require('react');
var request = require('superagent');
//var Chart = require('react-google-charts');
import {render} from 'react-dom';
import {Chart} from 'react-google-charts';

var configGA={
    filter: {
        month: 'month',
        users: 'users',
        sessions: 'sessions'
    },
    options: {
       title: "Brain Brand Mobile",
       vAxis: {
         title: "Views"
       },
       hAxis: {
         title: "Month"
       },
       seriesType: "bars",
       colors: ['#e0440e', '#f6c7b6'],
       legend: { position: 'top' }
     }
};

// https://github.com/RakanNimer/react-google-charts

var MyChart = React.createClass({
  getInitialState: function(){
    return {
      data: [
        [
          "Month",
          "Bolivia",
          "Ecuador",
          "Madagascar",
          "Papua New Guinea",
          "Rwanda",
          "Average"
        ],
        [
          "2004/05",
          165,
          938,
          522,
          998,
          450,
          614.6
        ],
        [
          "2005/06",
          135,
          1120,
          599,
          1268,
          288,
          682
        ],
        [
          "2006/07",
          157,
          1167,
          587,
          807,
          397,
          623
        ],
        [
          "2007/08",
          139,
          1110,
          615,
          968,
          215,
          609.4
        ],
        [
          "2008/09",
          136,
          691,
          629,
          1026,
          366,
          569.6
        ]
      ],
        options: {
          title: "Monthly Coffee Production by Country",
          vAxis: {
            title: "Cups"
          },
          hAxis: {
            title: "Month"
          },
          seriesType: "bars",
          series: {
            5: {
              type: "line"
            }
          }
        }
    };
  },
  componentWillMount: function(){
      var self = this;
      request
      .post('/api/ga/data').send(configGA.filter).set('Accept', 'application/json')
      .end(function(err, res){
          if(err){
              self.setState({isFinish: true});
              console.log(err);
          }else{
              if(!res.body){ // null/undefine...
                  self.setState({data: null, isFinish: true});
              }else{
                  self.setState({dataChart: res.body, isFinish: true});
              }
          }
      });
  },
  render: function() {
    return (
        <div className="container">
            {this.state.isFinish &&
                <Chart chartType = "ComboChart" data = {this.state.dataChart} options = {configGA.options} graph_id = "ComboChart"  width={"100%"} height={"400px"}  legend_toggle={true} />
            }
           <Chart chartType = "ComboChart" data = {this.state.data} options = {this.state.options} graph_id = "ComboChart"  width={"100%"} height={"400px"}  legend_toggle={true} />
        </div>
      );
  }
});

module.exports = MyChart;