///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

import React, { Component } from 'react';
import { inject, observer} from 'mobx-react';
import Select from 'react-select';
import { array } from 'prop-types'
import Typography from '@material-ui/core/Typography';
//import Grid from "@material-ui/core/Grid";

// Components

// Styles
//import '../../styles/ToolSelect.css';

var app;

@inject('store') @observer
class ToolSelect extends Component {

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

    render() {

        let disabled
        let toolOptions = []
        for (var v of this.props.names) {
            disabled = false
            toolOptions.push({ value: v.toString(), label: app.getToolInfo(v).title, clearableValue: false, disabled: disabled })
        }

        return (
            <Typography variant="subtitle2">
                <Select
                    name="tool"
                    className="tool-select"
                    placeholder={'TOOL > '+app.getToolInfo(app.getToolName).title}
                    value={app.getToolName}
                    isClearable={false}
                    options={toolOptions}
                    onChange={app.setSelectedToolName}
                /> 
            </Typography>
        );
    }
}

export default ToolSelect;
