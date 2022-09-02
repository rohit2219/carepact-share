import React from 'react'
import { TextField } from '@material-ui/core';

export default function Input(props) {

    const { name, label, value,error=null, onChange } = props;
    return (
        <TextField
            variant="outlined"
            label={label}
            name={name}
            value={value}
            size="small"
            multiline
            rows={5}
            rowsMax={4}
            onChange={onChange}
            {...(error && {error:true,helperText:error})}
        />
        
    )
}
