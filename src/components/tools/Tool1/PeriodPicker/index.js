///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    //margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    //marginTop: theme.spacing(2),
  },
});

class PeriodPicker extends Component {

    //constructor(props) {
    //    super(props);
    //}

    render() {
        const { classes } = this.props;

        if (this.props.selected_timescale==='monthly') {
          return (
            <form className={classes.root} autoComplete="off">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="month">Month</InputLabel>
                <Select
                  value={this.props.value_month}
                  onChange={this.props.onchange_month}
                  inputProps={{
                    name: 'month',
                    id: 'month',
                  }}
                >
                  <MenuItem value='jan'>January</MenuItem>
                  <MenuItem value='feb'>February</MenuItem>
                  <MenuItem value='mar'>March</MenuItem>
                  <MenuItem value='apr'>April</MenuItem>
                  <MenuItem value='may'>May</MenuItem>
                  <MenuItem value='jun'>June</MenuItem>
                  <MenuItem value='jul'>July</MenuItem>
                  <MenuItem value='aug'>August</MenuItem>
                  <MenuItem value='sep'>September</MenuItem>
                  <MenuItem value='oct'>October</MenuItem>
                  <MenuItem value='nov'>November</MenuItem>
                  <MenuItem value='dec'>December</MenuItem>
                </Select>
              </FormControl>
            </form>
          )
        }

        if (this.props.selected_timescale==='seasonal') {
          return (
            <form className={classes.root} autoComplete="off">
              <FormControl className={classes.formControl}>
                <InputLabel htmlFor="season">Season</InputLabel>
                <Select
                  value={this.props.value_season}
                  onChange={this.props.onchange_season}
                  inputProps={{
                    name: 'season',
                    id: 'season',
                  }}
                >
                  <MenuItem value='djf'>Dec-Jan-Feb</MenuItem>
                  <MenuItem value='mam'>Mar-Apr-May</MenuItem>
                  <MenuItem value='jja'>Jun-Jul-Aug</MenuItem>
                  <MenuItem value='son'>Sep-Oct-Nov</MenuItem>
                </Select>
              </FormControl>
            </form>
          )
        }

        if (this.props.selected_timescale==='annual') {
          return(false)
        }

    }

};

PeriodPicker.propTypes = {
  selected_timescale: PropTypes.string.isRequired,
  value_month: PropTypes.string.isRequired,
  value_season: PropTypes.string.isRequired,
  onchange_month: PropTypes.func.isRequired,
  onchange_season: PropTypes.func.isRequired,
}

export default withStyles(styles)(PeriodPicker);
