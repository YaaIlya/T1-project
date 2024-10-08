import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Menu, MenuItem, Select, FormControl, Tooltip } from '@mui/material';
import { Person as PersonIcon, QrCode as QRCodeIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import './VirtualCard.css';
import userImage from '../../media/userImage.png';
import qrCodeImage from '../../media/qr-code.png';
import edit from '../../media/edit.png';
import deleteimg from '../../media/deleteimg.png';

const VirtualCard: React.FC = () => {
    const [user, setUser] = useState({
        surname: '',
        firstName: '',
        patronymic: '',
        username: '',
        email: '',
        roles: [] as string[],
    });
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<any>(null);
    const [editMode, setEditMode] = useState(false);
    const [cardColor, setCardColor] = useState('#ffffff');
    const [colorMenuAnchor, setColorMenuAnchor] = useState<null | HTMLElement>(null);
    const [isAdmin, setIsAdmin] = useState(false); // State for checking if user is admin

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8080/api/user/getUserInfo', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUser(response.data);
                setIsAdmin(response.data.roles.includes('ROLE_ADMIN')); // Check if user is admin

                const responseForCard = await axios.get(`http://localhost:8080/api/virtualCard/getVirtualCard`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const cardData = responseForCard.data;
                const expiryDate = new Date(cardData.expirationDate);

                setCard({
                    number: cardData.cardNumber,
                    expiryDate: `${expiryDate.getMonth() + 1}/${expiryDate.getFullYear().toString().slice(-2)}`,
                });
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleCreateCard = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:8080/api/virtualCard/createVirtualCard', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
        } catch (error) {
            console.log('Error creating or fetching virtual card:', error);
        }
    };

    const handleEditClick = () => {
        setEditMode(!editMode);
    };

    const handleColorChange = (color: string) => {
        setCardColor(color);
        setEditMode(false);
    };

    const handleColorMenuOpen = (event: React.MouseEvent<HTMLImageElement>) => {
        setColorMenuAnchor(event.currentTarget);
    };

    const handleColorMenuClose = () => {
        setColorMenuAnchor(null);
    };

    const handleSaveChanges = async () => {
        // Ваш код для сохранения изменений, например, отправка данных на сервер
        handleEditClick(); // Закрываем режим редактирования после сохранения изменений
    };

    const handleNavigateToAdminDashboard = () => {
        navigate('/admin-dashboard'); // Navigate to the Admin Dashboard
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="virtual-card-container">
            <div className="user-info">
                <PersonIcon sx={{ fontSize: 100, color: '#333', marginBottom: 2 }} />
                <QRCodeIcon sx={{ fontSize: 100, color: '#333', marginBottom: 2 }} />
                <div className="user-details">
                    <p>{user.firstName}</p>
                    <p>{user.surname}</p>
                    <p>{user.username}</p>
                    <p>{user.roles.map((role: string) => role.replace('ROLE_', '')).join(', ')}</p>
                    <p>{user.email}</p>
                </div>
            </div>

            <div className="virtual-card" style={{ backgroundColor: cardColor }}>
                <div className="card-content">
                    {card ? (
                        <>
                            <p className="card-number">{card.number}</p>
                            <p className="card-expiry">{card.expiryDate}</p>
                            <p className="card-holder">{user.username}</p>
                        </>
                    ) : (
                        <p>Карта еще не создана</p>
                    )}
                </div>
            </div>

            <div className="icon-container">
                <Tooltip title="Кастомизировать карту" arrow>
                    <img src={edit} alt="Edit" onClick={handleEditClick} />
                </Tooltip>
                <Tooltip title="Заблокировать карту" arrow>
                    <img src={deleteimg} alt="Delete" />
                </Tooltip>
            </div>

            {!card && (
                <Button type="submit" variant="contained" onClick={handleCreateCard} sx={{ marginTop: 2, fontFamily: 'Inter' }}>Создать карту</Button>
            )}

            {editMode && (
                <div className="edit-card-container">
                    <FormControl fullWidth>
                        <Select
                            labelId="color-select-label"
                            value={cardColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                        >
                            <MenuItem value="#ffffff">Белый</MenuItem>
                            <MenuItem value="#ff9999">Розовый</MenuItem>
                            <MenuItem value="#99ff99">Зеленый</MenuItem>
                            <MenuItem value="#167ae5">Синий</MenuItem>
                            <MenuItem value="#ffff99">Желтый</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleSaveChanges} sx={{ marginTop: 2, fontFamily: 'Inter' }}>Сохранить изменения</Button>
                </div>
            )}

            {isAdmin && (
                <Button variant="contained" color="primary" onClick={handleNavigateToAdminDashboard} sx={{ marginTop: 2 }}>
                    Панель управления
                </Button>
            )}
        </div>
    );
};

export default VirtualCard;
