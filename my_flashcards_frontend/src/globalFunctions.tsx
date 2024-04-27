import {getUrl} from "./api.tsx";
import {ErrorResponse} from "./interfaces.tsx";
import {Dispatch, SetStateAction} from "react";

export async function handleGoToUrl<T>(url: string | null, token: string | null, setData: Dispatch<SetStateAction<T>>): Promise<void> {
    try {
        const url_data = await getUrl(url, token);
        setData(url_data);
    } catch (err: unknown) {
        const error = err as ErrorResponse;
        console.log("error");
        console.log(error);
    }
}
