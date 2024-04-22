import {useTranslation} from "react-i18next";
import "../sass/preview.css"
import AsyncSelect from 'react-select/async';
import withAuth from "../context/withAuth.tsx";
import {getDecks, getDeckWords} from "../api.tsx";
import {DecksTable, ErrorResponse, WordResponseTable} from "../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import WordTablewithPagination from "../table/WordTablewithPagination.tsx";
import {useLocation} from "react-router-dom";
import EditWordModal from "../modals/EditWordModal.tsx";

const Preview = () => {
    const location = useLocation();
    const {t} = useTranslation();
    const {token} = useContext(AuthContext);
    const [deck, setDeck] = useState<DecksTable | null>(null)
    const [data, setData] = useState<WordResponseTable | null>(null)
    const [pageSize, setPageSize] = useState(10)
    const [editId, setEditIt] = useState<number | null>(null)
    const [showEdit, setShowEdit] = useState(false)
    const promiseOptions = async (inputValue: string) => {
        const result = await getDecks(token, inputValue, 10)
        return result.results
    }
    const customGetOptionLabel = (option: DecksTable) => option.name

    const customGetOptionValue = (option: DecksTable) => option.id.toString();

    const handleChange = (newValue: DecksTable | null) => {
        setDeck(newValue);
    };

    useEffect(() => {
        if (location.state.deck) {
            setDeck(location.state.deck)
        }
    }, [token])

    useEffect(() => {
        console.log("Second use Effect")
        if (deck !== null) {
            handleGetWords(token, deck.id, null, pageSize);
        }
    }, [deck])


    const customStyles = {
        // @ts-expect-error Custom styles
        singleValue: provided => ({
            ...provided,
            color: 'white',
            zIndex: 1,
        }),
        // @ts-expect-error Custom styles
        placeholder: provided => ({
            ...provided,
            color: 'white',
            zIndex: 1,
        }),
        // @ts-expect-error Custom styles
        input: provided => ({
            ...provided,
            color: 'white',
            // zIndex: 1
        }),
        // @ts-expect-error Custom styles
        option: (base, {isFocused, isSelected}) => ({
            ...base,
            backgroundColor: isSelected ? "DodgerBlue" : isFocused ? "grey" : undefined
        })
    }

    const handleGetWords = async (token: string | null, deck_id: number, search: string | null, pageSize: number) => {
        try {
            const get_decks = await getDeckWords(token, deck_id, search, pageSize)
            console.log("get_decks")
            console.log(get_decks)
            setData(get_decks)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
    const refreshDeck = async () => {
        if (deck !== null) {
        try {
            const response = await getDeckWords(token, deck.id, null, pageSize)
            setData(response)
        } catch (err: unknown) {
            // #TODO Back HEre
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }}


    console.log("deck")
    console.log(deck)

    return (
        <section className="preview">
            <h1 className="title">{t('preview_deck')}</h1>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={deck}
                styles={customStyles}
                placeholder={t("select")}
                onChange={handleChange}
                loadOptions={promiseOptions}
                getOptionLabel={customGetOptionLabel}
                getOptionValue={customGetOptionValue}
            />
            <div className="preview__middle">
                <div className="preview__buttons">
                    <button className="standard-button">{t('learn')}</button>
                </div>
            </div>
            {data && data.results &&
                <WordTablewithPagination data={data} token={token}
                                         setData={setData} pageSize={pageSize}
                                         setPageSize={setPageSize}
                                         deck_id={location.state.id}
                                         handleGetWords={handleGetWords}
                                         setEditIt={setEditIt}
                />

            }
            {editId &&
                <EditWordModal show={showEdit} setShowEdit={setShowEdit} editId={editId}
                               refreshDeck={refreshDeck}/>
            }
        </section>
    );
};

export default withAuth(Preview);
