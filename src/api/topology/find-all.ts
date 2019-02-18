import Log from '@config/logger';
import { logPrefix, path, topologies } from './consts';

const api = (router, db) => {
  router.get(path, async(req, res, next) => {
    Log.info(`${logPrefix} Fetching the topologies`);

    Log.info(`${logPrefix} Found ${topologies.length} topologies`);
    res.json(topologies.sort());
  });
};

export default api;
