import React from 'react'
import { TextField } from '@material-ui/core';

export default function DateSelect(props) {

    const { name, label, value } = props

    return (
        <TextField
        label={label}
        name={name}
        variant="outlined"
        value={value}
        type="date"
        InputLabelProps={{
          shrink: true,
        }}
      />
    )
}
