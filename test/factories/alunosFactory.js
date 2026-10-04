import { faker } from '@faker-js/faker';

export function novoAluno() {
   const timestamp = Date.now();
   const firstName = faker.person.firstName();
   const lastName = faker.person.lastName();
   const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
   
   return {
        nome: `${firstName} ${lastName}`,
        email: email,
        matricula: `${timestamp}`,
        senha: faker.string.alpha(6)
    };
}
