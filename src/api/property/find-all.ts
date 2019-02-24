import Log from '@config/logger';

import { logPrefix, path, projection } from './consts';

const api = (router, db) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching all properties`);

    const properties = await db.collection('properties')
      .find({}, { projection })
      .sort({ createAt: -1 })
      .toArray();

    if (properties.length === 0) {
      Log.warn(`${logPrefix} Not found properties`);
      res.sendStatus(204);
      return;
    }

    Log.info(`${logPrefix} Found ${properties.length} properties`);
    res.json(properties);
  });
};

export default api;
