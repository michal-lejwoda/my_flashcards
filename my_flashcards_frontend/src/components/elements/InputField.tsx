import {TextField} from "@mui/material";
import React from "react";
import {InputFieldProps} from "../../interfaces.tsx";

const InputField: React.FC<InputFieldProps> = ({handleChange, label, type, name}) => {
    return (
        <div className="account__form--textfield change_password__form--textfield">
            <TextField
                name={name}
                type={type}
                onChange={handleChange}
                style={{borderColor: 'white'}}
                id="outlined-basic"
                label={label}
                variant="outlined"
                className="customTextField"
                InputLabelProps={{
                    style: {color: '#fff'},
                }}/>
        </div>
    );
};

export default InputField;