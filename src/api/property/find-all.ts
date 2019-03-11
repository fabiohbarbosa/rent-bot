import { Router } from 'express';

import { logPrefix, path } from './consts';

import Log from '@config/logger';
import PropertyCache from '@lib/property-cache';
import Property from '@models/property';

const _slice = (properties: Property[], query: { page: string, offset: string }) => {
  if (!query || !query.page || !query.offset) return properties;

  const page = parseInt(query.page, 10);
  const offset = parseInt(query.offset, 10);

  return properties.slice(offset * (page - 1), offset * page);
};

const api = (router: Router, cache: PropertyCache) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching all properties`);

    const properties = _slice(cache.properties, req.query);
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
