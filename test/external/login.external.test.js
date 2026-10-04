import '../setup.js';
import request from 'supertest';
import { expect } from 'chai';

describe('Login', () => {
  it('deve retornar 200 e um token quando o usuário informar e-mail e senha corretos', async () => {
    const loginResposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: 'admin123' 
    });

    expect(loginResposta.status).to.equal(200);
    
  });

  it('deve retornar 401 quando o usuário informar senha incorreta', async () => {
    const loginResposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: 'senhaerrada' 
    });
    
    expect(loginResposta.status).to.equal(401);
    expect(loginResposta.body.error).to.equal('E-mail ou senha inválidos.'); 

  });

  it('deve retornar 400 quando o usuário não informar a senha', async () => {
    const loginResposta = await request('http://localhost:3000')
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: '' 
    });
    
    expect(loginResposta.status).to.equal(400);
    expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });
});