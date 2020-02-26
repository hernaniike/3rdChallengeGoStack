import { Router } from 'express';

import multer from 'multer';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientsController';
import DeliveryGuysController from './app/controllers/DeliveryGuysController';
import DeliveryguyController from './app/controllers/DeliveryguyController';
import DeliveryProblemsController from './app/controllers/DeliveryProblemController';
import OrderController from './app/controllers/OrderController';
import multerConfig from './config/multer';
import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);
routes.get('/deliveryguy/:id/listall', DeliveryguyController.index);
routes.get(
  '/deliveryguy/:id/completedeliveries',
  DeliveryguyController.delivered
);
routes.put(
  '/deliveryguy/:deliveryguyId/startdate/:orderId',
  DeliveryguyController.updateStart
);
// routes.post('/files', upload.single('file'), FileController.store);
routes.put(
  '/deliveryguy/:deliveryguyId/enddate/:orderId',
  upload.single('file'),
  // FileController.store,
  DeliveryguyController.updateEnd
);
routes.post('/delivery/:id/newProblem', DeliveryProblemsController.store);
routes.get('/problemslist', DeliveryProblemsController.index);
routes.get('/delivery/:id/problems', DeliveryProblemsController.orderproblem);
routes.use(authMiddleware.authenticated);
// routes.use(authMiddleware.isAdmin);
routes.delete(
  '/problem/:problemId/cancel-delivery',
  DeliveryProblemsController.delete
);
routes.post(
  '/addrecipients',
  authMiddleware.isAdmin,
  RecipientController.store
);
routes.post('/deliverys', authMiddleware.isAdmin, DeliveryGuysController.store);
routes.get('/deliverys', authMiddleware.isAdmin, DeliveryGuysController.index);
routes.put('/deliverys', authMiddleware.isAdmin, DeliveryGuysController.update);
routes.delete(
  '/deliverys/:id',
  authMiddleware.isAdmin,
  DeliveryGuysController.delete
);

routes.post('/orders', authMiddleware.isAdmin, OrderController.store);
routes.get('/orders', authMiddleware.isAdmin, OrderController.index);
routes.put('/orders', authMiddleware.isAdmin, OrderController.update);

export default routes;
