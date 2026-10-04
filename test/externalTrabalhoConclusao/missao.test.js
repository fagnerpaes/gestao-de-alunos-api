import '../setup.js';
import { getURL } from '../helpers/api.js';
import { expect } from 'chai';
import { loginAndGetTokenAdmin } from '../helpers/auth.js';
import testesRegistrarTrabalhos from '../fixtures/missao.json' with { type: 'json'};
import { loginAndGetToken } from '../helpers/auth.js'; 

let tokenAdmin;

describe('Missão', () => {

    beforeEach(async () => {

        tokenAdmin = await loginAndGetTokenAdmin();
    });

    testesRegistrarTrabalhos.forEach(testeRegistrarTrabalho => {

        it(testeRegistrarTrabalho.titulo, async () => {

            //Arrange (Give)
            //Cadastrar um novo aluno
            const cadastroAlunoResposta = await getURL()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin) // Adiciona o token no cabeçalho da requisição
                .send(testeRegistrarTrabalho.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;

            //Cadastrar uma nova disciplina
            const cadastroDisciplinaReposta = await getURL()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send(testeRegistrarTrabalho.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaReposta.body.id;

            //Marticular Aluno na Disciplina
            const matricularAlunoNaDisciplinaResposta = await getURL()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', tokenAdmin)
                .send({
                    alunoId: alunoId
                });

            //Act
            //Registrar Novo Trabalho do aluno na disciplina
            const registroTrabalhoResposta = await getURL()
                .post(`/api/alunos/${alunoId}/trabalhos`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await loginAndGetToken(
                    testeRegistrarTrabalho.dadosAluno.email, 
                    testeRegistrarTrabalho.dadosAluno.senha
                )) 
                .send({
                    disciplinaId: disciplinaId,
                    ...testeRegistrarTrabalho.dadosTrabalho     
                    
                });

            //Assert
            // Validar que o trabalho foi registrado com sucesso
            expect(registroTrabalhoResposta.status).to.equal(testeRegistrarTrabalho.statusCodeEsperado);
            expect(registroTrabalhoResposta.body.titulo).to.equal(testeRegistrarTrabalho.dadosTrabalho.titulo);
            expect(registroTrabalhoResposta.body.descricao).to.equal(testeRegistrarTrabalho.dadosTrabalho.descricao);

        });
    })
})

