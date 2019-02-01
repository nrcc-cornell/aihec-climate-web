import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
//import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import InfoIcon from '@material-ui/icons/Info';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 800,
    background: '#FFCC80',
  },
  image: {
    //width: 252,
    //height: 128,
    width: 250,
    height: 125,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  },
  button: {
    margin: theme.spacing.unit,
    background: '#4CAF50',
  },
  input: {
    display: 'none',
  },
  largeIcon: {
    width: 80,
    height: 80,
  },
});

function ComplexGrid(props) {
  //const { classes,name,title,tagline,thumbnail,onclick} = props;
  const { classes,title,tagline,thumbnail,onclick} = props;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing="16">
          <Grid item>
            <ButtonBase className={classes.image} onClick={onclick}>
              <img className={classes.img} alt="chart" src={require(`${thumbnail}`)} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container direction="row">
            <Grid item xs container justify="center" direction="column">
              <Grid item>
                <Typography gutterBottom variant="title">
                  {title}
                </Typography>
              </Grid>
              <Grid item>
                <Typography color="textSecondary">{tagline}</Typography>
              </Grid>
            </Grid>
            <Grid item xs={3} container direction="column">
              <Grid item xs={3}>
                <IconButton className={classes.largeIcon} aria-label="Info">
                  <InfoIcon />
                </IconButton>
              </Grid>
              <Grid item xs={3}>
                <Button variant="contained" className={classes.button} onClick={onclick}>
                  Go
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

ComplexGrid.propTypes = {
  classes: PropTypes.object.isRequired,
  //name: PropTypes.string,
  title: PropTypes.string,
  tagline: PropTypes.string,
  thumbnail: PropTypes.string,
  onclick: PropTypes.func,
};

export default withStyles(styles)(ComplexGrid);
