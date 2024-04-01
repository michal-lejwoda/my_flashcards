import axios from 'axios'

const instance = axios.create();

export async function postLogin(form: FormData) {
    const response = await instance.post(`/api/login`, form);
    return response.data
}

export async function postRegister(form: FormData) {
    const response = await instance.post(`/api/register/`, form);
    return response.data
}

export async function getDecks() {
    const response = await instance.get(`/api/decks/`);
    return response.data
}

export async function createDeck(form: FormData) {
    const response = await instance.post(`/api/decks/`, form);
    return response.data
}

export async function getSingleDeck(id: number) {
    const response = await instance.get(`/api/single_deck/${id}/`);
    return response.data
}

export async function postFile(form: FormData) {
    const response = await instance.post(`/api/file_upload/`, form);
    return response.data
}

export async function getTaskResult(task_id: string) {
    const response = await instance.get(`/api/file_upload/get_task/?task_id=${task_id}`);
    return response.data
}

export async function createDeckFromMultipleDecks(form: FormData) {
    const response = await instance.post(`/api/multiple_decks/`, form);
    return response.data
}

export async function createWordForDeck(id:number, form: FormData) {
    const response = await instance.post(`/api/single_deck/${id}/create_word_for_deck/`, form);
    return response.data
}

export async function deleteWord(id:number) {
    const response = await instance.delete(`/api/word/${id}/`);
    return response.data
}

export async function deleteWordFromDeckOnly(deck_id: number, word_id: number){
    const response = await instance.delete(`/api/single_deck/${deck_id}/delete_word_from_deck/${word_id}/`);
    return response.data
}

export async function searchForWord(str: string){
    const response = await instance.get(`/api/word/?search=${str}`);
    return response.data
}


// export async function getTrainers() {
//     const response = await instance.get(`/api/trainers`);
//     let list_of_elements: array = []
//     for (let i = 0; i < response.data.length; i++) {
//         list_of_elements.push({
//             "id": response.data[i].id,
//             "value": response.data[i].id,
//             "label": response.data[i].name + ' ' + response.data[i].last_name,
//             "name": response.data[i].name,
//             "last_name": response.data[i].last_name,
//         })
//     }
//     return list_of_elements;
// }
