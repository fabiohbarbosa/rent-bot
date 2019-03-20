import { Router } from 'express';
import { Db } from 'mongodb';

import { mine } from './miner';
import PropertyCache from '@lib/property-cache';

const api = (router: Router, db: Db, cache: PropertyCache) => {
  mine(router, db, cache);
  return router;
};

export default api;
