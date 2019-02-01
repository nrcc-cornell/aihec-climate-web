///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from "@material-ui/core/Grid";
import Hidden from '@material-ui/core/Hidden';
import ReactModal from 'react-modal';

// Components
//import LocationSelect from '../../components/LocationSelect';
import NationPicker from '../../components/NationPicker';
import NationSelect from '../../components/NationSelect';
import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/HomeContents.css';

const styles = theme => ({
  button: {
    //margin: theme.spacing.unit,
    background: green[500],
  },
});

var app;

@inject('store') @observer
class HomeContents extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        const { classes } = this.props;

        return (
           <div className="HomeContents">
             <Grid item container spacing={40} justify="center">
               <Grid item>
                 <div style={{ paddingTop: 20, paddingBottom: 10 }}>
                   <Typography variant="h4">
                     Climate Tools for Tribal Nations
                   </Typography>
                 </div>
               </Grid>
             </Grid>
             <div style={{ paddingTop: 10, paddingBottom: 30 }}>
               <Grid container spacing={8} justify="center" xs={12}>
                <Grid item>
                  <Hidden xsDown>
                    <Typography variant="h6">
                      My Nation :
                    </Typography>
                  </Hidden>
                </Grid>
                <Grid item xs={9} sm={7} md={5}>
                  <NationSelect names={app.getNations} />
                </Grid>
                <Grid item>
                  <Button className={classes.button} variant="contained" onClick={()=>{app.setShowModalMap(true)}}>
                    Map
                  </Button>
                </Grid>
              </Grid>
            </div>
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
            <ToolLister />
           </div>
        );
    }
}

HomeContents.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HomeContents);
