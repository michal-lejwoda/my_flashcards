export interface Language {
    code: string;
    label: string;
}

export interface DecksTable {
    id: number;
    name: string;
    slug: string;
    learn: number;
    correct: number;
    wrong: number;
    all: number;
}

export interface LoginValues {
    username: string,
    password: string,
}

export interface RegisterValues {
    username: string,
    email: string,
    password: string,
    repeat_password: string
}
