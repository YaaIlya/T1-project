import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const getToken = () => localStorage.getItem('token');

export const fetchUsers = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/admin/allUsers`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const fetchUserCard = async () => {
    const token = getToken();
    const response = await axios.get(`${API_URL}/virtualCard/getVirtualCard`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

export const updateUserRole = async (userId: number, role: string) => {
    const token = getToken();
    const endpoints: { [key: string]: string } = {
        'ВИП': '/admin/setVIP',
        'ПОВЫШЕННЫЙ': '/admin/setUpgraded',
        'СТАНДАРТ': '/admin/setStandard',
    };

    const endpoint = endpoints[role];
    if (endpoint) {
        return axios.patch(
            `${API_URL}${endpoint}`,
            { userId },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
    }
    throw new Error('Invalid role selected');
};

export const blockUserCard = async (cardId: string) => {
    const token = getToken();
    return axios.post(`${API_URL}/admin/blockUserCard/${cardId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
