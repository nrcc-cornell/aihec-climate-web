///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';
import { array } from 'prop-types'
import Typography from '@material-ui/core/Typography';

//import Control from 'react-leaflet-control';

// Components

// Styles

var app;

@inject('store') @observer
class NationSelect extends Component {

    static propTypes = {
      names: array,
    }

    static defaultProps = {
      names: [],
    }

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    componentDidMount() {
      this.forceUpdate();
    }

    render() {

        let disabled
        let selectOptions = []
        for (var v of this.props.names) {
            disabled = false
            selectOptions.push({ value: v.name, label: v.name, clearableValue: false, disabled: disabled })
        }
        console.log('selectOptions');
        console.log(selectOptions);

        return (
          <Typography variant="subtitle2">
            <Select
                name="nation"
                className="nation-select"
                placeholder={'NATION > '+app.getNation.name}
                value={app.getNation.name}
                isClearable={false}
                options={selectOptions}
                onChange={app.setSelectedNation}
            /> 
          </Typography>
        );
    }
}

export default NationSelect;
