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
    num_of_wrong_words: number;
    num_of_words_to_learn: number;
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

export interface ErrorAddFileMessage {
    status: string;
    error: string;
}

export interface ErrorCreateFileMessage {
    name: string;
}

export interface LoginError {
    username?: string[];
    password?: string[];
    non_field_errors?: string[];
}

export interface CreateComponentError {
    front_side?: string[];
    back_side?: string[];
    non_field_errors?: string[];
}


export interface RegisterError {
    username?: string[];
    email?: string[];
    password?: string[];
    repeat_password?: string[]
    non_field_errors?: string[];
}

export interface CreateDeckError {
    name?: string[]
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
    tokenLoading: boolean;
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

export interface EditLearnWordObject {
    result_type: string,
    level: number
}

export interface PostDeckObject {
    name: string
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

export interface EditModalProps {
    editId: number | null;
    show: boolean;
    setShowEdit: Dispatch<SetStateAction<boolean>>;
    handleSearchWithDeck: () => Promise<void>;
}

export interface CreateDeckModalProps {
    openCreateDeckModal: boolean;
    setOpenCreateDeckModal: Dispatch<SetStateAction<boolean>>;

}

export interface EditWordModalProps {
    editId: number | null;
    show: boolean;
    setShowEdit: Dispatch<SetStateAction<boolean>>;
    refreshDeck: () => Promise<void>;
    handleGetWords: (token: string | null, deck_id: number, search: string | null, pageSize: number) => Promise<void>;
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

export interface PaginationProps {
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
    value: string;
}

export interface InputFieldWithoutFormikProps {
    label: string;
    type: string;
    name: string;
    value: string;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void

}

export interface MessageProps {
    message: string;
}

export interface BackendMessageProps {
    message: string[];
}

export interface GreenButtonProps {
    onClick?: () => void;
    message: string
}

export interface RemoveButtonProps {
    message: string
    id: number
    handleFunc: (id: number) => void

}

export interface CenteredTitleProps {
    title: string
}

export interface MainSearchFieldProps {
    label: string;
    type: string;
    name: string;
    onChange: {
        (e: ChangeEvent<HTMLInputElement>): void;
    }

}

export interface LearnDoneModalInterface {
    showLearnDone: boolean;
    setShowLearnDone: Dispatch<SetStateAction<boolean>>;
}


export interface PaginationButtonProps {
    link: string | null;
    token: string | null;
    message: string;
    setData: Dispatch<unknown>;
}

export interface PaginationButtonReactTableProps {
    onClick: () => void;
    disabled: boolean;
    message: string;
}


export interface PaginationSelectProps {
    pageSize: number;
    handleChange: { (pg_size: string): void };
}

export interface PaginationNumberProps {
    current_page: number,
    total_pages: number
}

export interface LearnObject {
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

interface Time {
    minutes?: number;
    days?: number;
}

interface Flashcard {
    time: Time;
    correct: boolean;
}

export type FlashcardsSet = {
    AGAIN: Flashcard;
    HARD: Flashcard;
    MEDIUM: Flashcard;
    EASY: Flashcard;
}

interface FlagImage {
    url: string;
    full_url: string;
    width: number;
    height: number;
    alt: string;
}

interface LanguageResult {
    id: number;
    title: string;
    language: string;
    flag_image: FlagImage;
    url: string;
    path_slug: string;
}

interface MainGroupResult {
    id: number;
    title: string;
    background_image: FlagImage | null;
    background_image_with_text: FlagImage | null;
    url: string;
    path_slug: string;
    main_description: string;
}

interface SubGroupResult {
    id: number;
    title: string;
    background_image: FlagImage | null;
    background_image_with_text: FlagImage | null;
    url: string;
    path_slug: string;
}

interface GroupExercisesResult {
    id: number;
    title: string;
    background_image: FlagImage | null;
    background_image_with_text: FlagImage | null;
    url: string;
    path_slug: string;
}

interface MainGroupDataChildrens {
    id: number;
    language: string;
    title: string;
    children: MainGroupResult[]

}

interface SubGroupDataChildrens {
    id: number;
    language: string;
    title: string;
    children: SubGroupResult[]

}

interface GroupExerciseDataChildrens {
    id: number;
    language: string;
    title: string;
    children: GroupExercisesResult[]

}

export interface LanguageGroupData {
    type: "LANGUAGE_GROUP";
    data: LanguageResult[];
}

export interface MainGroupData {
    type: "MAIN_GROUP";
    data: MainGroupDataChildrens
}

export interface SubGroupData {
    type: "SUB_GROUP";
    data: SubGroupDataChildrens;
}

export interface GroupExercisesData {
    type: "GROUP_EXERCISES";
    data: GroupExerciseDataChildrens;
}

export interface MatchExerciseData {
    type: "MatchExercise";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}


export interface ChooseExerciseDependsOnMultipleTextsData {
    type: "ChooseExerciseDependsOnMultipleTexts";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface ChooseExerciseDependsOnSingleTextData{
    type: "ChooseExerciseDependsOnSingleText";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface ConjugationExerciseData {
    type: "ConjugationExercise";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface FillInTextExerciseWithChoicesData{
    type: "FillInTextExerciseWithChoices";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface FillInTextExerciseWithChoicesWithImageDecorationData{
    type: "FillInTextExerciseWithChoicesWithImageDecoration";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface FillInTextExerciseWithPredefinedBlocksData{
    type: "FillInTextExerciseWithPredefinedBlocks";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface FlexibleExercisePageData {
    type: "FlexibleExercisePage";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface ListenWithManyOptionsToChooseToSingleExerciseData {
    type: "ListenWithManyOptionsToChooseToSingleExercise";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}
export interface MatchExerciseTextWithImageData{
    type: "MatchExerciseTextWithImage";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface MultipleExercisesData{
    type: "MultipleExercises";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export type Group = LanguageGroupData | MainGroupData | SubGroupData | GroupExercisesData;

export type Exercises = MatchExerciseData | ChooseExerciseDependsOnMultipleTextsData | ChooseExerciseDependsOnSingleTextData |
    ConjugationExerciseData | FillInTextExerciseWithChoicesData | FillInTextExerciseWithChoicesWithImageDecorationData |
    FillInTextExerciseWithPredefinedBlocksData | FlexibleExercisePageData | ListenWithManyOptionsToChooseToSingleExerciseData |
    MatchExerciseTextWithImageData | MultipleExercisesData


export const isLanguageGroup = (group: Group): group is LanguageGroupData => {
    return group.type === "LANGUAGE_GROUP";
};

export const isMainGroup = (group: Group): group is MainGroupData => {
    return group.type === "MAIN_GROUP";
};

export const isSubGroup = (group: Group): group is SubGroupData => {
    return group.type === "SUB_GROUP";
};

export const isGroupExercises = (group: Group): group is GroupExercisesData => {
    return group.type === "GROUP_EXERCISES";
};

export const isMatchExercise = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "MatchExercise"
}
export const isChooseExerciseDependsOnMultipleTexts = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "ChooseExerciseDependsOnMultipleTexts"
}

export const isChooseExerciseDependsOnSingleText = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "ChooseExerciseDependsOnSingleText"
}

export const isConjugationExercise = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "ConjugationExercise"
}

export const isFillInTextExerciseWithChoices = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "FillInTextExerciseWithChoices"
}

export const isFillInTextExerciseWithChoicesWithImageDecoration = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "FillInTextExerciseWithChoicesWithImageDecoration"
}

export const isFillInTextExerciseWithPredefinedBlocks = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "FillInTextExerciseWithPredefinedBlocks"
}
export const isFlexibleExercisePage = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "FlexibleExercisePage"
}
export const isListenWithManyOptionsToChooseToSingleExercise = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "ListenWithManyOptionsToChooseToSingleExercise"
}
export const isMatchExerciseTextWithImage = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "MatchExerciseTextWithImage"
}

export const isMultipleExercises = (exercise: Exercises): exercise is MatchExerciseData => {
    return exercise.type === "MultipleExercises"
}


export interface LanguageGroupProps {
    group: LanguageGroupData;
}

export interface MainGroupProps {
    group: MainGroupData;
}

export interface SubGroupProps {
    group: SubGroupData;
}

export interface GroupExercisesProps {
    group: GroupExercisesData;
}

export interface MatchExerciseProps {
    exercise: MatchExerciseData;
}

export interface ChooseExerciseDependsOnMultipleTextsProps {
    exercise: ChooseExerciseDependsOnMultipleTextsData;
}

export interface ChooseExerciseDependsOnSingleTextProps {
    exercise: ChooseExerciseDependsOnSingleTextData
}

export interface ConjugationExerciseProps{
    exercise: ConjugationExerciseData
}

export interface FillInTextExerciseWithChoicesProps{
    exercise: FillInTextExerciseWithChoicesData
}

export interface FillInTextExerciseWithChoicesWithImageDecorationProps{
    exercise: FillInTextExerciseWithChoicesWithImageDecorationData
}

export interface FillInTextExerciseWithPredefinedBlocksProps{
    exercise: FillInTextExerciseWithPredefinedBlocksData
}

export interface FlexibleExercisePageProps{
    exercise: FlexibleExercisePageData
}

export interface ListenWithManyOptionsToChooseToSingleExerciseProps{
    exercise: ListenWithManyOptionsToChooseToSingleExerciseData
}

export interface MatchExerciseTextWithImageProps{
    exercise: MatchExerciseTextWithImageData
}

export interface MultipleExercisesProps{
    exercise: MultipleExercisesData
}
