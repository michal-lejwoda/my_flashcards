import * as yup from "yup";
export const validateRegistration = yup.object().shape({
    name: yup.string().min(2, "Imię jest za krótkie").max(80, "Imię jest za długie"),
    email: yup.string().email("Adres email jest niepoprawny").required("Email jest wymagany"),
    password: yup.string().min(5, "Hasło jest za krótkie").required("Hasło jest wymagane"),
    repeat_password: yup.string().oneOf([yup.ref("password")], "Hasła muszą do siebie pasować")
});

export const validateLogin = yup.object().shape({
    username: yup.string().min(2, "Username jest za krótkie").max(80, "Username jest za długie"),
    password: yup.string().min(5, "Hasło jest za krótkie").required("Hasło jest wymagane"),
})
