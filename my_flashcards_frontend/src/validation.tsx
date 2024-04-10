import * as yup from "yup";
import i18next from "i18next";

// const polishMessages = {
//     string: {
//         min: "Za krótkie",
//         max: "Za długie",
//         email: "Niepoprawny adres email",
//         oneOf: "Hasła muszą do siebie pasować",
//         required: "To pole jest wymagane"
//     },
// };
//
// const englishMessages = {
//     string: {
//         min: "Too short",
//         max: "Too long",
//         email: "Invalid email address",
//         oneOf: "Passwords must match",
//         required: "Field is required",
//     },
// };
export const validateRegistration = yup.object().shape({
    username: yup.string().min(2, () => i18next.t('usernameTooShort')).max(80, () => i18next.t('usernameTooLong')).required(() => i18next.t('usernameIsRequired')),
    email: yup.string().email(() => i18next.t('emailIsNotCorrect')).required(() => i18next.t('emailIsRequired')),
    password: yup.string().min(5, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
    repeat_password: yup.string().oneOf([yup.ref("password")], () => i18next.t('passwordsNotMatch'))
});

export const validateLogin = yup.object().shape({
    username: yup.string().min(2, () => i18next.t('usernameTooShort')).max(80, () => i18next.t('usernameTooLong')).required(() => i18next.t('usernameIsRequired')),
    password: yup.string().min(5, () => i18next.t('passwordTooShort')).required(() => i18next.t('passwordIsRequired')),
})

// export function setYupLanguage() {
//     const currentLanguage = i18n.language;
//     if (currentLanguage === undefined){
//         yup.setLocale(polishMessages)
//     }
//     else if (currentLanguage === "pl-pl") {
//         yup.setLocale(polishMessages);
//     } else if (currentLanguage === "en") {
//         yup.setLocale(englishMessages);
//     }
// }
// export function setYupLanguageChange(language?: string) {
//     if (language === "pl-pl") {
//         yup.setLocale(polishMessages);
//     } else if (language === "en") {
//         yup.setLocale(englishMessages);
//     }
// }
//
// setYupLanguage()
