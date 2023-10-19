import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (_, res: Response) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

router.post('/', async (req: Request, res: Response) => {
  const project = await prisma.project.create({
    data: {
      name: req.body.name,
      userId: req.body.userId,
    },
  });

  res.json(project);
});

export default router;