import { Router } from 'express';
import { Db } from 'mongodb';

import { findAll } from './status';

const api = (router: Router, db: Db) => {
  findAll(router, db);
  return router;
};

export default api;
