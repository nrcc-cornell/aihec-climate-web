///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
//import Highcharts from 'highcharts/highstock';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
//import brown from '@material-ui/core/colors/brown';

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/no-data-to-display")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

var app;

@inject('store') @observer
class PastCharts extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    componentDidMount() {
        this.updateDisplayState('highcharts-data-table','none');
    }

    componentDidUpdate(prevProps,prevState) {
        if ((prevProps.station!==this.props.station) ||
            (prevProps.variable!==this.props.variable) ||
            (prevProps.timescale!==this.props.timescale) ||
            (prevProps.season!==this.props.season) ||
            (prevProps.month!==this.props.month)) {
            this.updateDisplayState('highcharts-data-table','none')
        }
    }

    updateDisplayState = (className,displayState) => {
        var elements = document.getElementsByClassName(className)

        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = displayState;
        }
    }

    getTimescaleText = (t,s,m) => {
      // t: timescale selected
      // s: season selected
      // m: month selected
      let result
      let periodNames = {
        'jan':'January','feb':'February','mar':'March','apr':'April',
        'may':'May','jun':'June','jul':'July','aug':'August',
        'sep':'September','oct':'October','nov':'November','dec':'December',
        'djf':'Dec-Jan-Feb','mam':'Mar-Apr-May','jja':'Jun-Jul-Aug','son':'Sep-Oct-Nov'
      }
      if (t==='annual') {
        result = 'Annual'
      } else if (t==='seasonal') {
        result = periodNames[s]
      } else if (t==='monthly') {
        result = periodNames[m]
      }
      return result
    }

    getReductionText = (v) => {
      if (v==='pcpn') {
        return ''
      } else {
        return ' averages'
      }
    }

    render() {

        let varName = this.props.variable
        let varLabel = app.wxgraph_getVarLabels[this.props.variable]
        let station = this.props.station.name

        var odata = app.getPastData

        let createPastSeries = (y,a) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    oseries.push([y[i],a[i]])
                };
            }
            return oseries;
        }

        function tooltipFormatter() {
            let precision = (varName==='pcpn') ? 2 : 1
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                tips += '<br/>' + item.y.toFixed(precision) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
            }
            return header + tips;
        }

        if (!app.isPastLoading && app.getPastData['date']!==[]) {
        //if (true) {

        const options = {
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         showCheckbox: false,
                         pointStart: Date.UTC(1850,1,1),
                         animation: true,
                         lineWidth: 4,
                         marker: {
                             symbol: 'circle',
                             states: {
                                 hover: {
                                     enabled: false
                                 }
                             }
                         },
                         states: {
                             hover: {
                                 enabled: false,
                                 halo: {
                                     size: 0
                                 }
                             }
                         },
                         events: {
                             checkboxClick: function(event) {
                                 if (event.checked) {
                                     this.show();
                                     //this.legendSymbol.show();
                                 } else {
                                     this.hide();
                                     //this.legendSymbol.hide();
                                 }
                             }
                         }
                     }
                 },
          chart: {
            height: '66%',
            marginBottom: 70
          },
          title: {
            //text: varLabel+' @ '+station
            text: varLabel+' ('+this.getTimescaleText(this.props.timescale,this.props.season,this.props.month) + this.getReductionText(this.props.variable) + ')'
          },
          subtitle: {
            //text: this.getTimescaleText(this.props.timescale,this.props.season,this.props.month) + ' ' + this.getReductionText(this.props.variable)
            text: 'Station: '+station
          },
          exporting: {
            showTable: false,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
            csv: {
              dateFormat: "%Y"
            },
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG","downloadPDF","downloadSVG","separator","downloadCSV"]
                },
                dataTableButton: {
                    text: 'VIEW TABLE',
                    onclick: function() {
                        this.viewData()
                    }
                }
            }
          },
          navigation: {
              menuItemHoverStyle: {
                "background": "#795126", "color": "#ffffff"
              },
              buttonOptions: {
                theme: {
                    'stroke-width': 1,
                    stroke: 'rgb(115,64,18,0.6)',
                    r: 4,
                    states: {
                        hover: {
                            stroke: '#795126',
                            fill: 'rgb(115,64,18,0.4)'
                        },
                        select: {
                            stroke: '#039',
                            fill: 'rgb(115,64,18,0.4)'
                        }
                    }
                }
              }
          },
          tooltip: { useHtml:true, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              xDateFormat:"%b %d, %Y", shape: 'rect',
              crosshairs: { width:1, color:"#ff0000", snap:true }, formatter:tooltipFormatter },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: { align: 'center', floating: true, verticalAlign: 'bottom', layout: 'horizontal', x: 0, y: 0 },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: true, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                     dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                 },
          yAxis: {
              title:{ text:app.wxgraph_getVarLabels[this.props.variable]+' ('+app.wxgraph_getVarUnits[this.props.variable]+')', style:{"font-size":"14px", color:"#000000"}},
            },
          lang: {
              noData: "Unable To Display Data - Please try another station." 
          },
          noData: {
              style: {
                  fontWeight: 'bold',
                  fontSize: '15px',
                  color: '#303030'
              }
          },
          series: [{
              name: 'Observed',
              type: 'column',
              visible: (odata[varName+'_normal'][0]) ? true : false,
              data: (app.getPastData['date']!==[]) ? createPastSeries(odata['date'],odata[varName]) : [],
              color: (varName==='pcpn') ? '#009900' : '#ff0000',
              negativeColor: (varName==='pcpn') ? '#9f6934' : '#0088ff',
              threshold: (app.getPastData['date']!==[]) ? odata[varName+'_normal'][0] : 0,
              step: false,
              showInLegend: false,
          },{
              name: '1981-2010 Normal',
              type: 'line',
              marker: false,
              data: (app.getPastData['date']!==[]) ? createPastSeries(odata['date'],odata[varName+'_normal']) : [],
              color: '#000000',
              step: false,
          },{
              name : "Observed > Normal",
              data : [],
              color: (varName==='pcpn') ? '#009900' : '#ff0000',
              lineWidth: 0,
              includeInDataExport: false,
              marker : {symbol:'square',radius:12}
          },{
              name : "Observed < Normal",
              data : [],
              color: (varName==='pcpn') ? '#9f6934' : '#0088ff',
              lineWidth: 0,
              includeInDataExport: false,
              marker : {symbol:'square',radius:12}
          }]
        };

        return (
          <div id="wx-chart">
            <HighchartsReact
              highcharts={Highcharts}
              constructorType={"chart"}
              options={options}
            />
          </div>
        );

        } else {

        //return(false);
        return(
          <div style={{'height':'500px', 'width':'100%', 'clear':'both'}}></div>
        );

        }

    }
}

PastCharts.propTypes = {
  variable: PropTypes.string.isRequired,
  station: PropTypes.object.isRequired,
  timescale: PropTypes.string.isRequired,
  season: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
}

export default PastCharts;

