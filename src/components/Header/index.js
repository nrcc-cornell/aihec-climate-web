///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React from 'react';
import { withRouter } from "react-router-dom";
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired,
};

const styles = theme => ({
  root: {
    display: 'flex',
  },
  appBar: {
    marginLeft: 0,
  },
  headerText: {
    color: 'brown',
    fontSize: '30px',
    fontWeight: 'bold',
    marginBottom: '4px'
  },
  subHeaderText: {
    color: 'brown',
    fontSize: '16px'
  },
  rightToolbar: {
    marginLeft: 'auto',
    marginRight: 0,
    //[theme.breakpoints.down('sm')]: {
    //  display: 'none',
    //},
  },
  bottomToolbar: {
    //[theme.breakpoints.up('md')]: {
    //  display: 'none',
    //},
    display: 'none',
  },
  titleLong: {
    cursor: 'pointer',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
  titleShort: {
    cursor: 'pointer',
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
});

//var app;

@inject('store') @observer
class FullWidthTabs extends React.Component {

  //constructor(props) {
  //    super(props);
  //    app = this.props.store.app;
  //}

  state = {
    value: 0,
  };

  handleChange = (event, value) => {
    let url = ''
    if (value===0) {
        // go to home page
        url = '/';
    } else if (value===1) {
        // go to about page
        url = '/about';
    } else {
        // go to tools page, at the currently selected tool
        url = this.props.store.app.getToolInfo(this.props.store.app.getToolName).url;
    }
    this.props.history.push(url);
    this.props.store.app.setActivePage(value);
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar position="static" color="inherit">
          <Toolbar>
            <div className={classes.titleLong} onClick={() => {this.props.history.push('/')}}>
                <Typography variant="h1" className={classes.headerText}>
                        Climate Tools for Tribal Nations
                </Typography>
                <Typography variant="h2" className={classes.subHeaderText}>
                </Typography>
            </div>
            <div className={classes.titleShort} onClick={() => {this.props.history.push('/')}}>
                <Typography variant="h1" className={classes.headerText}>
                        Tribal Climate Tools
                </Typography>
                <Typography variant="h2" className={classes.subHeaderText}>
                </Typography>
            </div>
            <section className={classes.rightToolbar}>
              <Tabs
                value={this.props.store.app.getActiveTabIndex}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="standard"
              >
                <Tab label="TOOLS" value={2} />
                <Tab label="ABOUT" value={1} />
              </Tabs>
            </section>
          </Toolbar>
          <div className={classes.bottomToolbar}>
              <Tabs
                value={this.props.store.app.getActiveTabIndex}
                onChange={this.handleChange}
                indicatorColor="primary"
                textColor="primary"
                variant="standard"
              >
                <Tab label="TOOLS" value={2} />
                <Tab label="ABOUT" value={1} />
              </Tabs>
          </div>
        </AppBar>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(FullWidthTabs));
