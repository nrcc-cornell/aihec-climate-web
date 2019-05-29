import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from "react-router-dom";
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

var app;

@inject("store") @observer
class ToolSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    onChangeTool = (e) => {
      let toolname=e.target.value
      app.setSelectedToolName(e);
      this.props.history.push(app.getToolInfo(toolname).url);
    }

    render() {
        const { classes, theme } = this.props;

        return (
          <form className={classes.root} autoComplete="off">
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="tool">Tool</InputLabel>
              <Select
                value={app.getToolName}
                onChange={this.onChangeTool}
                inputProps={{
                  name: 'tool',
                  id: 'tool',
                }}
              >
                <MenuItem value='climview'>Climate Viewer</MenuItem>
                <MenuItem value='tool2'>Tool 2</MenuItem>
              </Select>
            </FormControl>
          </form>
        )
    }

};

export default withRouter(withStyles(styles)(ToolSelect));
