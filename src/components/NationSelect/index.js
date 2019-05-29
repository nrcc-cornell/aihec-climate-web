///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import { withRouter } from "react-router-dom";
import Select from 'react-select';
import { array } from 'prop-types'
import Typography from '@material-ui/core/Typography';

//import Control from 'react-leaflet-control';

// Components

// Styles
import '../../styles/NationSelect.css';

var app;
var history;

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
        history = this.props.history;
    }

    componentDidMount() {
      this.forceUpdate();
    }

    // run on selection
    onChangeNation = (t) => {
        app.setSelectedNation(t);
        //history.push('/tools');
        history.push(app.getToolInfo(app.getToolName).url);
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
                placeholder={app.getNation.name}
                value={app.getNation.name}
                isClearable={false}
                options={selectOptions}
                onChange={this.onChangeNation}
            /> 
          </Typography>
        );
    }
}

export default withRouter(NationSelect);
