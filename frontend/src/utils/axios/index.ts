import axios from "axios";
import { json } from "stream/consumers";

export const instance = axios.create({
    baseURL: 'http://localhost:8080/auth/registration',
    timeout: 1000,
    headers: { 'Content-Type': `application/json` }
});