import rq from 'request-promise';
import cheerio from 'cheerio';

const adapt = async(url, binary = false) => {
  try {
    const page = await rq({
      url,
      encoding: binary ? 'binary' : null,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
      }
    });
    return cheerio.load(page);
  } catch (err) {
    throw err;
  }
};

export { adapt };
