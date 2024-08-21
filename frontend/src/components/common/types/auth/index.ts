export interface IPropsLogin {
    setpassword: (value: string) => void;
    setUserName: (value: string) => void;
    isAdmin: boolean;
    handleCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleRegisterClick: () => void;
}

export interface IPropsRegister {
    setPassword: (value: string) => void;
    setEmail: (value: string) => void;
    setRepeatPassword: (value: string) => void;
    setFirstName: (value: string) => void;
    setLastName: (value: string) => void;
    setUserName: (value: string) => void;
    setGender: (value: string) => void;
    setBirthDate: (value: string) => void;
    setPatronymic: (value: string) => void;
}

export interface IAuthState {
    user: {} | IPublicUser,
    isLogged: boolean,

}

export interface IPublicUser {
    surname: string,
    firstName: string,
    patronymic: string,
    username: string,
    password: string,
    email: string

}