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
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_learn": 0, "text": "1 minute"}, "HARD": {"time": {"minutes": 10}, "correct": false, "next_level": 0, "text": "10 minutes"}, "MEDIUM": {"time": {"days": 1}, "correct": true, "next_level": 1, "text": "1 day"}, "EASY": {"time": {"days": 3}, "correct": true, "next_level": 1, "text": "3 days"}},
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_level": 0, "text": "1 minute"}, "HARD": {"time": {"minutes": 10}, "correct": false, "next_level": 0, "text": "10 minutes"}, "MEDIUM": {"time": {"days": 2}, "correct": true, "next_level": 2, "text": "2 days"}, "EASY": {"time": {"days": 6}, "correct": true, "next_level": 2, "text": "6 days"}},
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_level": 1, "text": "1 minute"}, "HARD": {"time": {"days": 1}, "correct": true, "next_level": 2, "text": "1 day"}, "MEDIUM": {"time": {"days": 3}, "correct": true, "next_level": 3, "text": "3 days"}, "EASY": {"time": {"days": 9}, "correct": true, "next_level": 3, "text": "9 days"}},
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_level": 2, "text": "1 minute"}, "HARD": {"time": {"days": 2}, "correct": true, "next_level": 3, "text": "2 days"}, "MEDIUM": {"time": {"days": 4}, "correct": true, "next_level": 4, "text": "4 days"}, "EASY": {"time": {"days": 18}, "correct": true, "next_level": 4, "text": "18 days"}},
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_level": 3, "text": "1 minute"}, "HARD": {"time": {"days": 2}, "correct": true, "next_level": 4, "text": "2 days"}, "MEDIUM": {"time": {"days": 5}, "correct": true, "next_level": 5, "text": "5 days"}, "EASY": {"time": {"days": 36}, "correct": true, "next_level": 5, "text": "36 days"}},
    {"AGAIN": {"time": {"minutes": 1}, "correct": false, "next_level": 4, "text": "1 minute"}, "HARD": {"time": {"days": 2}, "correct": true, "next_level": 5, "text": "2 days"}, "MEDIUM": {"time": {"days": 6}, "correct": true, "next_level": 5, "text": "5 days"}, "EASY": {"time": {"days": 72}, "correct": true, "next_level": 5, "text": "72 days"}},
];
