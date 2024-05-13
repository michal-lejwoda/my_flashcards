import * as yup from "yup";
import i18next from "i18next";

export const validateRegistration = yup.object().shape({
    username: yup.string().min(2, () => i18next.t('usernameTooShort')).max(80, () => i18next.t('usernameTooLong')).required(() => i18next.t('usernameIsRequired')),
    email: yup.string().email(() => i18next.t('emailIsNotCorrect')).required(() => i18next.t('emailIsRequired')),
    password: yup.string().min(4, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
    repeat_password: yup.string().oneOf([yup.ref("password")], () => i18next.t('passwordsNotMatch'))
});

export const validateLogin = yup.object().shape({
    username: yup.string().min(2, () => i18next.t('usernameTooShort')).max(80, () => i18next.t('usernameTooLong')).required(() => i18next.t('usernameIsRequired')),
    password: yup.string().min(4, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
})

export const changeEmailValidation = yup.object().shape({
    email: yup.string().email(() => i18next.t('emailIsNotCorrect')).required(() => i18next.t('emailIsRequired')),
    password: yup.string().min(4, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
})

export const changePasswordValidation = yup.object().shape({
    old_password: yup.string().min(4, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
    new_password: yup.string().min(4, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
})

export const changeResetPasswordValidation = yup.object().shape({
    email: yup.string().email(() => i18next.t('emailIsNotCorrect')).required(() => i18next.t('emailIsRequired')),
})

export const createWordValidation = yup.object().shape({
    front_side: yup.string().min(2, () => i18next.t('field_at_least_2')).max(200, () => i18next.t('field_max_200')).required(() => i18next.t('fieldIsRequired')),
    back_side: yup.string().min(2, () => i18next.t('field_at_least_2')).max(200, () => i18next.t('field_max_200')).required(() => i18next.t('fieldIsRequired')),
})

export const changeCreateDataFromFileValidation = yup.object().shape({
    deck: yup.string().min(2, () => i18next.t('field_at_least_2')).max(200, () => i18next.t('field_max_200')).required(() => i18next.t('fieldIsRequired')),
})

export const createDeckValidation = yup.object().shape({
    name: yup.string().min(2, () => i18next.t('field_at_least_2')).max(200, () => i18next.t('field_max_200')).required(() => i18next.t('fieldIsRequired')),
})
