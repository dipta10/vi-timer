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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const moment_1 = __importDefault(require("moment"));
const todo_utils_1 = __importDefault(require("../utils/todo-utils"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const todos = yield prisma.todo.findMany({
        orderBy: [
            {
                done: 'asc',
            },
            {
                updatedAt: 'desc',
            },
        ],
        where: {
            userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        },
    });
    res.json(todos);
}));
router.get('/get-running', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const todos = yield prisma.todo.findFirst({
        where: {
            running: true,
            userId: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id,
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
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _c;
    const entry = yield prisma.todo.create({
        data: {
            title: req.body.title,
            description: req.body.description,
            userId: (_c = req.user) === null || _c === void 0 ? void 0 : _c.id,
        },
    });
    res.json({
        data: entry,
    });
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    const { id } = req.params;
    const entry = yield prisma.todo.update({
        where: {
            id,
        },
        data: {
            title: req.body.title,
            description: req.body.description,
            userId: (_d = req.user) === null || _d === void 0 ? void 0 : _d.id,
        },
    });
    res.json({
        data: entry,
    });
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.todo.delete({
        where: {
            id: req.params.id,
        },
    });
    res.json('done');
}));
router.post('/:id/toggle-timer', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: todoId } = req.params;
    const todo = yield prisma.todo.findFirst({
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
    yield (0, todo_utils_1.default)(prisma, req.user.id);
    const newRunningState = !todo.running;
    if (!newRunningState) {
        res.json('done');
        return;
    }
    yield prisma.todo.update({
        where: {
            id: todoId,
        },
        data: {
            running: newRunningState,
        },
    });
    yield prisma.timeTracking.create({
        data: {
            todoId,
        },
    });
    res.json('done');
}));
router.put('/:id/toggle-done', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todo = yield prisma.todo.findFirst({
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
    yield prisma.todo.update({
        where: {
            id: todo.id,
        },
        data: {
            done: !todo.done,
        },
    });
    res.json('done');
}));
router.get('/timeline', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const days = 30;
    const earlier = (0, moment_1.default)().subtract(days, 'days').startOf('day').toDate();
    const tracking = yield prisma.timeTracking.findMany({
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
            todo: {
                userId: req.user.id,
            },
        },
        include: {
            todo: true,
        },
    });
    res.json(tracking);
}));
exports.default = router;
