import rq from './rq';
import cheerio from 'cheerio';

const adapt = async(url, binary = false) => {
  try {
    const page = await rq(url, binary);
    return cheerio.load(page);
  } catch (err) {
    throw new Error(`Error to adapt page ${url}: ${JSON.stringify(err.options)}`);
  }
};

export { adapt };
