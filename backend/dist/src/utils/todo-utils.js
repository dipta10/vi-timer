"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
function stopRunningTasks(prisma, userId) {
    return __awaiter(this, void 0, void 0, function* () {
        // get current running tasks other than the current task
        // and stop those tasks
        const runningTodos = yield prisma.todo.findMany({
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
                    yield prisma.timeTracking.update({
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
                yield prisma.todo.update({
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
    });
}
exports.default = stopRunningTasks;
