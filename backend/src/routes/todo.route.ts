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

router.post('/:id/toggle-timer', async (req, res) => {
  // get current running tasks other than the current task
  // and stop those tasks
  const { id: todoId } = req.params;
  const runningTodos = await prisma.todo.findMany({
    where: {
      running: true,
      id: {
        not: todoId,
      },
    },
    include: {
      TimeTracking: {
        where: {
          endTime: null,
        },
      },
    },
  });
  if (runningTodos) {
    // set the end time for running task
    for (const todo1 of runningTodos) {
      for (const tracking of todo1.TimeTracking) {
        console.log('updating tracking', tracking);
        await prisma.timeTracking.update({
          where: {
            // TODO can we make it in clause?
            id: tracking.id,
          },
          data: {
            endTime: new Date(),
          },
        });
      }
      console.log('updaing todo', todo1);
      // stop the current running task
      await prisma.todo.update({
        where: {
          // TODO can we make it in clause?
          id: todo1.id,
        },
        data: {
          running: false,
        },
      });
    }
  }

  const todo = await prisma.todo.findFirst({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    // how to stop this from stopping the server?
    throw new Error('Unable to find todo to toggle running state');
  }
  const newState = !todo.running;
  await prisma.todo.update({
    where: {
      id: todoId,
    },
    data: {
      running: newState,
    },
  });

  if (newState) {
    await prisma.timeTracking.create({
      data: {
        todoId,
      },
    });
  }

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

export default router;
