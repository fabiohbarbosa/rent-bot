import { findOne, findAll, patch } from './properties';

/**
 * @typedef {import('express').Router} Router
 * @typedef {import('mongodb').Db} MongoDb
 */

const api = (router, db) => {

  findOne(router, db);
  findAll(router, db);
  patch(router, db);

  return router;
};

export default api;
