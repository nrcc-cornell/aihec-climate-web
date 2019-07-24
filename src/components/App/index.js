///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
//import { inject, observer} from 'mobx-react';
import { MuiThemeProvider, createMuiTheme, withStyles, withTheme  } from "@material-ui/core/styles";
import brown from '@material-ui/core/colors/brown';

// import route Components here
import {
  BrowserRouter as Router,
  //HashRouter as Router,
  Route,
  //Link,
  Switch,
  Redirect
} from 'react-router-dom'

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
  //shadows: ["none"],
  shadows: Array(25).fill("none"),
  palette: {
    primary: brown,
    //secondary:
  },
});

const styles = theme => ({
  root: {},
  toolbar: theme.mixins.toolbar,
});

class App extends Component {

    render() {
        //const { classes } = this.props;

        return (
          <Router basename={process.env.PUBLIC_URL}>
            <MuiThemeProvider theme={theme}>
              <div className="App">
                <Header theme={theme} />

                <Switch>
                  <Route exact path="/" component={HomeContents} />
                  <Route path="/about" component={AboutContents} />
                  <Route exact path="/tools" render={(props) => <ToolContents {...props} name={'climview'} />} />
                  <Route path="/tools/climate-viewer" render={(props) => <ToolContents {...props} name={'climview'} />} />
                  <Route path="/tools/tool2" render={(props) => <ToolContents {...props} name={'tool2'} />} />
                  <Route render={() => <Redirect to="/" />} />
                </Switch>

                <Footer />
              </div>
            </MuiThemeProvider>
          </Router>
        );
    }
}

export default withStyles(styles)(withTheme(App));
