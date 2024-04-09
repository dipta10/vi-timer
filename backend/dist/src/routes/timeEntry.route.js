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
const client_1 = require("@prisma/client");
const express_1 = require("express");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const timeEntry = yield prisma.timeTracking.findFirst({
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
    const durationInSec = Math.round((endTime.getTime() - startTime.getTime()) / 1000);
    const todo = yield prisma.todo.findFirst({
        where: {
            id: timeEntry.todoId,
        },
    });
    if (!todo) {
        res.status(404).json({ message: 'Todo not found' });
        return;
    }
    // update the timeSpent of the todo and delete the time entry in a single prisma transaction below
    yield prisma.$transaction([
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
}));
exports.default = router;
