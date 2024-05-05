export const customStyles = {
        // @ts-expect-error Custom styles
        singleValue: provided => ({
            ...provided,
            color: 'white',
            backgroundColor: '#1c1c1a',
            zIndex: 1,
        }),
        // @ts-expect-error Custom styles
        menu: provided => ({
            ...provided,
            color: 'white',
            backgroundColor: '#1c1c1a',
            zIndex: 2,
        }),
        // @ts-expect-error Custom styles
        placeholder: provided => ({
            ...provided,
            color: 'white',
            zIndex: 1,
        }),
        // @ts-expect-error Custom styles
        control: provided => ({
            ...provided,
            color: 'white',
            backgroundColor: '1c1c1c1c',
            // zIndex: 1
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
            backgroundColor: isSelected ? "DodgerBlue" : isFocused ? "grey" : undefined
        })
    }
