import { findAll } from './status';

const api = (router, db) => {
  findAll(router, db);
  return router;
};

export default api;
