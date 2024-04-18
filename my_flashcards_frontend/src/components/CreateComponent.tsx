import withAuth from "../context/withAuth.tsx";
import AsyncSelect from "react-select/async";
import {createWordForDeck, getDecks} from "../api.tsx";
import {useContext, useState} from "react";
import AuthContext from "../context/AuthContext.tsx";
import {DecksTable} from "../interfaces.tsx";
import {useTranslation} from "react-i18next";

const CreateComponent = () => {
    const {token} = useContext(AuthContext);
    const {t} = useTranslation();
    const [deck, setDeck] = useState<DecksTable | null>(null)
    const [frontSide, setFrontSide] = useState<string>("")
    const [backSide, setBackSide] = useState<string>("")

    const handleAddWord = async () => {
        if (deck !== null) {
            console.log("handleAddWord")
            const json_obj = {
                "front_side": frontSide,
                "back_side": backSide
            }
            await createWordForDeck(deck.id, token, json_obj)
            setFrontSide("")
            setBackSide("")
        }
    }
    const promiseOptions = async (inputValue: string) => {
        const result = await getDecks(token, inputValue, 10)
        return result.results
    }
    const customGetOptionLabel = (option: DecksTable) => option.name;

    const customGetOptionValue = (option: DecksTable) => option.id.toString();

    const handleChange = (newValue: DecksTable | null) => {
        setDeck(newValue);
    };
    return (
        <div>
            <h1>Create Component</h1>
            <AsyncSelect
                cacheOptions
                defaultOptions
                value={deck}
                onChange={handleChange}
                loadOptions={promiseOptions}
                getOptionLabel={customGetOptionLabel}
                getOptionValue={customGetOptionValue}
            />
            <label htmlFor="">{t("front_side")}</label>
            <input type="text" onChange={(e)=>setFrontSide(e.target.value)}/>
            <label htmlFor="">{t("back_side")}</label>
            <input type="text" onChange={(e)=>setBackSide(e.target.value)}/>
            <button onClick={handleAddWord}>{t("add_word")}</button>
        </div>
    );
};

export default withAuth(CreateComponent);
