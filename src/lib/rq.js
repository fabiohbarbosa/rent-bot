import request from 'request-promise';
import Log from '../../config/logger';
import { proxy, unProxy } from './proxy-factory';

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
  try {
    return await rq(url, binary);
  } catch (err) {
    if (err.statusCode === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);

      const newUrl = isProxied ? proxy(unProxy(url)) : url;
      return await rqRetry(newUrl, status, isProxied, binary);
    }
    throw err;
  }
};

export { rq, rqRetry };
