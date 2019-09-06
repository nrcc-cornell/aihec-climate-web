///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import { withRouter } from "react-router-dom";
import Button from '@material-ui/core/Button';
import red from '@material-ui/core/colors/red';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
//import { borders } from '@material-ui/system';

import ciglogo from '../../../../assets/logo-climate-impacts-group.png'

import StationPickerMap from '../../common/StationPickerMap';
import VarPicker from '../VarPicker';
import ScenarioPicker from '../ScenarioPicker';
import TimescalePicker from '../TimescalePicker';
import PeriodPicker from '../PeriodPicker';
import HelpUserPopover from '../HelpUserPopover';
import HelpUserContent from '../HelpUserContent';

const styles = theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    //margin: theme.spacing.unit,
    margin: theme.spacing(1),
  },
  group: {
    margin: `${theme.spacing(1)}px 0`,
  },
  button: {
    color: red[500],
  },
  buttonUW: {
    textTransform: 'none',
  },
});

var app;
var history;
var uw_nations;

@inject('store') @observer
class UserInput extends React.Component {
  constructor(props) {
      super(props);
      app = this.props.store.app;
      history = this.props.history;
      uw_nations=['Flathead Reservation','Blackfeet Indian Reservation','Lummi Reservation']
  }

  onChangeClick = () => {
    //app.setActivePage(0);
    history.push('/');
  }

  getStationBox = (width,height) => {
      let sLat = parseFloat(app.getNation.ll[0]) - (height/2.)
      let nLat = parseFloat(app.getNation.ll[0]) + (height/2.)
      let wLon = parseFloat(app.getNation.ll[1]) - (width/2.)
      let eLon = parseFloat(app.getNation.ll[1]) + (width/2.)
      return [wLon.toString(),sLat.toString(),eLon.toString(),nLat.toString()].join(',')
  }

  render() {
    const { classes } = this.props;

    return (
      <Box paddingTop={1} border={1} borderRadius={4} borderColor="primary.main">
      <Grid container direction="column" justify="space-evenly" alignItems="center" spacing={1}>
        <Grid container item direction="row" justify="center" alignItems="center" spacing={0}>
          <Grid item>
            <Button className={classes.button} variant="outlined" color="secondary" size="small" onClick={this.onChangeClick}>
              Change Nation
            </Button>
          </Grid>
          <Grid item>
            <HelpUserPopover content={<HelpUserContent/>} />
          </Grid>
        </Grid>
        <Grid item>
            {this.props.selected_variable &&
              <StationPickerMap
                  type={this.props.selected_variable}
                  period={['2019-04-01','2019-06-01']}
                  bounds={this.getStationBox(4.,4.)}
                  selected_nation={this.props.selected_nation}
                  selected_variable={this.props.selected_variable}
                  selected_view={this.props.selected_view}
                  selected_station={this.props.selected_station}
                  onchange_station={this.props.onchange_station}
              />
            }
        </Grid>
        <Grid item>
          <VarPicker selected_view={this.props.selected_view} value={this.props.selected_variable} onchange={this.props.onchange_variable} />
        </Grid>
        <Grid item>
          {this.props.selected_view==='future' &&
            <ScenarioPicker value={this.props.selected_scenario} onchange={this.props.onchange_scenario} />
          }
        </Grid>
        <Grid item>
          {this.props.selected_view!=='present' &&
            <TimescalePicker value={this.props.selected_timescale} onchange={this.props.onchange_timescale} />
          }
        </Grid>
        <Grid item>
          {this.props.selected_view!=='present' && this.props.selected_timescale &&
            <PeriodPicker
                selected_timescale={this.props.selected_timescale}
                value_month={this.props.selected_month}
                value_season={this.props.selected_season}
                onchange_month={this.props.onchange_month}
                onchange_season={this.props.onchange_season}
            />
          }
        </Grid>
        <Grid item>
          {this.props.selected_view==='future' && uw_nations.includes(this.props.selected_nation.name) &&
              <Button className={classes.buttonUW} variant="outlined" color="secondary" size="small" href="https://climate.northwestknowledge.net/NWTOOLBOX/tribalProjections.php" target="_blank" rel="noopener">
                <img src={ciglogo} width="61" hspace="20" alt="Climate Impacts Group" />
                {"** view additional projections for this location (external site)"}
              </Button>
          }
        </Grid>
      </Grid>
      </Box>
    );
  }
}

UserInput.propTypes = {
  classes: PropTypes.object.isRequired,
  selected_nation: PropTypes.object.isRequired,
  selected_view: PropTypes.string.isRequired,
  selected_station: PropTypes.object.isRequired,
  selected_variable: PropTypes.string.isRequired,
  selected_scenario: PropTypes.string.isRequired,
  selected_timescale: PropTypes.string.isRequired,
  selected_month: PropTypes.string.isRequired,
  selected_season: PropTypes.string.isRequired,
  onchange_station: PropTypes.func.isRequired,
  onchange_variable: PropTypes.func.isRequired,
  onchange_scenario: PropTypes.func.isRequired,
  onchange_timescale: PropTypes.func.isRequired,
  onchange_month: PropTypes.func.isRequired,
  onchange_season: PropTypes.func.isRequired,
};

export default withRouter(withStyles(styles)(UserInput));
