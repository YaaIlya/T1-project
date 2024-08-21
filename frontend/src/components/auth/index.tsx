import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginPage from './login';
import RegisterPage from './register';
import './style.scss';
import { Box } from '@mui/material';
import { instance } from '../../utils/axios';
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
        if (location.pathname === '/login') {
            try {
                const userData = { username, password };
                const user = await axios.post("http://localhost:8080/auth/login", userData);
                await dispatch(login(user.data))
                navigate('/home');
            } catch (e) {
                return e
            }

        } else if (location.pathname === '/register') {
            if (password === repeatPassword) {
                try {
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
                    const newUser = await axios.post("http://localhost:8080/auth/registration", userData);
                    console.log(newUser.data);
                    await dispatch(login(newUser.data))
                    navigate('/home');
                } catch (e) {
                    console.log(e)
                    return e
                }

            } else {
                throw new Error(AppErrors.PasswordDoNotMatch);
            }
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
                </Box>
            </form>
        </div>
    );
};

export default AuthRootComponent;
