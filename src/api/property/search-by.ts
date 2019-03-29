import { Router } from 'express';
import { Db } from 'mongodb';

import Property from '@models/property';
import Log from '@config/logger';

import { logPrefix, path } from './consts';

const api = (router: Router, db: Db) => {
  router.get(`${path}/searchBy`, async(req, res, next) => {
    try {
      let query = req.query;
      Log.info(`${logPrefix} Fetching property by query '${JSON.stringify(query)}'`);

      const properties = await Property.findByQuery(db, query);

      if (!properties || properties.length === 0) {
        Log.warn(`${logPrefix} Not found property for query '${JSON.stringify(query)}'`);
        res.sendStatus(204);
        return;
      }

      res.json(properties);
    } catch (err) {
      next(err);
    }
  });
};

export default api;
