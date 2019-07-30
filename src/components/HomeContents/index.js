///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
//import Hidden from '@material-ui/core/Hidden';

// Components
import NationPickerMap from '../../components/NationPickerMap';
import NationSelect from '../../components/NationSelect';

// Styles
//import '../../styles/HomeContents.css';

const styles = theme => ({
  labelText: {
    color: 'black',
    fontSize: '20px',
    fontWeight: 'bold',
    //marginBottom: '20px'
  }
});

let app;

@inject('store') @observer
class HomeContents extends Component {

    constructor(props) {
      super(props);
      app = this.props.store.app;
      // set site's active page
      app.setActivePage(2);
    }

    render() {
        const { classes } = this.props;

        return (
            <div className="HomeContents">
                   <div style={{ paddingTop: 20, paddingBottom: 20 }}>
                     <Grid container spacing={1} justify="center" xs={12} alignItems="center">
                      <Grid item xs={7} sm={5} md={3}>
                        {app.getNations && app.getNation && <NationSelect names={app.getNations} />}
                      </Grid>
                     </Grid>
                  </div>
                  <Grid container direction="column" spacing="3" alignItems="center">
                      <Grid item xs={12}>
                        { this.props.store.app.getNations && (<NationPickerMap />)}
                      </Grid>
                  </Grid>
            </div>
        );
    }
}

HomeContents.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeContents);
