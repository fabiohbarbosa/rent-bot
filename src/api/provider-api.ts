import { Router } from 'express';
import { Db } from 'mongodb';

import { findAll } from './provider';

const api = (router: Router, db: Db) => {
  findAll(router, db);
  return router;
};

export default api;
