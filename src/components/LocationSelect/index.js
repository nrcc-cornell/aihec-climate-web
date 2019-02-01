///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid";

import ReactModal from 'react-modal';
//import StationPicker from '../../components/StationPicker';
import NationPicker from '../../components/NationPicker';
import NationSelect from '../../components/NationSelect';

// Styles
import '../../styles/LocationSelect.css';

const styles = theme => ({
  button: {
    //margin: theme.spacing.unit,
    background: green[500],
  },
});

var app;

@inject('store') @observer
class LocationSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        const { classes } = this.props;

        return (
          <div>
              <Grid container spacing="8">
                <Grid item xs={9} md={6}>
                  <NationSelect names={app.getNations} />
                </Grid>
                <Grid item xs={3}>
                  <Button className={classes.button} variant="contained" onClick={()=>{app.setShowModalMap(true)}}>
                    Map
                  </Button>
                </Grid>
              </Grid>
              <div className="LocationSelect">
                <ReactModal
                   isOpen={app.getShowModalMap}
                   onRequestClose={()=>{app.setShowModalMap(false)}}
                   shouldCloseOnOverlayClick={true}
                   contentLabel="Location Selector"
                   className="Modal"
                   overlayClassName="Overlay"
                 >
                   <NationPicker/>
                 </ReactModal>
              </div>
          </div>
        );
    }
}

LocationSelect.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LocationSelect);
