import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Grid,
    Card,
    CardContent,
    CardActions,
    IconButton,
    Menu,
    MenuItem,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { Person as PersonIcon, Block as BlockIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchUsers, fetchUserCard, updateUserRole, blockUserCard } from './axios';
import './AdminDashboard.css';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const usersData = await fetchUsers();
                const enrichedUsers = await Promise.all(usersData.map(async (user: any) => {
                    try {
                        const cardData = await fetchUserCard();
                        return {
                            id: cardData.cardNumber,
                            username: user.username,
                            dateOfBirth: user.dateOfBirth,
                            roles: user.roles.map((roleObj: any) => roleObj.role.split('_')[1] || roleObj.role),
                        };
                    } catch (error) {
                        console.error('Error fetching card data:', error);
                        return null;
                    }
                }));
                setUsers(enrichedUsers.filter(Boolean));
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        loadUsers();
    }, []);

    const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, user: any) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
        setStatus(user.roles[0] || '');
    };

    const handleCloseMenu = () => setAnchorEl(null);

    const handleChangeStatus = async () => {
        if (selectedUser) {
            try {
                await updateUserRole(selectedUser.id, status);
                setUsers(users.map(user => user.id === selectedUser.id ? { ...user, roles: [status] } : user));
                handleCloseMenu();
            } catch (error) {
                console.error('Error updating user status:', error);
            }
        }
    };

    const handleBlockCard = async (cardId: string) => {
        try {
            await blockUserCard(cardId);
            alert(`Карта с номером ${cardId} заблокирована.`);
        } catch (error) {
            console.error('Error blocking card:', error);
            alert('Произошла ошибка при блокировке карты.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Панель управления Администратора T1
                    </Typography>
                    <Button color="inherit" onClick={handleLogout}>Выйти</Button>
                </Toolbar>
            </AppBar>

            <Container>
                <Box mt={4}>
                    <Grid container spacing={3}>
                        {users.map(user => (
                            <Grid item xs={12} sm={6} md={4} key={user.id}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h5">{user.username}</Typography>
                                        <Typography color="textSecondary">Номер карты: {user.id}</Typography>
                                        <Typography color="textSecondary">Дата рождения: {new Date(user.dateOfBirth).toLocaleDateString()}</Typography>
                                        <Typography color="textSecondary">Роли: {user.roles.join(', ')}</Typography>
                                    </CardContent>
                                    <CardActions>
                                        <IconButton onClick={(event) => handleOpenMenu(event, user)}>
                                            <PersonIcon />
                                        </IconButton>
                                        <IconButton onClick={() => handleBlockCard(user.id)}>
                                            <BlockIcon />
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel id="status-select-label">Роль</InputLabel>
                            <Select
                                labelId="status-select-label"
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                label="Роль"
                            >
                                <MenuItem value="СТАНДАРТ">СТАНДАРТ</MenuItem>
                                <MenuItem value="ПОВЫШЕННЫЙ">ПОВЫШЕННЫЙ</MenuItem>
                                <MenuItem value="ВИП">ВИП</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                    <MenuItem>
                        <Button variant="contained" onClick={handleChangeStatus} sx={{ marginTop: 2 }}>
                            Изменить роль
                        </Button>
                    </MenuItem>
                </Menu>
            </Container>
        </div>
    );
};

export default AdminDashboard;
