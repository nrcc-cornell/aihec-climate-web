import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Select from 'react-select';
import Typography from '@material-ui/core/Typography';

//import '../../styles/OutputSelect.css';

var app;

@inject("store") @observer
class OutputSelect extends Component {

    constructor(props) {
        super(props);
        app = this.props.store.app;
    }

    render() {

        let disabled=false
        let toolOptions = []
        toolOptions.push({ value: 'chart', label: 'Chart', clearableValue: false, disabled: disabled })
        toolOptions.push({ value: 'table', label: 'Table', clearableValue: false, disabled: disabled })

        return (
            <Typography variant="subtitle2">
                <Select
                    name="output"
                    className="output-select"
                    placeholder={'OUTPUT > '+app.getOutputType}
                    value={app.getOutputType}
                    isClearable={false}
                    options={toolOptions}
                    onChange={app.setSelectedOutputType}
                />
            </Typography>
        )
    }

};

export default OutputSelect;
