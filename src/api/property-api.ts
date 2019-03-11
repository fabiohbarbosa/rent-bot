import { Router } from 'express';
import { Db } from 'mongodb';

import { findOne, findAll, patch } from './property';
import PropertyCache from '@lib/property-cache';

const api = (router: Router, db: Db, cache: PropertyCache) => {
  findOne(router, db);
  findAll(router, cache);
  patch(router, db);
  return router;
};

export default api;
