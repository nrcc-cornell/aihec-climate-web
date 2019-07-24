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

    //componentDidMount() {
    //  this.chart = this.refs.chart.chart;
    //}

    render() {

        let station = this.props.station.name
        let cdata = app.getPresentPrecip

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

        function tooltipFormatter() {
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %d, %Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("Range") ) {
                    tips += '<br/>' + item.point.low.toFixed(2) + '-' + item.point.high.toFixed(2) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    //tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span> : ' + item.point.low.toFixed(2) + '-' + item.point.high.toFixed(2);
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
            marginBottom: 70
          },
          title: {
            text: (station.name==="") ? 'No Data Available - Please try another station.' : 'Recent precipitation @ '+station.name
          },
          subtitle: {
            text: (station.name==="") ? '' : 'Accumulation since Jan 1'
          },
          exporting: {
            //showTable: true,
            showTable: app.getOutputType==='chart' ? false : true,
            chartOptions: {
              chart: {
                backgroundColor: '#ffffff'
              }
            },
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
              name: 'Observed',
              data: (!app.isPresentLoading) ? createSeries(cdata['obs']['date'],cdata['obs']['pcpn']): [],
              type: "area",
              lineWidth:3,
              color: 'rgba(0,128,0,1.0)',
              fillColor: 'rgba(0,128,0,0.3)',
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

PresentChartsPrecip.propTypes = {
  station: PropTypes.object.isRequired,
}

export default PresentChartsPrecip;

