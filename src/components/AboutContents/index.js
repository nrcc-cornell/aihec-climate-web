///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Grid from "@material-ui/core/Grid";
import Typography from '@material-ui/core/Typography';

// Components
//import StationExplorer from '../../components/StationExplorer';
//import ToolLister from '../../components/ToolLister';

// Styles
import '../../styles/AboutContents.css';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  control: {
    padding: theme.spacing.unit * 2,
  },
  aboutHeaderText: {
    color: 'black',
    fontSize: '26px',
    fontWeight: 'normal',
  },
});

//var app;

@inject('store') @observer
class AboutContents extends Component {

    //constructor(props) {
    //    super(props);
    //    app = this.props.store.app;
    //}

    render() {

        const { classes } = this.props;

        return (
            <div className="about-contents">
            <Grid container className={classes.root} spacing={4}>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Purpose of these tools
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sagittis mauris lectus, vel cursus ipsum auctor sed. Nullam interdum nulla vitae tellus varius facilisis. Etiam dui tortor, pellentesque euismod pretium sed, condimentum quis justo. Aliquam at tristique erat. Phasellus ultricies elit in luctus aliquet. Donec porta commodo consequat. Praesent vitae sapien lacus.
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      Etiam rhoncus. Maecenas tempus, tellus eget condimentum rhoncus, sem quam semper libero, sit amet adipiscing sem neque sed ipsum. Nam quam nunc, blandit vel, luctus pulvinar, hendrerit id, lorem.
                      <ul>
                        <li>Donec in vehicula tortor.</li>
                        <li>Duis consequat congue est, et scelerisque nulla rutrum eget.</li>
                        <li>Praesent non ex lacinia dui bibendum dictum.</li>
                        <li>Fusce bibendum erat non est auctor, viverra commodo sem euismod. </li>
                      </ul>
                    </Typography>
              </Grid>
              <Grid item sm={12} md={6}>
                    <Typography align="left" paragraph variant="h2" className={classes.aboutHeaderText}>
                      Station Networks
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
Nulla augue nulla, auctor id ante sit amet, semper sollicitudin eros. Ut lorem nisl, porta sit amet arcu ac, elementum euismod massa. Duis consequat congue est, et scelerisque nulla rutrum eget. Praesent vel ultricies purus. Integer vestibulum, dolor id pulvinar malesuada, neque risus egestas est, a ultricies nibh nibh sit amet lacus. 
                    </Typography>
                    <Typography align="justify" paragraph variant="body1">
                      <ul>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/" target="_blank" rel="noopener noreferrer">SCAN / Tribal SCAN documentation</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf" target="_blank" rel="noopener noreferrer">SCAN brochure</a></li>
                        <li><a href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf" target="_blank" rel="noopener noreferrer">Tribal SCAN brochure</a></li>
                      </ul>
                    </Typography>
              </Grid>
            </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(AboutContents);
