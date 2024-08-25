import { Button, TextField, Typography, Checkbox, Box, FormControlLabel } from '@mui/material';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { IPropsLogin } from '../../common/types/auth';

const LoginPage: React.FC<IPropsLogin> = (props: IPropsLogin): JSX.Element => {
    const { setpassword, setUserName, isAdmin, handleCheckboxChange, handleRegisterClick, setAdminPassword } = props;
    return (
        <div >
            <Typography variant="h4" fontFamily='Inter' textAlign='left' marginBottom={3}>Авторизация</Typography>
            <TextField fullWidth={true} margin='normal' label="UserName" variant="outlined" placeholder='Введите ваш UserName' onChange={(e) => setUserName(e.target.value)} />
            <TextField type='password' fullWidth={true} margin='normal' label="Пароль" variant="outlined" placeholder='Введите ваш пароль' onChange={(e) => setpassword(e.target.value)} />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                    control={<Checkbox checked={isAdmin} onChange={handleCheckboxChange} />}
                    label="Администратор"
                    sx={{ marginRight: 2 }}
                />
                <TextField
                    margin='normal'
                    type='password'
                    label="Пароль"
                    variant="outlined"
                    placeholder='Введите пароль админа'
                    sx={{ flexGrow: 1 }}
                    disabled={!isAdmin}
                    onChange={(e) => setAdminPassword(e.target.value)}
                />
            </Box>

            <Button type="submit" fullWidth={true} variant="contained" sx={{ marginTop: 2, fontFamily: 'Inter' }}>Войти</Button>
            <Typography variant="body1" sx={{ fontFamily: 'Inter', textAlign: 'center', marginTop: 3 }} >У вас нет аккаунта? <span onClick={handleRegisterClick} className='incitingText'>Регистрация</span></Typography>
        </div>
    );
};

export default LoginPage;
