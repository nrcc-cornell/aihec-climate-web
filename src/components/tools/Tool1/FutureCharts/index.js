///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { toJS } from 'mobx';
import { inject, observer} from 'mobx-react';
//import moment from 'moment';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

//Components

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/exporting")(Highcharts);

var app;

@inject('store') @observer
class FutureCharts extends Component {

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

        let varName = app.wxgraph_getVar
        let varLabel = app.wxgraph_getVarLabels[app.wxgraph_getVar]
        let nation = app.getNation.name
        let startYear = new Date(2000,0,1)

        let scenario = app.getModelScenario

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
            var i, item;
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%Y', this.x) + '</span>';
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("range") ) {
                    tips += '<br/>' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                    //tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span> : ' + item.point.low.toFixed(0) + '-' + item.point.high.toFixed(0);
                } else {
                    tips += '<br/>' + item.y.toFixed(0) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        if (!app.isProjectionLoading && app.getProjectionData['date']!==[]) {

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
            text: varLabel+' @ '+nation
          },
          subtitle: {
            text: (app.getModelScenario==='rcp85') ? 'High Emission Model Scenario (RCP 8.5)' : 'Low Emission Model Scenario (RCP 4.5)'
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
          //legend: { align: 'left', floating: true, verticalAlign: 'top', layout: 'vertical', x: 65, y: 50 },
          legend: { align: 'center', floating: true, verticalAlign: 'bottom', layout: 'horizontal', x: 0, y: 0 },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
               dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
            },
          yAxis: {
               min: (!app.isProjectionLoading) ? Math.min(...pdata['rcp85']['min'][varName]) : null,
               max: (!app.isProjectionLoading) ? Math.max(...pdata['rcp85']['max'][varName]) : null,
               title:{ text:app.wxgraph_getVarLabels[app.wxgraph_getVar]+' ('+app.wxgraph_getVarUnits[app.wxgraph_getVar]+')', style:{"font-size":"14px", color:"#000000"}},
            },
          series: [{
              name: 'Observed',
              data: (!app.isProjectionLoading) ? createProjectionSeries(odata['years'],odata[varName],startYear): [],
              color: '#000000',
              step: false,
              lineWidth: 0,
              marker: { enabled: true },
              zIndex: 24,
              visible: app.chartViewIsFuture,
              showInLegend: app.chartViewIsFuture,
          },{
              name: 'Climate model average',
              data: (!app.isProjectionLoading) ? createProjectionSeries(pdata[scenario]['mean']['years'],pdata[scenario]['mean'][varName],startYear): [],
              type: "line",
              zIndex: 24,
              lineWidth: 1,
              color: "#000000",
              shadow: false,
              marker: { enabled: false, fillColor: "#00dd00", lineWidth: 2, lineColor: "#00dd00", radius:2, symbol:"circle" },
              visible: app.chartViewIsFuture,
              showInLegend: app.chartViewIsFuture,
          },{
              name: 'Climate model range',
              data: (!app.isProjectionLoading) ? createProjectionRanges(toJS(pdata)[scenario]['min']['years'],toJS(pdata)[scenario]['min'][varName],toJS(pdata)[scenario]['max'][varName],startYear): [],
              marker : {symbol: 'square', radius: 12 },
              type: "arearange",
              linkedTo: ':previous',
              lineWidth:0,
              color: 'rgba(0,0,0,0.2)',
              fillColor: 'rgba(0,0,0,0.2)',
              fillOpacity: 0.1,
              zIndex: 0,
              visible: app.chartViewIsFuture,
              showInLegend: app.chartViewIsFuture,
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

export default FutureCharts;

