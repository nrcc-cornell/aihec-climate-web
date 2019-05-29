///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import HomeIcon from '@material-ui/icons/Home';

import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/NationPickerLegend.css';
import '../../styles/NationPickerMap.css';

@inject('store') @observer
class NationPickerButtonFlyTo extends Component {

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        if (this.props.loc!=='Home') {

            return (
                <Control position={this.props.pos}>
                    <Button variant="contained" color="inherit" size="small" onClick={this.props.onclick}>
                      {"To "+this.props.loc}
                    </Button>
                </Control>
            );

        } else {

            return (
                <Control position={this.props.pos}>
                    <button
                        className="map-home-button"
                        onClick={this.props.onclick}
                    >
                        <HomeIcon />
                    </button>
                </Control>
            );

        }
    }
}

export default NationPickerButtonFlyTo;
