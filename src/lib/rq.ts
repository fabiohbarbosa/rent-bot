import request from 'request-promise';
import Log from '@config/logger';
import props from '@config/props';
import { proxy, unProxy } from './proxy-factory';

const maxRequests = {};

const rq = async(url, binary = false) => {
  const agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/7046A194A';
  return request({
    url,
    encoding: binary ? 'binary' : null,
    headers: {
      Connection: 'keep-alive',
      'Cache-Control': ' max-age=0',
      Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': agent,
      Referer: 'https://bing.com/'
    }
  });
};

const rqRetry = async(url, status, isProxied, binary = false) => {
  // increase times that URL was requested
  const unProxyUrl = isProxied ? unProxy(url) : url;
  const totalRequests = maxRequests[unProxyUrl] || 0;
  maxRequests[unProxyUrl] = totalRequests + 1;

  // request
  try {
    return await rq(url, binary);
  } catch (err) {
    Log.debug(err);
    // throw exception when it reachs the total requests configured
    if (maxRequests[unProxyUrl] === props.retries) {
      maxRequests[unProxyUrl] = 0;
      throw new Error(`Exceed ${props.retries} retries time to request ${unProxyUrl} - ${err.statusCode}`);
    }

    if (err.statusCode === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);
      return await rqRetry(proxy(unProxyUrl), status, isProxied, binary);
    }
    throw err;
  }
};

export { rq, rqRetry };
