import { rq } from './rq';
import cheerio from 'cheerio';
import Log from '../../config/logger';
import props from '../../config/props';
import { proxy, unProxy } from './proxy-factory';
import * as fs from 'fs';

const maxRequests = {};

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0; const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

const adapt = async(url, binary = false) => {
  try {
    const data = await rq(url, binary);
    return cheerio.load(data);
  } catch (err) {
    Log.debug(err);

    // Save request error body as a HTML file to double check the error
    if (err.response && err.response.toJSON) {
      const tmp = await cheerio.load(err.response.toJSON().body);
      const tmpFolder = 'logs';
      const filename = `${tmpFolder}/${uuidv4()}.html`;

      Log.error('Trying to save HTTP request error as a HTML file');

      fs.mkdir(tmpFolder, { recursive: true }, errMkdir => {
        if (errMkdir) {
          Log.error(`Error to create logs folder for url ${url}`);
          Log.error(errMkdir);
          return;
        }
        fs.writeFile(filename, tmp.html(), errWrite => {
          if (errWrite) {
            Log.error(errWrite);
            Log.error(`Error to save error page for ${url} as HTML`);
            return;
          }
          Log.error(`The file error content was saved for ${url} as ${filename}!`);
        });
      });
    }

    throw err;
  }
};

const adaptRetry = async(url, status, isProxied, binary = false) => {
  // increase times that URL was requested
  const unProxyUrl = isProxied ? unProxy(url) : url;
  const totalRequests = maxRequests[unProxyUrl] || 0;
  maxRequests[unProxyUrl] = totalRequests + 1;

  // request
  try {
    return await adapt(url, binary);
  } catch (err) {
    // throw exception when it reachs the total requests configured
    if (maxRequests[unProxyUrl] === props.retries) {
      maxRequests[unProxyUrl] = 0;
      throw new Error(`Exceed ${props.retries} retries time to request ${unProxyUrl} - ${err.statusCode}`);
    }

    if (err.statusCode === status) {
      Log.warn(`Error ${status} to access ${url}. Trying again...`);
      return await adaptRetry(proxy(unProxyUrl), status, isProxied, binary);
    }
    throw err;
  }
};

export { adapt, adaptRetry };
