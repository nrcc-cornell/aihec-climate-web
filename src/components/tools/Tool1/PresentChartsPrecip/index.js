///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import LoadExtremePrecipYears from './LoadExtremePrecipYears';
import LoadExtremePrecipTimeSeries from './LoadExtremePrecipTimeSeries';

// Styles
import '../../../../styles/WxCharts.css';

var HighchartsMore = require('highcharts-more');
HighchartsMore(Highcharts);

require("highcharts/modules/accessibility")(Highcharts);
require("highcharts/modules/no-data-to-display")(Highcharts);
require("highcharts/modules/exporting")(Highcharts);
require("highcharts/modules/export-data")(Highcharts);

const styles = theme => ({
  wrapper: {
    position: 'relative',
  },
  mainSelect: {
    marginLeft: '0px'
  },
  chartProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -60,
    marginLeft: -40,
  },
});

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
        this.today_mmdd = moment().format('MMDD')
        this.state = {
            min_year: null,
            max_year: null,
            data_min_year: [],
            data_max_year: [],
            isExtremeMaxPrecipLoading: true,
            isExtremeMinPrecipLoading: true,
        }
    }

    componentDidMount() {
        this.updateDisplayState('highcharts-data-table','none');
        this.updateExtremePrecip();
    }

    componentDidUpdate(prevProps,prevState) {
        if (prevProps.station!==this.props.station) {
            this.updateDisplayState('highcharts-data-table','none');
            this.updateExtremePrecip();
        }
    }

    reinitState = () => {
        this.setState({ min_year:null, max_year:null, data_min_year:[], data_max_year:[], isExtremeMaxPrecipLoading:true, isExtremeMinPrecipLoading:true })
    }

    updateExtremePrecip = () => {
            this.reinitState();
            LoadExtremePrecipYears({uid:this.props.station.uid, enddate_mmdd:this.today_mmdd})
              .then(res_years => {
                  this.setState({ min_year: res_years.min_year, max_year: res_years.max_year });
                  if (res_years.min_year && res_years.max_year && res_years.min_year!=='M' && res_years.max_year!=='M') {
                    // extreme years are defined ... data download is attempted ... reinit data and enable loading spinners
                    LoadExtremePrecipTimeSeries({uid:this.props.station.uid, enddate_yyyymmdd:this.state.max_year+this.today_mmdd})
                      .then(res_max_data => {
                        this.setState({ data_max_year: res_max_data, isExtremeMaxPrecipLoading: false });
                        LoadExtremePrecipTimeSeries({uid:this.props.station.uid, enddate_yyyymmdd:this.state.min_year+this.today_mmdd})
                          .then(res_min_data => {
                            this.setState({ data_min_year: res_min_data, isExtremeMinPrecipLoading: false })
                          });
                      });
                  } else {
                    // extreme years are not defined ... no data download is attempted ... reinit data and stop loading spinners
                    this.setState({ data_min_year:[], data_max_year: [], isExtremeMaxPrecipLoading: false, isExtremeMinPrecipLoading: false })
                  }
              });
    }

    updateDisplayState = (className,displayState) => {
        var elements = document.getElementsByClassName(className)

        for (var i = 0; i < elements.length; i++){
            elements[i].style.display = displayState;
        }
    }

    render() {

        const { classes } = this.props;

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

        let createSeriesExtremes = (yearToUse,data) => {
            let i, date_dt
            let oseries = [];
            if (data) {
                for (i=0; i<data.length; i++) {
                    date_dt = Date.UTC( parseInt(yearToUse,10), parseInt(data[i][0].slice(5,7),10)-1, parseInt(data[i][0].slice(8),10) )
                    oseries.push([date_dt,parseFloat(data[i][1])])
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
            var header = '<span style="font-size:14px;font-weight:bold;text-align:center">' + Highcharts.dateFormat('%b %e', this.x) + '</span>';
            //var year = Highcharts.dateFormat('%Y', this.x);
            var tips = "";
            for (i=0; i<this.points.length; i++) {
                item = this.points[i];
                //console.log(item);
                if ( item.series.name.includes("Missing") ) {
                    tips += '<br/><span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                } else if ( item.series.name.includes("Accumulation") ) {
                    tips += '<br/>' + item.y.toFixed(2) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                } else {
                    tips += '<br/>' + item.y.toFixed(2) + ' : <span style="color:'+item.color+';font-size:12px;font-weight:bold">' +  item.series.name + '</span>';
                }
            }
            return header + tips;
        }

        function labelFormatter() {
            //return '<input type="checkbox"><span style="color: '+this.color+'">'+ this.name + '</span>'; 
            return '<span style="color: '+this.color+'">'+ this.name + '</span>'; 
        }

        if (!app.isPresentLoading && !this.state.isExtremeMinPrecipLoading && !this.state.isExtremeMaxPrecipLoading && app.getPresentPrecip['date']!==[]) {

        const options = {
                 plotOptions: {
                     line: {
                         animation: true,
                     },
                     series: {
                         type: 'line',
                         showCheckbox: true,
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
                             legendItemClick: () => false,
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
            showTable: false,
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
          tooltip: { useHtml:false, shared:true, borderColor:"#000000", borderWidth:2, borderRadius:8, shadow:false, backgroundColor:"#ffffff",
              shape: 'rect',
              //split: true,
              //followPointer: false,
              crosshairs: { width:1, color:"#ff0000", snap:true },
              //positioner: function(boxWidth, boxHeight, point) {         
              //  return {x:point.plotX + 20,y:point.plotY};         
              //},
              //positioner: function(boxWidth, boxHeight, point) {
              //  return { x: point.plotX, y: this.chart.plotHeight };
              //},
              positioner: function(boxWidth, boxHeight, point) {
                  // Set up the variables
                  var chart = this.chart,
                      plotLeft = chart.plotLeft,
                      plotTop = chart.plotTop,
                      plotWidth = chart.plotWidth,
                      plotHeight = chart.plotHeight,
                      distance = 12, // You can use a number directly here, as you may not be able to use pick, as its an internal highchart function 
                      pointX = point.plotX,
                      pointY = point.plotY,
                      x = pointX + plotLeft + (chart.inverted ? distance : -boxWidth - distance),
                      //y = pointY - boxHeight + plotTop + 15, // 15 means the point is 15 pixels up from the bottom of the tooltip
                      y = plotHeight,
                      alignedRight;

                  // It is too far to the left, adjust it
                  if (x < 7) {
                      x = plotLeft + pointX + distance;
                  }

                  // Test to see if the tooltip is too far to the right,
                  // if it is, move it back to be inside and then up to not cover the point.
                  if ((x + boxWidth) > (plotLeft + plotWidth)) {
                      x -= (x + boxWidth) - (plotLeft + plotWidth);
                      y = pointY - boxHeight + plotTop - distance;
                      alignedRight = true;
                  }

                  // If it is now above the plot area, align it to the top of the plot area
                  if (y < plotTop + 5) {
                      y = plotTop + 5;

                      // If the tooltip is still covering the point, move it below instead
                      if (alignedRight && pointY >= y && pointY <= (y + boxHeight)) {
                          y = pointY + plotTop + distance; // below
                      }
                  } 

                  // Now if the tooltip is below the chart, move it up. It's better to cover the
                  // point than to disappear outside the chart. #834.
                  if (y + boxHeight > plotTop + plotHeight) {
                      //y = mathMax(plotTop, plotTop + plotHeight - boxHeight - distance); // below
                      y = plotTop + plotHeight - boxHeight - distance; // below
                  }

                  return {x: x, y: y};
              },
              formatter:tooltipFormatter,
          },
          credits: { text:"Powered by ACIS", href:"http://www.rcc-acis.org/", color:"#000000" },
          legend: {
              enabled: true,
              useHTML: true,
              //symbolWidth: 0,
              symbolRadius: 0,
              //symbolHeight: 0,
              align: 'left',
              floating: true,
              verticalAlign: 'top',
              layout: 'vertical',
              x: 80,
              y: 60,
              backgroundColor: '#ffffff',
              zIndex: 1000,
              labelFormatter:labelFormatter
          },
          xAxis: { type: 'datetime', gridLineWidth: 1, crosshair: true, startOnTick: false, endOnTick: false, labels: { align: 'center', x: 0, y: 20 },
                   //dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b<br/>%Y', year:'%Y' },
                   dateTimeLabelFormats:{ day:'%d %b', week:'%d %b', month:'%b 1', year:'%Y' },
            },
          yAxis: {
              title:{ text:'Precipitation (inches)', style:{"font-size":"14px", color:"#000000"}},
            },
          lang: {
              noData: "Data Not Available"
          },
          noData: {
              style: {
                  fontWeight: 'bold',
                  fontSize: '15px',
                  color: '#303030'
              }
          },
          series: [{
              name: 'Accumulation ('+year+')',
              data: (!app.isPresentLoading) ? createSeries(cdata['obs']['date'],cdata['obs']['pcpn']): [],
              type: "area",
              lineWidth:3,
              color: 'rgba(0,128,0,0.8)',
              fillColor: 'rgba(0,128,0,0.2)',
              zIndex: 0,
              selected: true,
              visible: true,
              marker: {
                enabled: false,
                symbol: 'square',
                radius: 2,
              },
          },{
              name: 'Normal (1981-2010)',
              data: (!app.isPresentLoading) ? createSeries(cdata['normal']['date'],cdata['normal']['pcpn']): [],
              type: "line",
              lineWidth:3,
              color: '#654321',
              zIndex: 2,
              selected: true,
              visible: true,
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
              },
          },{
              name: (this.state.max_year) ? 'Highest ('+this.state.max_year+')' : '',
              data: (!app.isPresentLoading && !this.state.isExtremePrecipLoading) ? createSeriesExtremes(year,this.state.data_max_year): [],
              type: "line",
              lineWidth:3,
              color: '#0000ff',
              zIndex: 2,
              selected: false,
              visible: false,
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
              },
          },{
              name: (this.state.min_year) ? 'Lowest ('+this.state.min_year+')' : '',
              data: (!app.isPresentLoading && !this.state.isExtremePrecipLoading) ? createSeriesExtremes(year,this.state.data_min_year): [],
              type: "line",
              lineWidth:3,
              color: '#ff0000',
              zIndex: 2,
              selected: false,
              visible: false,
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
              selected: true,
              visible: true,
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
          <div style={{'height':'500px', 'width':'100%', 'clear':'both'}} className={classes.wrapper}>
              {(app.isPresentLoading || this.state.isExtremeMaxPrecipLoading || this.state.isExtremeMinPrecipLoading) &&
                  <CircularProgress size={72} className={classes.chartProgress} />
              }
          </div>
        );

        }

    }
}

PresentChartsPrecip.propTypes = {
  station: PropTypes.object.isRequired,
}

export default withStyles(styles)(PresentChartsPrecip);

