import request from 'request-promise';
import Log from '../../config/logger';
import props from '../../config/props';
import { proxy, unProxy } from './proxy-factory';

const maxRequests = {};

const rq = async(url, binary = false) => {
  return request({
    url,
    encoding: binary ? 'binary' : null,
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; WebView/3.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
      'x-requested-with': 'XMLHttpRequest',
      'cache-control': 'no-cache'
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
