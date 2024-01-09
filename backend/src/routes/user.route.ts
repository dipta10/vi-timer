import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();

// will prisma get initialized on every single route??
const prisma = new PrismaClient();

router.get('/', async (_, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// router.post('/', async (req, res: Response) => {
//   const user = await prisma.user.create({
//     data: {
//       username: req.body.username,
//     },
//   });
//
//   res.json(user);
// });

export default router;