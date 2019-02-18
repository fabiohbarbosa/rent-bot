// remove t0 and t1, because custojust has a bug in search by house
const regexes = [
  /\b(?:t0|t1|t2|kitchenette)\b/gi
];

const types = {
  house: true,
  apartment: true,
};

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

const buildFilters = () => {
  const filters = [];
  counties.filter(c => c.enabled).forEach(c => {
    topologies.filter(t => t.enabled).forEach(t => {
      filters.push({
        enabled: types.house,
        type: 'house',
        topology: t.name,
        logPrefix: `[crawler:custojusto:${c.name}:house:${t.name}]`,
        url: `https://www.custojusto.pt/porto/${c.name}/moradias-arrendar?ps=4&pe=7&roe=${t.code}&ros=${t.code}`
      });

      filters.push({
        enabled: types.apartment,
        type: 'apartment',
        topology: t.name,
        logPrefix: `[crawler:custojusto:${c.name}:apartment:${t.name}]`,
        url: `https://www.custojusto.pt/porto/${c.name}/apartamentos-arrendar?ps=4&pe=7&roe=${t.code}&ros=${t.code}`
      });
    });
  });
  return filters;
};

const filters = buildFilters();

const itemsPage = 40;

export { filters, itemsPage, regexes };
