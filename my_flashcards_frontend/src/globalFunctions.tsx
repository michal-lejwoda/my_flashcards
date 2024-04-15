import {getUrl} from "./api.tsx";
import {DecksResponseTable, ErrorResponse} from "./interfaces.tsx";
import {Dispatch, SetStateAction} from "react";

export const handleGoToUrl = async (url: string | null, token: string | null, setData:  Dispatch<SetStateAction<DecksResponseTable | null>>) => {
        try {
            const url_data = await getUrl(url, token)
            setData(url_data)
        } catch (err: unknown) {
            const error = err as ErrorResponse
            console.log("error")
            console.log(error)
        }
    }
