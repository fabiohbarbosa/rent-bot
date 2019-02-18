import Log from '@config/logger';
import props from '@config/props';

const proxies = [
  'https://proxy-nyc.hidemyass-freeproxy.com/proxy/en-ww',
  'https://proxy-sea.hidemyass-freeproxy.com/proxy/en-ww',
  'https://proxy-fra.hidemyass-freeproxy.com/proxy/en-ww',
  'https://proxy-ams.hidemyass-freeproxy.com/proxy/en-ww',
  'https://proxy-lon.hidemyass-freeproxy.com/proxy/en-ww',
  'https://proxy-prg.hidemyass-freeproxy.com/proxy/en-ww'
];

// start with a random index
let index = Math.floor(Math.random() * proxies.length);

const proxy = url => {
  if (!props.proxy) return url;

  if (index === proxies.length) {
    index = 0;
  }
  index++;

  const proxyEntry = proxies[index - 1];
  const base64 = Buffer.from(url).toString('base64').replace('=', '');
  const proxiedUrl = `${proxyEntry}/${base64.replace('=', '')}`;

  Log.info(`Proxing ${url} to ${proxiedUrl}`);

  return proxiedUrl;
};

const unProxy = url => {
  if (!props.proxy) return url;

  const pieceUrl = url.split('/');
  const realUrl = Buffer.from(pieceUrl[pieceUrl.length - 1], 'base64').toString('ascii');
  return realUrl;
};

export { proxy, unProxy };
