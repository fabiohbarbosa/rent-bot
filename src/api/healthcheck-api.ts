export default (router) => {
  router.get('/healthcheck', (req, res, next) => {
    res.json({ status: 'UP' });
  });
  return router;
};
