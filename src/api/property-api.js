import { findOne, findAll, patch } from './property';

const api = (router, db) => {
  findOne(router, db);
  findAll(router, db);
  patch(router, db);
  return router;
};

export default api;
