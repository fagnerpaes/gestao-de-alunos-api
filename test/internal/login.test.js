import '../setup.js';
import request from 'supertest';
import app from '../../src/app.js';
import { expect } from 'chai';
import sinon from 'sinon';
import authService from '../../src/services/auth.service.js';



describe('Login', () => {
  it('deve retornar 200 e um token quando o usuário informar e-mail e senha corretos', async () => {
    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: 'admin123' 
    });

    expect(loginResposta.status).to.equal(200);
    //console.log('Resposta do login:', loginResposta.body); // Adicione este log para depuração
  });

  it('deve retornar 401 quando o usuário informar senha incorreta', async () => {
    const loginResposta = await request(app)
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
    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: '' 
    });
    
    expect(loginResposta.status).to.equal(400);
    expect(loginResposta.body.error).to.equal('Os campos "email" e "senha" são obrigatórios.');
  });

  it('deve retornar 500 quando ocorrer algum problema na conexão com o banco de dados', async () => {
    // Simula um problema na conexão com o banco de dados através de Mock com sinon.

    const authServiceMock = sinon.stub(authService, 'login');
    authServiceMock.throws(new Error('ERRO CATASTRÓFICO!!!!'));

    const loginResposta = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({
        email: 'admin@escola.com', 
        senha: 'admin123' 
    });

    expect(loginResposta.status).to.equal(500);
    expect(loginResposta.body.error).to.equal('Erro interno do servidor.');

    //restore(); // Restaura o comportamento original do método login do authService
  });
});