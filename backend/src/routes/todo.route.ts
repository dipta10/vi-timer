import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (_, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });

  res.json(todos);
});

router.post('/', async (req: Request, res: Response) => {
  const entry = await prisma.todo.create({
    data: {
      title: req.body.title,
      description: req.body.description,
    },
  });

  res.json({
    data: entry,
  });
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const entry = await prisma.todo.update({
    where: {
      id,
    },
    data: {
      title: req.body.title,
      description: req.body.description,
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

router.put('/:id/toggle-done', async (req, res) => {
  const todo = await prisma.todo.findFirst({
    where: {
      id: req.params.id,
    },
  });

  if (!todo) {
    res.json('todo not found');
    return;
  }

  await prisma.todo.update({
    where: {
      id: todo.id,
    },
    data: {
      done: !todo.done,
    },
  });

  res.json('done');
});

export default router;
