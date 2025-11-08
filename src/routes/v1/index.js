import express from 'express';
import authRoute from './auth.routes.js';
import userRoute from './user.routes.js';
import paymentRoute from './payment.routes.js';
import notificationRoute from './notification.routes.js';
import termsRoute from './terms.routes.js';
import privacyRoute from './privacy.routes.js';
import aboutRoute from './about.routes.js';

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/payments',
    route: paymentRoute,
  },
  {
    path: '/notifications',
    route: notificationRoute,
  },
  {
    path: '/static/terms',
    route: termsRoute,
  },
  {
    path: '/static/privacy',
    route: privacyRoute,
  },
  {
    path: '/static/about',
    route: aboutRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
