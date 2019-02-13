const ensureRealProvider = (logPrefix, provider, url) => {
  if (provider !== 'olx') {
    return provider;
  }

  let realProvider = null;
  if (url.includes('https://www.imovirtual.com')) {
    realProvider = 'imovirtual';
    Log.info(`${logPrefix} Changing availability class from '${provider}' to '${realProvider}' for ${url}`);
  }
  else if (url.includes('https://www.olx.pt')) {
    realProvider = provider;
  }
  else {
    Log.warn(`${logPrefix} Cannot find availability class to url ${url} and provider ${provider}`);
    throw new Error(`Not found provider for url ${url}`);
  }

  return realProvider;
}

export { ensureRealProvider };
