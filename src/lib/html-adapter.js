import rq from './rq';
import cheerio from 'cheerio';
import Log from '../../config/logger';

const adapt = async(url, binary = false) => {
  try {
    const page = await rq(url, binary);
    return cheerio.load(page);
  } catch (err) {
    Log.error(JSON.stringify(err.options));
    throw err;
  }
};

export { adapt };
