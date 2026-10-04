import { faker } from '@faker-js/faker';

export function novaDisciplina() {
   const timestamp = Date.now();

    return {
        nome: faker.person.jobTitle(),
        codigo: `PC${timestamp}`,
        cargaHoraria: faker.number.int({ min: 30, max: 120 }),
    };
}

