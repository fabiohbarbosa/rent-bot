import { Router } from 'express';

export default (router: Router) => {
  router.get('/healthcheck', (req, res, next) => {
    res.json({ status: 'UP' });
  });
  return router;
};
