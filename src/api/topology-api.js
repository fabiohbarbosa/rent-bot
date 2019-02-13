import { findAll } from './topology';

const api = (router, db) => {
  findAll(router, db);
  return router;
};

export default api;
