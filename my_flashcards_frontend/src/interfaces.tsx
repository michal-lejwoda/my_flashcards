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


export interface PaginationButtonProps<T> {
    link: string | null;
    token: string | null;
    message: string;
    setData: Dispatch<SetStateAction<T | null>>;
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
    children: GroupExercisesChildrenResult[]
    url: string;
    path_slug: string;
}

interface GroupExercisesChildrenResult {
    id: number;
    title: string;
    url: string;
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
    id: number;
    slug: string
    type: "MatchExercise";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}


export interface ChooseExerciseDependsOnMultipleTextsData {
    id: number;
    slug: string
    type: "ChooseExerciseDependsOnMultipleTexts";
    title: string;
    description: string;
    exercises: ChooseExerciseDependsOnMultipleTextsDataExercises[]
    before_layout_config: [];
    after_layout_config: [];
}

export interface ChooseExerciseDependsOnSingleTextData {
    type: "ChooseExerciseDependsOnSingleText";
    description: string;
    id: number;
    slug: string
    text: string;
    exercises: ChooseExerciseDependsOnSingleTextDataExercises[]
    before_layout_config: [];
    after_layout_config: [];
}

interface ChooseExerciseDependsOnMultipleTextsDataExercises {
    correct_answers: string;
    question: string;
    question_id: string;
    options: [string];
    text: string;
}

interface ChooseExerciseDependsOnSingleTextDataExercises {
    correct_answers: string;
    question: string;
    question_id: string;
    options: [string]
}

interface ConjugationRow {
    person_label: string;
    correct_form: string;
    is_pre_filled: string;
}

export interface ConjugationExerciseData {
    id: number;
    slug: string
    type: "ConjugationExercise";
    instruction: string
    description: string;
    conjugation_rows: ConjugationRow[]
    before_layout_config: [];
    after_layout_config: [];
}

export interface FillInTextExerciseWithChoicesData {
    type: "FillInTextExerciseWithChoices";
    id: number;
    slug: string
    description: string;
    blanks: FillInTextExerciseWithChoicesBlanks[];
    text_with_blanks: string;
    before_layout_config: [];
    after_layout_config: [];
}

export interface FillInTextExerciseWithChoicesBlanks {
    blank_id: number;
    correct_answer: string;
    options: [string]
}

export interface FillInTextExerciseWithPredefinedBlocksDataBlocks {
    blank_id: number;
    answer: string;
}

export interface FillInTextExerciseWithPredefinedBlocksDataCorrectAnswers{
    blank_id: number;
    answer: string;
}

export interface FillInTextExerciseWithChoicesWithImageDecorationData {
    type: "FillInTextExerciseWithChoicesWithImageDecoration";
    id: number;
    slug: string
    description: string;
    blanks: FillInTextExerciseWithChoicesBlanks[];
    text_with_blanks: string;
    before_layout_config: [];
    after_layout_config: [];
    image: string
}

export interface FillInTextExerciseWithPredefinedBlocksData {
    type: "FillInTextExerciseWithPredefinedBlocks";
    id: number;
    slug: string
    description: string;
    blocks: FillInTextExerciseWithPredefinedBlocksDataBlocks[];
    correct_answers: FillInTextExerciseWithPredefinedBlocksDataCorrectAnswers[];
    text_with_blanks: string;
    before_layout_config: [];
    after_layout_config: [];
}

