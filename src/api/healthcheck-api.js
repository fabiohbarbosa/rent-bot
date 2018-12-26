export default (router) => {
  router.get('/healthcheck', (req, res, next) => {
    res.send({ status: 'UP' });
  });
  return router;
};
