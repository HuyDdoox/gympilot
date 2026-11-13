import { Router } from 'express';
import { membersController } from './members.controller.js';

export const memberRoutes: Router = Router();

memberRoutes.get('/', (req, res) => membersController.getMembers(req, res));
memberRoutes.post('/', (req, res) => membersController.createMember(req, res));
