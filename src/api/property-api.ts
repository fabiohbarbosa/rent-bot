import { Router } from 'express';
import { Db } from 'mongodb';

import { findAll, searchBy, patch, reloadCache } from './property';
import PropertyCache from '@lib/property-cache';

const api = (router: Router, db: Db, cache: PropertyCache) => {
  findAll(router, cache);
  patch(router, db);
  searchBy(router, db);
  reloadCache(router, cache);
  return router;
};

export default api;
