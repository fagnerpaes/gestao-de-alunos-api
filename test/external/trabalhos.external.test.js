import '../setup.js';
import { getURL } from '../helpers/api.js';
import { expect } from 'chai';

describe('Autoatendimento', () => {
  it('deve registrar um novo trabalho para uma disciplina em que o aluno esteja cadastrado', async () => {
    //refatorar
    const loginResposta = await getURL()
        .post('/api/auth/login')
        .set('Content-Type', 'application/json')
        .send({
            email: 'bruno.lima@example.com', 
            senha: '123456' 
        });
  
    const token = loginResposta.body.token;
    const alunoId = loginResposta.body.usuario.id;

    // Realizar a requisição para registrar um novo trabalho
    const registroTrabalhoResposta = await getURL()
        .post(`/api/alunos/${alunoId}/trabalhos`)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`) // Adiciona o token no cabeçalho da requisição
        .send({
            disciplinaId: 'disciplina-matematica',
            titulo: 'Lista de Exercícios 2',
            descricao: 'Resolução dos exercícios de 21 a 40 do capítulo 2.'
        });

    // Validar que o trabalho foi registrado com sucesso
    expect(registroTrabalhoResposta.status).to.equal(201);
    expect(registroTrabalhoResposta.body.titulo).to.equal('Lista de Exercícios 2');
    expect(registroTrabalhoResposta.body.descricao).to.equal('Resolução dos exercícios de 21 a 40 do capítulo 2.');

  });
});
