import '../setup.js';
import { getURL } from '../helpers/api.js';
import { expect } from 'chai';
import { loginAndGetTokenAdmin } from '../helpers/auth.js';
import { novoAluno } from '../factories/alunosFactory.js';
import { novaDisciplina } from '../factories/disciplinasFactory.js';
import testesDeMatriculas from '../fixtures/matriculas.json' with { type: 'json'}


//Uso de Fixtures
describe('Disciplina', () => {
    testesDeMatriculas.forEach(testeDeMatricula => {
        it(testeDeMatricula.testTitle, async () => {
            //Arrange (Give)
            //Cadastrar o aluno
            const cadastroAlunoResposta = await getURL()
                .post('/api/admin/alunos')
                .set('Content-Type', 'application/json')
                .set('Authorization', await loginAndGetTokenAdmin()) // Adiciona o token no cabeçalho da requisição    
                .send(testeDeMatricula.dadosAluno);

            const alunoId = cadastroAlunoResposta.body.id;


            const cadastroDisciplinaResposta = await getURL()
                .post('/api/admin/disciplinas')
                .set('Content-Type', 'application/json')
                .set('Authorization', await loginAndGetTokenAdmin())
                .send(testeDeMatricula.dadosDisciplina);

            const disciplinaId = cadastroDisciplinaResposta.body.id;

            // Act (When)
            const matriculaResposta = await getURL()
                .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
                .set('Content-Type', 'application/json')
                .set('Authorization', await loginAndGetTokenAdmin())
                .send({
                    alunoId: alunoId
                });


            // Assert (Then)
            expect(matriculaResposta.status).to.equal(testeDeMatricula.statusCodeEsperado);
            expect(matriculaResposta.body.alunoId).to.equal(alunoId);
            expect(matriculaResposta.body.disciplinaId).to.equal(disciplinaId);

        })
    })

    //Uso de Factories
    it('Validar que um aluno que acaba de ser cadastrado pode ser matriculado em uma nova disciplina', async () => {
        //Triple A 
        // Arrange (Give) 
        const cadastroAlunoResposta = await getURL()
            .post('/api/admin/alunos')
            .set('Content-Type', 'application/json')
            .set('Authorization', await loginAndGetTokenAdmin()) // Adiciona o token no cabeçalho da requisição    
            .send(novoAluno());

        const alunoId = cadastroAlunoResposta.body.id;
        
        const cadastroDisciplinaResposta = await getURL()
            .post('/api/admin/disciplinas')
            .set('Content-Type', 'application/json')
            .set('Authorization', await loginAndGetTokenAdmin())
            .send(novaDisciplina());

        const disciplinaId = cadastroDisciplinaResposta.body.id;
                
        // Act (When)
        const matriculaResposta = await getURL()
            .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
            .set('Content-Type', 'application/json')
            .set('Authorization', await loginAndGetTokenAdmin())
            .send({
                alunoId: alunoId
            });

        
        // Assert (Then)
        expect(matriculaResposta.status).to.equal(201);
        expect(matriculaResposta.body.alunoId).to.equal(alunoId);
        expect(matriculaResposta.body.disciplinaId).to.equal(disciplinaId);

    });

});
