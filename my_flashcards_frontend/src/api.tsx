import axios from 'axios'
import i18n from "i18next";
import {SendDeckData} from "./interfaces.tsx";


const instance = axios.create({
    baseURL: 'http://0.0.0.0:8000',
    headers: {
        'Accept': 'application/json',
    }
});

export async function getUrl(url: string | null, token: string | null) {
    if (url !== null) {
        const currentLanguage = i18n.language;
        const response = await instance.get(url, {
            headers: {
                'Accept-Language': currentLanguage,
                'Authorization': `Token ${token}`
            },
        });
        return response.data
    }
}


export async function postLogin(form: FormData) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/login/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response
}

export async function postRegister(form: FormData) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/register/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function getDecks(token: string | null, search: string | null, page_size: number) {
    const currentLanguage = i18n.language;
    let url = `/api/decks/?page_size=${page_size}`;
    if (search !== null) {
        url = `/api/decks/?search=${search}&page_size=${page_size}`;
    }
    const response = await instance.get(url, {
        headers: {
            'Accept-Language': currentLanguage,
            'Authorization': `Token ${token}`
        },
    });
    return response.data
}

export async function searchWordWithDeck(searchWord: string, token: string| null) {
    const currentLanguage = i18n.language;
    const response = await instance.get(`/api/word/find_word_in_decks/?search=${searchWord}`, {
        headers: {
            'Accept-Language': currentLanguage,
            'Authorization': `Token ${token}`
        },
    });
    return response.data
}

export async function createDeck(form: FormData) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/decks/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function getSingleDeck(id: number) {
    const currentLanguage = i18n.language;
    const response = await instance.get(`/api/single_deck/${id}/`, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function postFile(form: FormData, token: string | null) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/file_upload/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
            'Authorization': `Token ${token}`
        },
    });
    return response.data
}

export async function postDeckWithWords(form: SendDeckData, token: string | null) {
    const currentLanguage = i18n.language;

    const response = await instance.post(`/api/single_deck/create_deck_with_words/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
            'Authorization': `Token ${token}`
        },
    });
    return response.data
}

export async function getTaskResult(task_id: string, token: string | null) {
    const currentLanguage = i18n.language;
    const response = await instance.get(`/api/file_upload/get_task/?task_id=${task_id}`, {
        headers: {
            'Accept-Language': currentLanguage,
            'Authorization': `Token ${token}`
        },
    });
    return response
}

export async function createDeckFromMultipleDecks(form: FormData) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/multiple_decks/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function createWordForDeck(id: number, form: FormData) {
    const currentLanguage = i18n.language;
    const response = await instance.post(`/api/single_deck/${id}/create_word_for_deck/`, form, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function deleteWord(id: number) {
    const currentLanguage = i18n.language;
    const response = await instance.delete(`/api/word/${id}/`, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function deleteWordFromDeckOnly(deck_id: number, word_id: number) {
    const currentLanguage = i18n.language;
    const response = await instance.delete(`/api/single_deck/${deck_id}/delete_word_from_deck/${word_id}/`, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}

export async function searchForWord(str: string) {
    const currentLanguage = i18n.language;
    const response = await instance.get(`/api/word/?search=${str}`, {
        headers: {
            'Accept-Language': currentLanguage,
        },
    });
    return response.data
}
