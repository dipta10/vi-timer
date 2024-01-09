import { PrismaClient } from '@prisma/client';

export default async function stopRunningTasks(
  prisma: PrismaClient,
  userId: string,
) {
  // get current running tasks other than the current task
  // and stop those tasks
  const runningTodos = await prisma.todo.findMany({
    where: {
      running: true,
      userId,
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
    const endTime = new Date();
    for (const todo of runningTodos) {
      let totalSecondsDiff = 0;
      for (const tracking of todo.TimeTracking) {
        await prisma.timeTracking.update({
          where: {
            // TODO can we make it in clause?
            id: tracking.id,
          },
          data: {
            endTime,
          },
        });
        const { startTime } = tracking;
        const secondsDiff = (endTime.getTime() - startTime.getTime()) / 1000;
        totalSecondsDiff += secondsDiff;
        console.log('secondsDiff', secondsDiff);
      }
      // stop the current running task
      await prisma.todo.update({
        where: {
          // TODO can we make it in clause?
          id: todo.id,
        },
        data: {
          running: false,
          timeSpent: todo.timeSpent + Math.ceil(totalSecondsDiff),
        },
      });
    }
  }
}
