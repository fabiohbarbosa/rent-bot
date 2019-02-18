import { findAll } from './provider';

const api = (router, db) => {
  findAll(router, db);
  return router;
};

export default api;
