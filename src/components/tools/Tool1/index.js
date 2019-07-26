///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import LoadingOverlay from 'react-loading-overlay';
//import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

// Components
import ChartRangeSelector from './ChartRangeSelector'
import UserInput from './UserInput'
import VarPopover from './VarPopover'
import PastCharts from './PastCharts'
import PresentCharts from './PresentCharts'
import PresentChartsPrecip from './PresentChartsPrecip'
import FutureCharts from './FutureCharts'

// Styles
import '../../../styles/Tool1Tool.css';

var app;

@inject('store') @observer
class Tool1 extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        this.state = {
          view: 'present',
          station: app.getDefaultStationFromNation,
          variable: 'avgt',
          scenario: 'rcp85',
          timescale: 'annual',
          month: 'jan',
          season: 'djf',
        }
    }

    componentDidMount() {
        //app.climview_loadData(1,1,this.state.station.uid);
        app.climview_loadData(1,1,this.state.station.uid,this.state.timescale,this.state.season,this.state.month);
    }

    componentDidUpdate(prevProps,prevState) {
      if (prevState.station!==this.state.station) {
        //app.climview_loadData(1,0,this.state.station.uid);
        app.climview_loadData(1,0,this.state.station.uid,this.state.timescale,this.state.season,this.state.month);
      }
      if (prevState.timescale!==this.state.timescale ||
          prevState.month!==this.state.month ||
          prevState.season!==this.state.season) {
            //app.climview_loadData(1,1,this.state.station.uid);
            app.climview_loadData(1,1,this.state.station.uid,this.state.timescale,this.state.season,this.state.month);
      }
    }

    handleViewChange = (v) => {
        this.setState({ view: v })
    }

    handleStationChange = (s) => {
        this.setState({ station: {name:s.name, uid:s.uid} })
    }

    handleVariableChange = (e) => {
        this.setState({ variable: e.target.value })
    }

    handleScenarioChange = (e) => {
        this.setState({ scenario: e.target.value })
    }

    handleTimescaleChange = (e) => {
        this.setState({ timescale: e.target.value })
    }

    handleMonthChange = (e) => {
        this.setState({ month: e.target.value })
    }

    handleSeasonChange = (e) => {
        this.setState({ season: e.target.value })
    }

    render() {

        let display;
        if (this.state.view==='past') {
            display = <PastCharts
                          variable={this.state.variable}
                          station={this.state.station}
                          timescale={this.state.timescale}
                          season={this.state.season}
                          month={this.state.month}
                      />
        }
        if (this.state.view==='present' && this.state.variable==='avgt') {
            display = <PresentCharts
                          station={this.state.station}
                      />
        }
        if (this.state.view==='present' && this.state.variable==='pcpn') {
            display = <PresentChartsPrecip
                          station={this.state.station}
                      />
        }
        if (this.state.view==='future') {
            display = <FutureCharts
                          nation={this.props.nation}
                          variable={this.state.variable}
                          scenario={this.state.scenario}
                          timescale={this.state.timescale}
                          season={this.state.season}
                          month={this.state.month}
                      />
        }
        let display_UserInput = <UserInput
                                  selected_nation={this.props.nation}
                                  selected_view={this.state.view}
                                  selected_station={this.state.station}
                                  selected_variable={this.state.variable}
                                  selected_scenario={this.state.scenario}
                                  selected_timescale={this.state.timescale}
                                  selected_month={this.state.month}
                                  selected_season={this.state.season}
                                  onchange_station={this.handleStationChange}
                                  onchange_variable={this.handleVariableChange}
                                  onchange_scenario={this.handleScenarioChange}
                                  onchange_timescale={this.handleTimescaleChange}
                                  onchange_month={this.handleMonthChange}
                                  onchange_season={this.handleSeasonChange}
                                />;
        let display_VarPopover = <VarPopover content={display_UserInput} />;

        return (
            <Grid container direction="column" justify="center" alignItems="center">
              <Grid item>
                <ChartRangeSelector selected_view={this.state.view} onchange={this.handleViewChange} />
              </Grid>
              <Grid container item justify="flex-start" alignItems="flex-start">
                <Hidden mdUp>
                  {display_VarPopover}
                </Hidden>
              </Grid>
              <Grid container item justify="center" alignItems="flex-start">
                <Grid item className="nothing" xs={false} md={3}>
                  <Hidden smDown>
                      {display_UserInput}
                  </Hidden>
                </Grid>
                <Grid item container className="nothing" direction="row" justify="center" xs={12} md={9}>
                    <Grid item>
                        <LoadingOverlay
                          active={app.isPastLoading}
                          spinner
                          background={'rgba(255,255,255,1.0)'}
                          color={'rgba(34,139,34,1.0)'}
                          spinnerSize={'10vw'}
                          >
                            {display}
                        </LoadingOverlay>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
        );
    }
}

Tool1.propTypes = {
  nation: PropTypes.object.isRequired,
};

export default Tool1;
