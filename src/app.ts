import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Process Mapping API with Prisma');
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
});