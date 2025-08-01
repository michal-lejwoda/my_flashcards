export const customStyles = {
    // @ts-expect-error Custom styles
    singleValue: provided => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: 'transparent',
        zIndex: 1,
    }),
    // @ts-expect-error Custom styles
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? '#e9edc9' : '#ccd5ae',
        '&:hover': {
            color: '#b8865e',
        },
    }),
    // @ts-expect-error Custom styles
    noOptionsMessage: (provided) => ({
        ...provided,
        color: '#e9edc9',
        backgroundColor: 'transparent',
        padding: 10,
        fontStyle: 'italic',
        textAlign: 'center',
    }),
    // @ts-expect-error Custom styles
    loadingMessage: (provided) => ({
        ...provided,
        color: '#e9edc9',
        backgroundColor: 'transparent',
        padding: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    }),
    // @ts-expect-error Custom styles
    loadingIndicator: (provided) => ({
        ...provided,
        color: '#e9edc9',
    }),

    // @ts-expect-error Custom styles
    menu: provided => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: '#d4a373',
        zIndex: 2,
    }),
    // @ts-expect-error Custom styles
    placeholder: provided => ({
        ...provided,
        color: '#faedcd',
        zIndex: 1,
    }),
    // @ts-expect-error Custom styles
    control: (provided, state) => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: 'transparent',
        borderColor: state.isFocused ? '#ccd5ae' : '#ccd5ae',
        boxShadow: state.isFocused ? '0 0 0 1px #e9edc9' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#e9edc9' : '#e9edc9',
        }
    }),
    // @ts-expect-error Custom styles
    input: provided => ({
        ...provided,
        color: 'white',
        // backgroundColor: 'black',
        // zIndex: 1
    }),
    // @ts-expect-error Custom styles
    option: (base, {isFocused, isSelected}) => ({
        ...base,
        zIndex: 1,
        backgroundColor: isSelected ? "#b8865e" : isFocused ? "#cb9e6c" : undefined
    })
}

export const customStyleforFillTextWithChoices = {
    // @ts-expect-error Custom styles

    singleValue: provided => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: 'transparent',
        zIndex: 1,
    }),
    // @ts-expect-error Custom styles
    dropdownIndicator: (provided, state) => ({
        ...provided,
        color: state.isFocused ? '#e9edc9' : '#ccd5ae',
        '&:hover': {
            color: '#b8865e',
        },
    }),
    // @ts-expect-error Custom styles
    noOptionsMessage: (provided) => ({
        ...provided,
        color: '#e9edc9',
        backgroundColor: 'transparent',
        padding: 10,
        fontStyle: 'italic',
        textAlign: 'center',
    }),
    // @ts-expect-error Custom styles
    loadingMessage: (provided) => ({
        ...provided,
        color: '#e9edc9',
        backgroundColor: 'transparent',
        padding: 10,
        textAlign: 'center',
        fontStyle: 'italic',
    }),
    // @ts-expect-error Custom styles
    loadingIndicator: (provided) => ({
        ...provided,
        color: '#e9edc9',
    }),

    // @ts-expect-error Custom styles
    menu: provided => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: '#d4a373',
        zIndex: 100,
    }),
    // @ts-expect-error Custom styles
    placeholder: provided => ({
        ...provided,
        color: '#faedcd',
        zIndex: 1,
    }),
    // @ts-expect-error Custom styles
    control: (provided, state) => ({
        ...provided,
        color: '#faedcd',
        backgroundColor: 'transparent',
        borderColor: state.isFocused ? '#ccd5ae' : '#ccd5ae',
        width: 'auto',
        minWidth: '100px',
        fontSize: '1rem',
        boxShadow: state.isFocused ? '0 0 0 1px #e9edc9' : 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#e9edc9' : '#e9edc9',
        }
    }),
    // @ts-expect-error Custom styles
    container: (provided) => ({
        ...provided,
        width: 'auto',
        display: 'inline-block',
        verticalAlign: 'middle',
        margin: '0 0.3rem 0.2rem 0.3rem',
    }),
    // @ts-expect-error Custom styles
    input: provided => ({
        ...provided,
        color: '#faedcd',

    }),
    // @ts-expect-error Custom styles
    option: (base, {isFocused, isSelected}) => ({
        ...base,
        zIndex: 100,
        fontSize: '1rem',
        backgroundColor: isSelected ? "#b8865e" : isFocused ? "#cb9e6c" : undefined
    })
}

