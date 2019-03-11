import { Router } from 'express';

import { logPrefix, path } from './consts';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';


const api = (router: Router, cache: PropertyCache) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching all properties`);
    const properties = cache.properties;

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
