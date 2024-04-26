import {TextField} from "@mui/material";
import React from "react";
import {InputFieldWithoutFormikProps} from "../../interfaces.tsx";

const InputFieldWithoutFormik: React.FC<InputFieldWithoutFormikProps> = ({handleChange, label, type, name, value}) => {
    return (
            <TextField
                name={name}
                type={type}
                value={value}
                onChange={handleChange}
                style={{borderColor: 'white'}}
                id="outlined-basic"
                label={label}
                variant="outlined"
                className="customTextField"
                InputLabelProps={{
                    style: {color: '#fff'},
                }}/>
    );
};

export default InputFieldWithoutFormik;
