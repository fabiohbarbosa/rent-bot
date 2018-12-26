// remove t0 and t1, because custojust has a bug in search by house
const regexes = [
  /\b(?:t0|t1|t2|kitchenette)\b/gi
];

const types = {
  house: false,
  apartment: true,
}

const topologies = [
  { name: 't2', code: 5, enabled: false },
  { name: 't3', code: 6, enabled: true },
  { name: 't4', code: 7, enabled: true },
];

const counties = [
  { name: 'gondomar', enabled: true },
  { name: 'maia', enabled: true },
  { name: 'matosinhos', enabled: true },
  { name: 'porto', enabled: true },
  { name: 'valongo', enabled: true },
  { name: 'vila-nova-de-gaia', enabled: true }
];

const buildUrls = () => {
  const urls = [];
  counties.filter(c => c.enabled).forEach(c => {
    topologies.filter(t => t.enabled).forEach(t => {
      urls.push({
        enabled: types.house,
        name: `house:${c.name}:${t.name}`,
        url: `https://www.custojusto.pt/porto/${c.name}/moradias-arrendar?ps=1&pe=7&roe=${t.code}&ros=${t.code}`
      });

      urls.push({
        enabled: types.apartment,
        name: `apartment:${c.name}:${t.name}`,
        url: `https://www.custojusto.pt/porto/${c.name}/apartamentos-arrendar?ps=1&pe=7&roe=${t.code}&ros=${t.code}`
      });
    });
  });
  return urls;
}

const urls = buildUrls();

const itemsPage = 40;
const maxPrice = 850;

export { urls, itemsPage, regexes, maxPrice }
