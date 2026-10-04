import { getURL } from './api.js';
import 'dotenv/config';

let tokenEmCache = null;

// Função para login do admin e obtenção do token de autenticação
export async function loginAndGetTokenAdmin() {

    if (!tokenEmCache) {
        const loginRequest = await getURL()
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: process.env.ADMIN_EMAIL || 'admin@escola.com',
                senha: process.env.ADMIN_SENHA || 'admin123'
            });
        tokenEmCache = loginRequest.body.token; // Armazena o token em cache

    }

    return `Bearer ${tokenEmCache}`; // Retorna o token de autenticação
}

// Função para login de qualquer usuário, não apenas admin
export async function loginAndGetToken(emailUser, passwordUser) {
    const loginRequest = await getURL()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            email: emailUser,
            senha: passwordUser
        });

    return `Bearer ${loginRequest.body.token}`; // Retorna o token de autenticação
}


