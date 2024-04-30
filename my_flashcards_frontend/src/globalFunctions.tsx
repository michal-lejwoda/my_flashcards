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

export const POSSIBLE_RESULTS = [
    {"1": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"minutes": 10}, "correct": false}, "MEDIUM": {"time": {"days": 1}, "correct": true}, "EASY": {"time": {"days": 3}, "correct": true}}},
    {"2": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"minutes": 10}, "correct": false}, "MEDIUM": {"time": {"days": 2}, "correct": true}, "EASY": {"time": {"days": 6}, "correct": true}}},
    {"3": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"days": 1}, "correct": true}, "MEDIUM": {"time": {"days": 3}, "correct": true}, "EASY": {"time": {"days": 9}, "correct": true}}},
    {"4": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"days": 2}, "correct": true}, "MEDIUM": {"time": {"days": 4}, "correct": true}, "EASY": {"time": {"days": 18}, "correct": true}}},
    {"5": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"days": 2}, "correct": true}, "MEDIUM": {"time": {"days": 5}, "correct": true}, "EASY": {"time": {"days": 36}, "correct": true}}},
    {"6": {"AGAIN": {"time": {"minutes": 1}, "correct": false}, "HARD": {"time": {"days": 2}, "correct": true}, "MEDIUM": {"time": {"days": 6}, "correct": true}, "EASY": {"time": {"days": 72}, "correct": true}}},
];
