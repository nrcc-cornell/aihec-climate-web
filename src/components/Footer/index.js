///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import Grid from '@material-ui/core/Grid'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import classNames from 'classnames'
//import Link from 'next/link'
import React, { Component } from 'react'
//import InvertedButton from './InvertedButton'

import acislogo from '../../assets/acis-transparent.png'
import aiheclogo from '../../assets/AIHEC-Logo.png'
import nrcslogo from '../../assets/NRCS-Logo.png'
//import usdalogo from '../../assets/USDA-Logo.jpg'

class Footer extends Component {
  render () {
    const { classes } = this.props
    const currentYear = new Date().getFullYear()
    return (
      <div className={classes.root}>
        <Grid
          container
          spacing={0}
          className={classNames(classes.footerText, classes.footerSections)}
        >
          <Grid item xs={12} sm={3}>
                        <Typography className={classes.white} gutterBottom variant="body1">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis enim lobortis scelerisque fermentum.
                        </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <ul style={{ listStyle: 'none', margin: 0 }}>
              <li>
                            <a href="https://www.wcc.nrcs.usda.gov/tribalscan/" target="_blank" rel="noopener noreferrer">About Tribal SCAN</a>
              </li>
              <li>
                            <a href="https://www.wcc.nrcs.usda.gov/about/mon_scan.html" target="_blank" rel="noopener noreferrer">About SCAN</a>
              </li>
              <li>
                            <a href="https://www.wcc.nrcs.usda.gov/tribalscan/tribalscan_brochure.pdf" target="_blank" rel="noopener noreferrer">Tribal SCAN Brochure</a>
              </li>
              <li>
                            <a href="https://www.wcc.nrcs.usda.gov/scan/scan_brochure.pdf" target="_blank" rel="noopener noreferrer">SCAN Brochure</a>
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} sm={6}>
                        <a href="http://aihec.org/" target="_blank" rel="noopener noreferrer"><img src={aiheclogo} alt="AIHEC" width="180" height="46"/></a>
                        {' '}
                        <a href="https://www.nrcs.usda.gov/wps/portal/nrcs/site/national/home/" target="_blank" rel="noopener noreferrer"><img src={nrcslogo} alt="NRCS" /></a>
                        {' '}
                        <a href="http://www.rcc-acis.org" target="_blank" rel="noopener noreferrer"><img src={acislogo} alt="RCC ACIS" /></a>
          </Grid>
        </Grid>
        <Grid className={classes.subFooter} item xs={12}>
          <Typography
            className={classes.white}
            variant="subtitle1"
            component={'span'}
          >
            © {currentYear} Cornell University
          </Typography>
        </Grid>
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    boxShadow: '0 50vh 0 50vh '+theme.palette.primary[300],
    //display: 'flex',
    marginTop: 30,
    //width: '100%',
    backgroundColor: theme.palette.primary[300],
    borderTop: 'solid 3px #999999',
    paddingTop: '16px',
    overflowX: 'hidden'
  },
  footerSections: {
    margin: '0 16px'
  },
  subFooter: {
    //backgroundColor: 'rgba(0, 0, 0, 0.15)',
    padding: '8px 16px 8px 16px',
    marginTop: '8px'
  },
  footerText: {
    color: '#fff',
    fontSize: '18px',
    lineHeight: 1.5
  },
  invertedBtnDark: {
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px #fff solid',
    boxShadow: 'none',
    margin: '8px'
  },
  white: {
    color: '#ffffff'
  },
  flexContainer: {
    display: 'flex'
  }
})

export default withStyles(styles)(Footer)
