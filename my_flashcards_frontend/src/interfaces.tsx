import {Dispatch, ReactNode, SetStateAction} from "react";

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

export interface DecksResponseTable {
  links: {
    next: string | null;
    previous: string | null;
    last_page_link: string;
    first_page_link: string;
  };
  count: number;
  current_page: number;
  total_pages: number;
  results: DecksTable[];
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

export interface Children {
    children: ReactNode;
}

export interface AuthContextType {
    token: string | null;
    setToken: Dispatch<SetStateAction<string | null>>;
}

export interface Response {
    status: number;
    data: {
        message: {
            status: string;
            result: FileRowData[];
        };
    };
}

export interface PropsFileData {
    fileData: FileRowData[];
    setFileData: Dispatch<SetStateAction<FileRowData[] | null>>
    pagination: { pageIndex: number, pageSize: number }
    setPagination: Dispatch<SetStateAction<{ pageIndex: number, pageSize: number }>>
}
export interface DecksTablewithPaginationProps{
    data: DecksResponseTable
    token: string | null
    setData: Dispatch<SetStateAction<DecksResponseTable | null>>
    pageSize: number
    setPageSize:  Dispatch<SetStateAction<number>>
    handleGetDecks: (token: string | null, search: string | null, pageSize: number) => Promise<void>;
}

export interface FileRowData {
    id: number;
    front_side: string;
    back_side: string;
}

export interface SendDeckData {
    name: string,
    rows: FileRowData[]
}
