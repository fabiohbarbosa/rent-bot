import { ObjectID } from 'mongodb';

import Log from '@config/logger';
import { logPrefix, path, projection } from './consts';

const api = (router, db) => {
  router.get(`${path}/:id`, async(req, res, next) => {
    try {
      const _id = new ObjectID(req.params.id);

      Log.info(`${logPrefix} Fetching property by id '${_id}'`);

      const property = await db.collection('properties')
        .findOne({ _id }, { projection });

      if (!property) {
        Log.warn(`${logPrefix} Not found property for id '${_id}'`);
        res.sendStatus(204);
        return;
      }

      res.json(property);
    } catch (err) {
      next(err);
    }
  });
};

export default api;
