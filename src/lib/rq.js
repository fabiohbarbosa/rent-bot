import axios from 'axios';
import Log from '../../config/logger';
import { proxy, unProxy } from './proxy-factory';

const rq = async url => {
  return axios.get(url, {
    headers: {
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; WebView/3.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/52.0.2743.116 Safari/537.36 Edge/15.15063',
      'x-requested-with': 'XMLHttpRequest',
      'cache-control': 'no-cache'
    },
  });
};

const rqRetry = async(url, status, isProxied) => {
  try {
    return await rq(url);
  } catch (err) {
    if (err.response && err.response.status === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);

      const newUrl = isProxied ? proxy(unProxy(url)) : url;
      return await rqRetry(newUrl, status, isProxied);
    }
    throw err;
  }
};

export { rq, rqRetry };
