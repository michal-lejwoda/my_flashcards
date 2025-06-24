import {useTranslation} from "react-i18next";
import "../sass/preview.css"
import AsyncSelect from 'react-select/async';
import withAuth from "../context/withAuth.tsx";
import {getDecks, getDeckWords} from "../api.tsx";
import {DecksTable, WordResponseTable} from "../interfaces.tsx";
import {useContext, useEffect, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import WordTablewithPagination from "../table/WordTablewithPagination.tsx";
import {useLocation} from "react-router-dom";
import EditWordModal from "../modals/EditWordModal.tsx";
import {customStyles} from "../customFunctions.tsx";

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
    const handleOpenEditModal = (id: number) => {
        setEditIt(id)
        setShowEdit(true)
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
        if (deck !== null) {
            handleGetWords(token, deck.id, null, pageSize);
        }
    }, [deck])


    const handleGetWords = async (token: string | null, deck_id: number, search: string | null, pageSize: number) => {
        try {
            const get_decks = await getDeckWords(token, deck_id, search, pageSize)
            setData(get_decks)
        } catch {
            // Blank
        }
    }
    const refreshDeck = async () => {
        if (deck !== null) {
            try {
                const response = await getDeckWords(token, deck.id, null, pageSize)
                setData(response)
            } catch (err: unknown) {
                // Blank
            }
        }
    }

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
                    {/*TODO ADD Logic*/}
                    <button className="greenoutline--button">{t('learn')}</button>
                </div>
            </div>
            {data && data.results && deck &&
                <WordTablewithPagination data={data} token={token}
                                         setData={setData} pageSize={pageSize}
                                         setPageSize={setPageSize}
                                         deck_id={deck.id}
                    // deck_id={location.state.id}
                                         handleGetWords={handleGetWords}
                                         handleOpenEditModal={handleOpenEditModal}
                />

            }
            {editId &&
                <EditWordModal show={showEdit} setShowEdit={setShowEdit} editId={editId}
                               handleGetWords={handleGetWords}
                               refreshDeck={refreshDeck}/>
            }
        </section>
    );
};

export default withAuth(Preview);