export interface FlexibleExercisePageData {
    id: number;
    slug: string
    type: "FlexibleExercisePage";
    description: string;
    left_items: [string];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface ListenExerciseWithOptionsToChooseData {
    id: number;
    slug: string
    type: "ListenExerciseWithOptionsToChoose"
    audio: string
    description: string;
    exercises: ListenWithManyOptionsToChooseToSingleExerciseDataExercises[]
    before_layout_config: [];
    after_layout_config: [];
}

export interface ListenWithManyOptionsToChooseToSingleExerciseData {
    id: number;
    slug: string
    type: "ListenWithManyOptionsToChooseToSingleExercise";
    description: string;
    audio: string;
    exercises: ListenExerciseWithOptionsToChooseExercises[]
    before_layout_config: [];
    after_layout_config: [];
}

export interface ListenExerciseWithOptionsToChooseExercises {
    correct_answer: string
    options: [string]
    question: string
    question_id: string

}

export interface ListenWithManyOptionsToChooseToSingleExerciseDataExercises {
    correct_answer: [string]
    options: [string]
    question: string
    question_id: string
}

export interface MatchExerciseTextWithImageData {
    id: number;
    slug: string
    type: "MatchExerciseTextWithImage";
    description: string;
    left_items: [LeftItemsWithImageInterface];
    right_items: [string];
    before_layout_config: [];
    after_layout_config: [];
}

export interface LeftItemsWithImageInterface {
    id: string;
    url: string;
}

export interface MatchExerciseWithTextImageSelected {
    left_item: LeftItemsWithImageInterface;
    right_item: string;
}

export interface MultipleExercisesData {
    id: number;
    slug: string
    type: "MultipleExercises";
    exercises: Exercises[];
}

export type Group = LanguageGroupData | MainGroupData | SubGroupData | GroupExercisesData;

export type Exercises =
    MatchExerciseData
    | ChooseExerciseDependsOnMultipleTextsData
    | ChooseExerciseDependsOnSingleTextData
    |
    ConjugationExerciseData
    | FillInTextExerciseWithChoicesData
    | FillInTextExerciseWithChoicesWithImageDecorationData
    |
    FillInTextExerciseWithPredefinedBlocksData
    | FlexibleExercisePageData
    | ListenWithManyOptionsToChooseToSingleExerciseData
    |
    MatchExerciseTextWithImageData
    | MultipleExercisesData
    | ListenExerciseWithOptionsToChooseData


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
export const isChooseExerciseDependsOnMultipleTexts = (exercise: Exercises): exercise is ChooseExerciseDependsOnMultipleTextsData => {
    return exercise.type === "ChooseExerciseDependsOnMultipleTexts"
}

export const isChooseExerciseDependsOnSingleText = (exercise: Exercises): exercise is ChooseExerciseDependsOnSingleTextData => {
    return exercise.type === "ChooseExerciseDependsOnSingleText"
}

export const isConjugationExercise = (exercise: Exercises): exercise is ConjugationExerciseData => {
    return exercise.type === "ConjugationExercise"
}

export const isFillInTextExerciseWithChoices = (exercise: Exercises): exercise is FillInTextExerciseWithChoicesData => {
    return exercise.type === "FillInTextExerciseWithChoices"
}

export const isFillInTextExerciseWithChoicesWithImageDecoration = (exercise: Exercises): exercise is FillInTextExerciseWithChoicesWithImageDecorationData => {
    return exercise.type === "FillInTextExerciseWithChoicesWithImageDecoration"
}

export const isFillInTextExerciseWithPredefinedBlocks = (exercise: Exercises): exercise is FillInTextExerciseWithPredefinedBlocksData => {
    return exercise.type === "FillInTextExerciseWithPredefinedBlocks"
}
export const isFlexibleExercisePage = (exercise: Exercises): exercise is FlexibleExercisePageData => {
    return exercise.type === "FlexibleExercisePage"
}
export const isListenWithManyOptionsToChooseToSingleExercise = (exercise: Exercises): exercise is ListenWithManyOptionsToChooseToSingleExerciseData => {
    return exercise.type === "ListenWithManyOptionsToChooseToSingleExercise"
}
export const isMatchExerciseTextWithImage = (exercise: Exercises): exercise is MatchExerciseTextWithImageData => {
    return exercise.type === "MatchExerciseTextWithImage"
}

export const isMultipleExercises = (exercise: Exercises): exercise is MultipleExercisesData => {
    return exercise.type === "MultipleExercises"
}

export const isListenExerciseWithOptionsToChoose = (exercise: Exercises): exercise is ListenExerciseWithOptionsToChooseData => {
    return exercise.type === "ListenExerciseWithOptionsToChoose"
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
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface ChooseExerciseDependsOnMultipleTextsProps {
    exercise: ChooseExerciseDependsOnMultipleTextsData;
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface ChooseExerciseDependsOnSingleTextProps {
    exercise: ChooseExerciseDependsOnSingleTextData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface ConjugationExerciseProps {
    exercise: ConjugationExerciseData;
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface FillInTextExerciseWithChoicesProps {
    exercise: FillInTextExerciseWithChoicesData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface FillInTextExerciseWithChoicesWithImageDecorationProps {
    exercise: FillInTextExerciseWithChoicesWithImageDecorationData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface FillInTextExerciseWithPredefinedBlocksProps {
    exercise: FillInTextExerciseWithPredefinedBlocksData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface FlexibleExercisePageProps {
    exercise: FlexibleExercisePageData
}

export interface ListenWithManyOptionsToChooseToSingleExerciseProps {
    exercise: ListenWithManyOptionsToChooseToSingleExerciseData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface ListenExerciseWithOptionsToChooseProps {
    exercise: ListenExerciseWithOptionsToChooseData
    id: number | undefined;
    slug: string | undefined
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface MatchExerciseTextWithImageProps {
    exercise: MatchExerciseTextWithImageData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

export interface MultipleExercisesProps {
    exercise: MultipleExercisesData
    id: number | undefined;
    slug: string | undefined;
    onScore: (exerciseId: string, score: number, max_score: number) => void;
}

type AnswerPair = {
    left_item: string;
    right_item: string;
};

type AnswerWithImagePair = {
    left_item: number;
    right_item: string;
}

export type ConjugationExerciseAnswer = {
    "person_label": string;
    "answer": string
}

export interface ChooseExerciseDependsOnSingleTextAnswer {
    question_id: string;
    answer: string;
}

export interface ChooseExerciseDependsOnMultipleTextAnswer {
    question_id: string;
    answers: string[];
}


export interface FillInTextExerciseWithChoicesAnswer {
    blank_id: number;
    answer: string;
}

export type AnswersPayload = {
    answers: AnswerPair[];
};

export type AnswerMatchExerciseWithImagePayload = {
    answers: AnswerWithImagePair[]
}
export type AnswerConjugationExercisePayload = {
    answers: ConjugationExerciseAnswer[]
}

export type AnswerChooseExerciseDependsOnSingleTextPayload = {
    answers: ChooseExerciseDependsOnSingleTextAnswer[]
}

export type AnswerFillInTextExerciseWithChoicesPayload = {
    answers: FillInTextExerciseWithChoicesAnswer[]
}

export type AnswerListenWithManyOptionsToChooseToSingleExercisePayload = {
    answers: ChooseExerciseDependsOnMultipleTextAnswer[]
}

export interface MatchExerciseResultAnswers {
    left_item: string
    right_item: string
    correct: boolean
}

export interface ChooseExerciseDependsOnSingleTextAnswersResponseResultAnwers {
    person_label: string
    provided_answer: string
    correct_answer: string
    correct: boolean
}

export interface FillInTextExerciseWithChoicesResultAnswers {
    blank_id: number
    provided_answer: string
    correct_answer: string
    correct: boolean
}

export interface FillInTextExerciseWithPredefinedBlocksResultAnswers {
    block_id: number
    provided_answer: string
    correct_answer: string
    correct: boolean
}

export interface ListenWithManyOptionsToChooseToSingleExerciseResultAnswers {
    person_label: string
    provided_answers: string[]
    correct_answer: string[]
    correct: boolean
}

export interface MatcheExerciseTextWithImageResultAnswers {
    left_item: number
    right_item: string
    correct: boolean
}

export interface MatchExerciseAnswerResponse {
    score: number
    max_score: number
    result_answers: MatchExerciseResultAnswers[]
}


export interface ChooseExerciseDependsOnSingleTextAnswersResponse {
    score: number
    max_score: number
    result_answers: ChooseExerciseDependsOnSingleTextAnswersResponseResultAnwers[]
}

export interface FillInTextExerciseWithChoicesAnswersResponse {
    score: number
    max_score: number
    result_answers: FillInTextExerciseWithChoicesResultAnswers[]
}

export interface FillInTextExerciseWithPredefinedBlocksResponse {
    score: number
    max_score: number
    result_answers: FillInTextExerciseWithPredefinedBlocksResultAnswers[]
}

export interface ListenWithManyOptionsToChooseToSingleExerciseAnswersResponse {
    score: number
    max_score: number
    result_answers: ListenWithManyOptionsToChooseToSingleExerciseResultAnswers[]
}

export interface MatcheExerciseTextWithImageResponse {
    score: number
    max_score: number
    result_answers: MatcheExerciseTextWithImageResultAnswers[]
}

export interface ResultAnswer {
    person_label: string;
    provided_answer: string | null;
    correct_answer: string;
    correct: boolean;
}

export interface ResultData {
    score: number;
    max_score: number;
    result_answers: ResultAnswer[];
}

export interface ResultAnswerWithBlankId {
    blank_id: number;
    provided_answer: string | null;
    correct_answer: string;
    correct: boolean;
}

export interface ResultAnswerWithManyOptions{
    person_label: string;
    provided_answer: [];
    correct_answer: [];
    correct: boolean;
}

export interface ResultDataWithManyOptions{
    score: number;
    max_score: number;
    result_answers: ResultAnswerWithManyOptions[];
}

export interface ResultDataWithBlankId {
    score: number;
    max_score: number;
    result_answers: ResultAnswerWithBlankId[];
}
