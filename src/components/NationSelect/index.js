import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
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
    minWidth: 120,
  },
});

var app;
var history;

@inject('store') @observer
class NationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
        history = this.props.history;
    }

    // run on selection
    onChangeNation = (e) => {
        app.setSelectedNation({'value':e.target.value});
        history.push(app.getToolInfo(app.getToolName).url);
    }

    render() {
        const { classes } = this.props;

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="nation">Nation</InputLabel>
              <Select
                value={app.getNation.name}
                onChange={this.onChangeNation}
                inputProps={{
                  name: 'nation',
                  id: 'nation',
                }}
              >
                {this.props.names &&
                  this.props.names.map((n,i) => (
                    <MenuItem
                      key={i}
                      value={n.name}
                    >
                      {n.name}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>
          </form>
        )
    }

};

NationSelect.propTypes = {
  names: PropTypes.array.isRequired,
}

export default withRouter(withStyles(styles)(NationSelect));
