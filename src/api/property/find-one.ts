import { Router } from 'express';
import { Db } from 'mongodb';

import Property from '@models/property';
import Log from '@config/logger';

import { logPrefix, path } from './consts';

const api = (router: Router, db: Db) => {
  router.get(`${path}/:id`, async(req, res, next) => {
    try {
      const _id = req.params.id;
      Log.info(`${logPrefix} Fetching property by id '${_id}'`);

      const property = await Property.findOne(db, _id);

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
