///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { MuiThemeProvider, createMuiTheme, withStyles, withTheme  } from "@material-ui/core/styles";
//import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import brown from '@material-ui/core/colors/brown';

// Components
import Header from '../../components/Header';
import HomeContents from '../../components/HomeContents';
import AboutContents from '../../components/AboutContents';
import ToolContents from '../../components/ToolContents';
import Footer from '../../components/Footer';

// Styles
//import 'react-tabs/style/react-tabs.css';
// modified tab css version for this app
//import '../../styles/react-tabs.css';
import '../../styles/App.css';

const theme = createMuiTheme({
  shadows: ["none"],
  palette: {
    primary: brown,
    //secondary:
  },
});

const styles = theme => ({
  root: {},
  toolbar: theme.mixins.toolbar,
});

var app;

@inject('store') @observer
class App extends Component {
    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {
        const { classes } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
              <div className="App">
                <Header />

                <div className={classes.toolbar}></div>
                {app.getActiveTabIndex===0 && <HomeContents /> }
                {app.getActiveTabIndex===1 && <AboutContents /> }
                {app.getActiveTabIndex===2 && <ToolContents name={app.getToolName}/> }

                <Footer />
              </div>
            </MuiThemeProvider>
        );
    }
}

export default withStyles(styles)(withTheme()(App));
