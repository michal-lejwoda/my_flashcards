import {TextField} from "@mui/material";
import React from "react";
import {MainSearchFieldProps} from "../../interfaces.tsx";

const MainSearchField: React.FC<MainSearchFieldProps> = ({onChange, label, type, name}) => {
    return (
        <>
            <TextField
                name={name}
                type={type}
                onChange={onChange}
                style={{borderColor: 'white'}}
                id="outlined-basic"
                label={label}
                variant="outlined"
                className="customTextField"
                InputLabelProps={{
                    style: {color: '#fff'},
                }}/>
        </>
    );
};

export default MainSearchField;
