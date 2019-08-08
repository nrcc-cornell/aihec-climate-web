///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

var app;

@inject('store') @observer
class FutureCharts extends Component {

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
        if ((prevProps.nation!==this.props.nation) ||
            (prevProps.scenario!==this.props.scenario) ||
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

    getScenarioText = (s) => {
      if (s==='rcp85') {
        return 'High Emissions Scenario (RCP 8.5)'
      } else {
        return 'Low Emissions Scenario (RCP 4.5)'
      }
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
        let nation = this.props.nation.name
        let startYear = new Date(1980,0,1)

        let scenario = this.props.scenario

        var odata = app.getLivnehData
        var pdata = app.getProjectionData

        let createProjectionSeries = (y,a,syear) => {
            let i
            let series = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    if (y[i]>=syear) {series.push([y[i],a[i]])};
                };
            }
            return series;
        }

        let createProjectionRanges = (y,a,b,syear) => {
            let i;
            let ranges = [];
            if (a && b) {
                for (i=0; i<y.length; i++) {
                    if (y[i]>=syear) {ranges.push([y[i],a[i],b[i]])};
                };
            }
            return ranges;
        }

        function tooltipFormatter() {
            let precision = (varName==='pcpn') ? 2 : 1
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                if ( item.series.name.includes("range") ) {
                    tips += '<br/>' + item.point.low.toFixed(precision) + '-' + item.point.high.toFixed(precision) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                } else {
                    tips += '<br/>' + item.y.toFixed(precision) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        //if (!app.isProjectionLoading && app.getProjectionData['date']!==[]) {
        if (true) {

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
            text: varLabel+' ('+this.getTimescaleText(this.props.timescale,this.props.season,this.props.month)+this.getReductionText(this.props.variable)+')'
          },
          subtitle: {
            text: nation+', '+this.getScenarioText(this.props.scenario)
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
                        this.viewData();
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
          //legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          legend: { align: 'center', floating: true, verticalAlign: 'bottom', layout: 'horizontal', x: 0, y: 0 },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
               plotLines:[{
                   color: '#000000',
                   width: 2,
                   value: Date.UTC(2005),
                   label: {text:'2005: Projections Begin', verticalAlign:'bottom', rotation:0, x:6, y:-6},
                   zIndex: 2,
               }],
               dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
               min: (!app.isProjectionLoading) ? Math.min(...pdata['rcp85']['min'][varName]) : null,
               max: (!app.isProjectionLoading) ? Math.max(...pdata['rcp85']['max'][varName]) : null,
               title:{ text:app.wxgraph_getVarLabels[this.props.variable]+' ('+app.wxgraph_getVarUnits[this.props.variable]+')', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'Observed',
              data: (!app.isProjectionLoading) ? createProjectionSeries(odata['years'],odata[varName],startYear): [],
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              zIndex: 24,
          },{
              name: 'Climate model average',
              data: (!app.isProjectionLoading) ? createProjectionSeries(pdata[scenario]['mean']['years'],pdata[scenario]['mean'][varName],startYear): [],
              type: "line",
              zIndex: 24,
              lineWidth: 1,
              color: "#000000",
              shadow: false,
              marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" },
          },{
              name: 'Climate model range',
              data: (!app.isProjectionLoading) ? createProjectionRanges(toJS(pdata)[scenario]['min']['years'],toJS(pdata)[scenario]['min'][varName],toJS(pdata)[scenario]['max'][varName],startYear): [],
              marker : {symbol: 'square', radius: 12 },
              type: "arearange",
              //linkedTo: ':previous',
              lineWidth:0,
              color: 'rgba(255,0,0,0.2)',
              fillColor: 'rgba(255,0,0,0.2)',
              fillOpacity: 0.1,
              zIndex: 0,
              zoneAxis: 'x',
              zones: [{
                   value: Date.UTC(2005),
                   color: 'rgba(0,0,255,0.2)',
                   fillColor: 'rgba(0,0,255,0.2)',
                }, {
                   color: 'rgba(255,0,0,0.2)',
                   fillColor: 'rgba(255,0,0,0.2)',
                }]
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

        return(false);

        }

    }
}

FutureCharts.propTypes = {
  variable: PropTypes.string.isRequired,
  nation: PropTypes.object.isRequired,
  scenario: PropTypes.string.isRequired,
  timescale: PropTypes.string.isRequired,
  season: PropTypes.string.isRequired,
  month: PropTypes.string.isRequired,
}

export default FutureCharts;

