///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
class PresentChartsPrecip extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        //this.chart;
        this.exportChart = () => {
          this.chart.exportChart();
        };
    }

    componentDidMount() {
        this.updateDisplayState('highcharts-data-table','none');
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.station!==this.props.station) {
            this.updateDisplayState('highcharts-data-table','none')
        }
    }

    updateDisplayState = (className,displayState) => {
        var elements = document.getElementsByClassName(className)

        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = displayState;
        }
    }

    render() {

        //let station = this.props.station.name
        let station = this.props.station
        let cdata = app.getPresentPrecip

        let lastDate = new Date(cdata['obs']['date'][cdata['obs']['date'].length-1])
        let year = lastDate.getFullYear().toString()

        let createSeries = (y,a) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    oseries.push([y[i],a[i]])
                };
            }
            return oseries;
        }

        let createSeriesFlag = (y,a,f) => {
            let i
            let oseries = [];
            if (a) {
                for (i=0; i<y.length; i++) {
                    if (f[i]==='M') {
                        oseries.push([y[i],a[i]])
                    } else {
                        oseries.push([y[i],null])
                    }
                };
            }
            return oseries;
        }

        function tooltipFormatter() {
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d', this.x) + '</span>';
            var year = Highcharts.dateFormat('%Y', this.x);
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("Missing") ) {
                    tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                } else if ( item.series.name.includes("Accumulation") ) {
                    tips += '<br/>' + item.y.toFixed(2) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' + year + ' ' +  item.series.name + '</span>';
                } else {
                    tips += '<br/>' + item.y.toFixed(2) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        if (!app.isPresentLoading && app.getPresentPrecip['date']!==[]) {

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
            text: (station.name==="") ? 'No Data Available - Please try another station.' : 'Precipitation since Jan 1, ' + year
          },
          subtitle: {
            text: (station.name==="") ? '' : 'Station: '+station.name
          },
          exporting: {
            showTable: true,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
            csv: {
              dateFormat: "%Y-%m-%d"
            },
            buttons: {
                contextButton: {
                    menuItems: ["downloadPNG","downloadPDF","downloadSVG","separator","downloadCSV"]
                },
                dataTableButton: {
                    text: 'VIEW TABLE', 
                    onclick: () => {
                        this.updateDisplayState('highcharts-data-table','block');
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
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                   dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
              title:{ text:'Precipitation (inches)', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'Accumulation',
              data: (!app.isPresentLoading) ? createSeries(cdata['obs']['date'],cdata['obs']['pcpn']): [],
              type: "area",
              lineWidth:3,
              color: 'rgba(0,128,0,0.8)',
              fillColor: 'rgba(0,128,0,0.2)',
              zIndex: 0,
              marker: {
                enabled: false,
                symbol: 'square',
                radius: 2,
              },
          },{
              name: 'Normal',
              data: (!app.isPresentLoading) ? createSeries(cdata['normal']['date'],cdata['normal']['pcpn']): [],
              type: "line",
              lineWidth:3,
              color: '#654321',
              zIndex: 2,
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
              },
          },{
              name: 'Missing Daily Observation',
              data: (!app.isPresentLoading) ? createSeriesFlag(cdata['normal']['date'],cdata['obs']['pcpn'],cdata['flag']['pcpn']): [],
              type: "line",
              lineWidth:0,
              color: '#000000',
              zIndex: 4,
              marker: {
                enabled: true,
                symbol: 'diamond',
                radius: 3,
                states: {
                  hover: {
                    enabled: false
                  }
                }
              },
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

PresentChartsPrecip.propTypes = {
  station: PropTypes.object.isRequired,
}

export default PresentChartsPrecip;

