import withAuth from "../context/withAuth.tsx";
import AsyncSelect from "react-select/async";
import {createWordForDeck, getDecks} from "../api.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import {CreateComponentError, DecksTable, ErrorResponse} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";
import GreenButton from "./elements/GreenButton.tsx";
import {useFormik} from "formik";
import InputField from "./elements/InputField.tsx";
import CenteredForm from "./elements/CenteredForm.tsx";
import CenteredTitle from "./elements/CenteredTitle.tsx";
import ErrorMessage from "./elements/errors/ErrorMessage.tsx";
import BackendErrorMessage from "./elements/errors/BackendErrorMessage.tsx";
import {createWordValidation} from "../validation.tsx";
import "../sass/create_word.css"

const CreateComponent = () => {
    const {token} = useContext(AuthContext);
    const {t} = useTranslation();
    const [deck, setDeck] = useState<DecksTable | null>(null)
    const [deckError, setDeckError] = useState<string | null>(null)
    const [createComponentError, setCreateComponentError] = useState<CreateComponentError | null>(null)

    const handleAddWord = async () => {
        if (deck !== null) {
            try {
                await createWordForDeck(deck.id, token, values)
                setDeckError("")
            } catch (err: unknown) {
                const error = err as ErrorResponse
                setCreateComponentError(error.response.data)
            }
        }

    }
    const promiseOptions = async (inputValue: string) => {
        const result = await getDecks(token, inputValue, 10)
        return result.results
    }

    const customGetOptionLabel = (option: DecksTable) => option.name;

    const customGetOptionValue = (option: DecksTable) => option.id.toString();

    const handleChangeDeck = (newValue: DecksTable | null) => {
        setDeck(newValue);
    };
    const {values, handleChange, handleSubmit, errors, resetForm} = useFormik({
        initialValues: {
            front_side: "",
            back_side: "",
        },
        validationSchema: createWordValidation,
        validateOnChange: false,
        onSubmit: () => {
            if (deck !== null) {
                handleAddWord()
                resetForm()
            } else {
                setDeckError(t("choose_deck"))
            }
        },
    });
    const customStyles = {
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
    return (
        <div className="create_word">
            <CenteredTitle title={t("create")}/>
            <div className="create_word__container">
                <CenteredForm handleSubmit={handleSubmit}>

                    <AsyncSelect
                        className="async_select"
                        cacheOptions
                        defaultOptions
                        value={deck}
                        onChange={handleChangeDeck}
                        loadOptions={promiseOptions}
                        getOptionLabel={customGetOptionLabel}
                        getOptionValue={customGetOptionValue}
                        placeholder={t("select_deck")}
                        styles={customStyles}
                    />
                    <div className="errors form__errors">
                        {deckError && (
                            <ErrorMessage message={deckError}/>
                        )}
                    </div>


                    <div className="">
                        <div className="account__form--textfield">
                            <InputField label={t("front_page")} type="text" name="front_side"
                                        handleChange={handleChange}/>
                            <div className="errors form__errors">
                                {errors.front_side && <ErrorMessage message={errors.front_side}/>}
                                {createComponentError && createComponentError.front_side && (
                                    <BackendErrorMessage message={createComponentError.front_side}/>
                                )}
                            </div>
                        </div>
                        <div className="account__form--textfield">
                            <InputField label={t("reverse_page")} type="text" name="front_side"
                                        handleChange={handleChange}/>
                            <div className="errors form__errors">
                                {errors.back_side && <ErrorMessage message={errors.back_side}/>}
                                {createComponentError && createComponentError.back_side && (
                                    <BackendErrorMessage message={createComponentError.back_side}/>
                                )}
                                {createComponentError && createComponentError.non_field_errors && (
                                    <BackendErrorMessage message={createComponentError.non_field_errors}/>
                                )}
                            </div>
                        </div>
                        <div className="account__button">
                            <GreenButton message={t("add_word")}/>
                        </div>
                    </div>
                </CenteredForm>
            </div>
        </div>
    );
};

export default withAuth(CreateComponent);
