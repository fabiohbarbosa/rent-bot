import { rq } from './rq';
import cheerio from 'cheerio';
import Log from '../../config/logger';
import { proxy, unProxy } from './proxy-factory';

const adapt = async url => {
  try {
    const { data } = await rq(url);
    return cheerio.load(data);
  } catch (err) {
    throw err;
  }
};

const adaptRetry = async(url, status, isProxied) => {
  try {
    return await adapt(url);
  } catch (err) {
    if (err.response && err.response.status === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);
      const newUrl = isProxied ? proxy(unProxy(url)) : url;
      return await adaptRetry(newUrl, status, isProxied);
    }
    throw err;
  }
};

export { adapt, adaptRetry };
