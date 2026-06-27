import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

// Usuários de teste (RF1: o banco pode ser populado manualmente)
const usuarios = [
  { username: 'douglas', password: 'senha123' },
  { username: 'maria', password: 'senha123' },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await User.deleteMany({});
  for (const u of usuarios) {
    const passwordHash = await bcrypt.hash(u.password, 10); // hash + salt (critério 14)
    await User.create({ username: u.username, passwordHash });
    console.log(`Usuário criado: ${u.username} / ${u.password}`);
  }
  await mongoose.disconnect();
  console.log('Seed concluído!');
}

seed();
