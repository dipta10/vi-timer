import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

// will prisma get initialized on every single route??
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  const user = await prisma.user.findFirst({
    where: {
      id: req.user?.id,
    },
  });
  // throw new Error('not found!');
  user!.googleId = '';
  res.json(user);
});

export default router;
