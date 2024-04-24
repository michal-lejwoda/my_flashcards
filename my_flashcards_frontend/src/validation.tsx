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
    new_password: yup.string().oneOf([yup.ref("old_password")], () => i18next.t('passwordsNotMatch'))
})
