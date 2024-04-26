import * as React from "react";
import {ChangeEvent, Dispatch, FormEvent, ReactNode, SetStateAction} from "react";

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


export interface WordTable {
    id: number;
    front_side: string;
    back_side: string;
    is_correct: boolean;
    next_learn: string;
    user: number;
    level: number;
}


export interface DeckWithName {
    id: number,
    name: string
}

export interface SearchWordsTable {
    id: number;
    front_side: string,
    back_side: string,
    deck_words: DeckWithName[]

}

export interface SearchWordsResponseTable {
    links: {
        next: string | null;
        previous: string | null;
        last_page_link: string;
        first_page_link: string;
    };
    count: number;
    current_page: number;
    total_pages: number;
    results: SearchWordsTable[]
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

export interface WordResponseTable {
    links: {
        next: string | null;
        previous: string | null;
        last_page_link: string;
        first_page_link: string;
    };
    count: number;
    current_page: number;
    total_pages: number;
    results: WordTable[];
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

export interface ChangeEmailError {
    email?: string[];
    password?: string[];
}

export interface ChangePasswordError {
    old_password?: string[];
    new_password?: string[];
}

export interface deleteUserError {
    password?: string[];

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

export interface SearchTableProps {
    data: SearchWordsResponseTable
    token: string | null
    setData: Dispatch<SetStateAction<SearchWordsResponseTable | null>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    // setEditIt: Dispatch<SetStateAction<number | null>>
    // handleOpenEditModal: void
    handleOpenEditModal: (id: number) => void
    handleSearchWithDeck: () => Promise<void>
}

export interface SingleWordObject {
    id: number,
    created: string,
    modified: string,
    front_side: string,
    back_side: string,
    is_correct: boolean,
    next_learn: string,
    level: number,
    user: number

}

export interface EditWordObject {
    front_side: string,
    back_side: string
}

export interface DecksTablewithPaginationProps {
    data: DecksResponseTable
    token: string | null
    setData: Dispatch<SetStateAction<DecksResponseTable | null>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    handleGetDecks: (token: string | null, search: string | null, pageSize: number) => Promise<void>;
}

export interface WordTablewithPaginationProps {
    data: WordResponseTable
    token: string | null
    setData: Dispatch<SetStateAction<WordResponseTable | null>>
    pageSize: number
    setPageSize: Dispatch<SetStateAction<number>>
    deck_id: number,
    handleGetWords: (token: string | null, deck_id: number, search: string | null, pageSize: number) => Promise<void>;
    handleOpenEditModal: (id: number) => void
    // setEditIt: Dispatch<SetStateAction<number | null>>
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

// TODO Modify interface lated
export interface EditModalProps {
    editId: number | null;
    show: boolean;
    setShowEdit: Dispatch<SetStateAction<boolean>>;
    handleSearchWithDeck: () => Promise<void>;
}

export interface EditWordModalProps {
    editId: number | null;
    show: boolean;
    setShowEdit: Dispatch<SetStateAction<boolean>>;
    refreshDeck: () => Promise<void>;
}

export interface ChangeEmailData {
    email: string;
    password: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
}

export interface handleSendMailWithResetPasswordData {
    email: string
}

export interface DeleteAccountProps {
    showDeleteModal: boolean;
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}

export interface ChangePasswordProps {
    setShowDeleteModal: Dispatch<SetStateAction<boolean>>;
}

export interface handleDeleteUserData {
    password: string;
}

export interface CenteredFormProps {
    handleSubmit: (e?: (FormEvent<HTMLFormElement> | undefined)) => void
    children: ReactNode
}

export interface InputFieldProps {
    label: string;
    type: string;
    name: string;
    handleChange: {
        (e: React.ChangeEvent<unknown>): void;
        <T_1 = string | React.ChangeEvent<unknown>>(field: T_1): T_1 extends React.ChangeEvent<unknown> ? void : (e: string | React.ChangeEvent<unknown>) => void;
    };
}

export interface MessageProps{
    message: string;
}

export interface BackendMessageProps{
    message: string[];
}
export interface GreenButtonProps{
    message: string
}

export interface CenteredTitleProps{
    title: string
}

export interface MainSearchFieldProps{
    label: string;
    type: string;
    name: string;
    onChange: {
        (e: ChangeEvent<HTMLInputElement>): void;
    }

}
