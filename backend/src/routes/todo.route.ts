import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (_, res: Response) => {
  const todos = await prisma.todo.findMany();

  res.json(todos);
});

router.post('/', async (req: Request, res: Response) => {
  const entry = await prisma.todo.create({
    data: {
      title: req.body.title,
      description: req.body.description,
      projectId: req.body.projectId,
    },
  });

  res.json({
    data: entry,
  });
});

router.delete('/:id', async (req, res) => {
  await prisma.todo.delete({
    where: {
      id: req.params.id,
    },
  });

  res.json('done');
});

export default router;
