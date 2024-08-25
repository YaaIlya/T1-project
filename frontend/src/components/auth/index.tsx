import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './login';
import RegisterPage from './register';
import './style.scss';
import { Box } from '@mui/material';
import axios from 'axios';
import { useAppDispatch } from '../../utils/hook';
import { login } from '../store/slice/auth';
import { AppErrors } from '../common/errors';

const AuthRootComponent: React.FC = (): JSX.Element => {
    const [email, setEmail] = useState<string | undefined>(undefined);
    const [password, setpassword] = useState<string | undefined>(undefined);
    const [repeatPassword, setRepeatPassword] = useState<string | undefined>(undefined);
    const [firstName, setFirstName] = useState<string | undefined>(undefined);
    const [surname, setLastName] = useState<string | undefined>(undefined);
    const [username, setUserName] = useState<string | undefined>(undefined);
    const [patronymic, setPatronymic] = useState<string | undefined>(undefined);
    const [gender, setGender] = useState<string | undefined>(undefined);
    const [birthDate, setBirthDate] = useState<string | undefined>(undefined);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null); // Состояние для хранения сообщения об ошибке
    const [adminPassword, setAdminPassword] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsAdmin(event.target.checked);
    };

    const handleRegisterClick = () => {
        navigate('/register');
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        setError(null); // Сбрасываем ошибку перед новым запросом

        // Создаем объект с данными пользователя
        const userData: any = { username, password };

        if (isAdmin) {
            userData.adminPassword = adminPassword;
        }

        try {
            if (location.pathname === '/login') {
                // Отправляем запрос на сервер для проверки пользователя
                const response = await axios.post("http://localhost:8080/api/auth/login", userData);
                const user = response.data;

                // Сохранение токена в localStorage
                const token = user.Token;
                localStorage.setItem('token', token);

                await dispatch(login(user));

                // Проверяем, является ли пользователь администратором
                if (isAdmin && user.isAdmin) {
                    navigate('/admin-dashboard');
                } else {
                    navigate('/home');
                }
            } else if (location.pathname === '/register') {
                // Проверяем совпадение паролей
                if (password === repeatPassword) {
                    // Отправляем запрос на сервер для регистрации пользователя
                    const userData = {
                        firstName,
                        surname,
                        username,
                        email,
                        password,
                        gender,
                        birthDate,
                        patronymic
                    };
                    const response = await axios.post("http://localhost:8080/api/auth/registration", userData);
                    const newUser = response.data;

                    // Сохранение токена в localStorage
                    const token = newUser.token;
                    localStorage.setItem('token', token);

                    await dispatch(login(newUser));
                    navigate('/home');
                } else {
                    setError(AppErrors.PasswordDoNotMatch);
                }
            }
        } catch (e: any) {
            // Обработка ошибок и установка сообщения об ошибке
            setError('Неверное имя пользователя или пароль.');
            console.error(e);
        }
    };


    return (
        <div className='root'>
            <form className='form' onSubmit={handleSubmit}>
                <Box className="mainBox">
                    {location.pathname === '/login' ? (
                        <LoginPage
                            setUserName={setUserName}
                            setpassword={setpassword}
                            setAdminPassword={setAdminPassword}
                            isAdmin={isAdmin}
                            handleCheckboxChange={handleCheckboxChange}
                            handleRegisterClick={handleRegisterClick}

                        />
                    ) : location.pathname === '/register' ? (
                        <RegisterPage
                            setEmail={setEmail}
                            setPassword={setpassword}
                            setRepeatPassword={setRepeatPassword}
                            setFirstName={setFirstName}
                            setLastName={setLastName}
                            setUserName={setUserName}
                            setGender={setGender}
                            setBirthDate={setBirthDate}
                            setPatronymic={setPatronymic}
                        />
                    ) : null}
                    {error && <div className='error-message'>{error}</div>}
                </Box>
            </form>
        </div>
    );
};

export default AuthRootComponent;
