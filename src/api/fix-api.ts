import Log from '@config/logger';

export default (router, db) => {
  router.get('/fix/properties/imovirtual/url', async(req, res, next) => {

    const logPrefix = '[fix:properties:imovirtual]:';

    const query = {
      provider: 'imovirtual'
    };

    const properties = await db.collection('properties')
      .find(query)
      .toArray();

    properties.forEach(p => {
      const { url } = p;
      const newUrl = p.url.split('#')[0];

      const filter = { url };
      const set = { url: newUrl };

      const callback = (err, result) => {
        if (err) {
          Log.error(`${logPrefix} Error ${err.message}`);
        }
        Log.info(`${logPrefix} Update ${url} to ${newUrl}`);
      };

      db.collection('properties')
        .updateOne(filter, { $set: set }, callback);
    });

    res.status(204);
  });

  return router;
};
