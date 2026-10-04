import mongoose from 'mongoose';
import 'dotenv/config';


// Prioridade: MONGODB_URI_TEST (local) → MONGODB_URI (CI) → fallback
const uri = process.env.MONGODB_URI_TEST
    || process.env.MONGODB_URI
    || 'mongodb://127.0.0.1:27017/gestao-de-alunos-test';

// Conecta no MESMO banco que a API usa
await mongoose.connect(uri);

// Importa o seed DEPOIS da conexão (o seed.js atual roda sozinho ao ser importado)
const { seed } = await import('../src/database/seed.js');

// Restaura o estado inicial documentado no README
async function restaurarEstadoInicial() {
  const colecoes = await mongoose.connection.db.collections();
  for (const colecao of colecoes) {
    await colecao.deleteMany({});
  }
  await seed(); // banco vazio → seed popula tudo de novo
}

// Garante o estado inicial antes de CADA teste
beforeEach(restaurarEstadoInicial);

// Único disconnect de toda a suíte
after(async () => {
  await mongoose.disconnect();
});