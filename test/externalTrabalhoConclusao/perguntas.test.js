import '../setup.js';
import { getURL } from '../helpers/api.js';
import request from 'supertest';
import { expect } from 'chai';

describe('perguntas', () => {

    let token;

    it.only('Deve efetuar login', async () => {

        const loginResposta = await request('http://localhost:3000')
            .post('/api/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                email: 'admin@escola.com',
                senha: 'admin123'
            });


        token = await loginResposta.body.token;

        expect(loginResposta.status).to.equal(200);


    });

    it.only('Deve retornar o aluno cadastrado no banco de dados', async () => {

        const resposta = await getURL()
            .get('/api/admin/alunos/aluno-ana-souza')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);

    });


    it.only('Deve retornar Content-Type application/json na resposta', async () => {
       
        const resposta = await getURL()
            .get('/api/admin/alunos/aluno-ana-souza')
            .set('Authorization', `Bearer ${token}`);

        expect(resposta.status).to.equal(200);
        expect(resposta.headers['content-type']).to.include('application/json');
    });

})