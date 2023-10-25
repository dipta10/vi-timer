import { Request, Response, Router } from 'express';
import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import { stopRunningTasks } from '../utils/todo-utils';

const router = Router();

const prisma = new PrismaClient();

router.get('/', async (_, res: Response) => {
  const todos = await prisma.todo.findMany({
    orderBy: [
      {
        done: 'asc',
      },
      {
        updateAt: 'desc',
      },
    ],
  });

  res.json(todos);
});

router.get('/get-running', async (_, res: Response) => {
  const todos = await prisma.todo.findFirst({
    where: {
      running: true,
    },
    include: {
      TimeTracking: {
        where: {
          endTime: null,
        },
      },
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

router.post('/:id/toggle-timer', async (req, res) => {
  const { id: todoId } = req.params;

  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
    include: {
      TimeTracking: {
        where: {
          endTime: null,
        },
      },
    },
  });

  if (!todo) {
    // how to stop this from stopping the server?
    throw new Error('Unable to find todo to toggle running state');
  }

  await stopRunningTasks(prisma);

  const newRunningState = !todo.running;

  if (!newRunningState) {
    res.json('done');
    return;
  }

  await prisma.todo.update({
    where: {
      id: todoId,
    },
    data: {
      running: newRunningState,
    },
  });

  await prisma.timeTracking.create({
    data: {
      todoId,
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

  if (!todo.done) {
    // TODO then stop the timer if running
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

router.get('/timeline', async (_, res: Response) => {
  const earlier = moment().subtract(7, 'days').startOf('day').toDate();

  const tracking = await prisma.timeTracking.findMany({
    orderBy: [
      {
        startTime: 'desc',
      },
      {
        endTime: 'desc',
      },
    ],
    where: {
      startTime: {
        gte: earlier,
      },
    },
    include: {
      todo: true,
    },
  });

  res.json(tracking);
});

export default router;
