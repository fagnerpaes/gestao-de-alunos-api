import '../setup.js';
import { getURL } from '../helpers/api.js';
import { expect } from 'chai';
import { loginAndGetToken } from '../helpers/auth.js';

describe('Alunos', () => {

    let token;

    beforeEach(async () => {
        // Obter o token de autenticação antes de executar os testes
        token = await loginAndGetToken('admin@escola.com', 'admin123');
    });

    it('deve cadastrar um aluno quando informado dados válidos', async () => {

        // Realizar a requisição para cadastrar um aluno
        const cadastroAlunoResposta = await getURL()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token) // Adiciona o token no cabeçalho da requisição
            .send({
                nome: 'João Silva',
                email: 'joao.silva@escola.com',
                matricula: '123456',
                senha: 'senha123'
            });

        //console.log('Resposta do cadastro de aluno:', cadastroAlunoResposta.status); // Adicione este log para depuração
        //console.log('Resposta do cadastro de aluno:', cadastroAlunoResposta.body.error); // Adicione este log para depuração

        //Validar que o aluno foi cadastrado com sucesso
        expect(cadastroAlunoResposta.status).to.equal(201);
        expect(cadastroAlunoResposta.body.nome).to.equal('João Silva');
        expect(cadastroAlunoResposta.body.email).to.equal('joao.silva@escola.com');
        expect(cadastroAlunoResposta.body.matricula).to.equal('123456');
    });

    it('tentar cadastrar um aluno que já existe deve retornar um erro', async () => {

        // Realizar a requisição para cadastrar um aluno
        const cadastroAlunoResposta = await getURL()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', token) // Adiciona o token no cabeçalho da requisição
            .send({
                nome: 'Ana Souza',
                email: 'ana.souza@escola.com',
                matricula: '2024001',
                senha: '123456'
            });

        //console.log('Resposta do cadastro de aluno:', cadastroAlunoResposta.status); // Adicione este log para depuração
        //console.log('Resposta do cadastro de aluno:', cadastroAlunoResposta.body.error); // Adicione este log para depuração

        //Validar que o aluno já existe com essa matricula. 
        expect(cadastroAlunoResposta.status).to.equal(409);
        expect(cadastroAlunoResposta.body.error).to.equal('Já existe um aluno cadastrado com essa matrícula ou e-mail.');             
    });

});