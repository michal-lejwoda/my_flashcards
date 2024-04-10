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

export interface ErrorResponse {
    response: {
        data: Record<string, unknown>;
    };
}

export interface LoginError {
    username?: string[];
    password?: string[];
    non_field_errors?: string[];
}

export interface RegisterError {
    username?: string[];
    email?: string[];
    password?: string[];
    repeat_password?: string[]
    non_field_errors?: string[];
}

