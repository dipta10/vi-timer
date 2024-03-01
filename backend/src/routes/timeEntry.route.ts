import { PrismaClient } from '@prisma/client';
import { Router } from 'express';

const router = Router();

const prisma = new PrismaClient();

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const timeEntry = await prisma.timeTracking.findFirst({
    where: {
      id,
    },
  });
  if (!timeEntry) {
    res.status(404).json({ message: 'Time entry not found' });
    return;
  }
  if (!timeEntry.endTime) {
    res
      .status(400)
      .json({ message: 'Timer is still running, stop the timer first' });
    return;
  }
  const startTime = new Date(timeEntry.startTime);
  const endTime = new Date(timeEntry.endTime);
  const durationInSec = Math.round(
    (endTime.getTime() - startTime.getTime()) / 1000,
  );
  const todo = await prisma.todo.findFirst({
    where: {
      id: timeEntry.todoId,
    },
  });

  if (!todo) {
    res.status(404).json({ message: 'Todo not found' });
    return;
  }

  // update the timeSpent of the todo and delete the time entry in a single prisma transaction below
  await prisma.$transaction([
    prisma.todo.update({
      where: {
        id: todo.id,
      },
      data: {
        timeSpent: todo.timeSpent - durationInSec,
      },
    }),
    prisma.timeTracking.delete({
      where: {
        id,
      },
    }),
  ]);

  res.json({ message: 'Time entry deleted' });
});

export default router;
