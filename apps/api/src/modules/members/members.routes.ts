import { Router } from 'express';
import { membersController } from './members.controller.js';

export const memberRoutes: Router = Router();

memberRoutes.get('/template-csv', (req, res) => membersController.getTemplateCsv(req, res));
memberRoutes.post('/import-preview', (req, res) => membersController.previewCsv(req, res));
memberRoutes.post('/import', (req, res) => membersController.importCsv(req, res));
memberRoutes.get('/', (req, res) => membersController.getMembers(req, res));
memberRoutes.get('/:id', (req, res) => membersController.getMemberById(req, res));
memberRoutes.post('/', (req, res) => membersController.createMember(req, res));
memberRoutes.put('/:id', (req, res) => membersController.updateMember(req, res));
memberRoutes.delete('/:id', (req, res) => membersController.deleteMember(req, res));
