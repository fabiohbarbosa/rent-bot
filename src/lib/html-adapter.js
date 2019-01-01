import { rq } from './rq';
import cheerio from 'cheerio';
import Log from '../../config/logger';
import { proxy, unProxy } from './proxy-factory';

const adapt = async(url, binary = false) => {
  try {
    const data = await rq(url, binary);
    return cheerio.load(data);
  } catch (err) {
    throw err;
  }
};

const adaptRetry = async(url, status, isProxied, binary = false) => {
  try {
    return await adapt(url, binary);
  } catch (err) {
    if (err.statusCode === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);
      const newUrl = isProxied ? proxy(unProxy(url)) : url;
      return await adaptRetry(newUrl, status, isProxied, binary);
    }
    throw err;
  }
};

export { adapt, adaptRetry };
