const shape = '%28%28qmq%7BFvvot%40dre%40yiy%40laGrmTvtHk%7BIx%7CApd%5Dehz%40~qP%29%29';
const maxPrice = 800;
const itemsPage = 30;

const filters = [
  {
    enabled: false,
    type: 'house',
    topology: 't2',
    logPrefix: '[idealista:house:t2]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},moradias,t2/?shape=${shape}`
  },
  {
    enabled: false,
    type: 'house',
    topology: 't3',
    logPrefix: '[idealista:house:t3]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},moradias,t3/?shape=${shape}`
  },
  {
    enabled: false,
    type: 'house',
    topology: 't4',
    logPrefix: '[idealista:house:t4]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},moradias,t4-t5/?shape=${shape}`
  },

  {
    enabled: true,
    type: 'apartment',
    topology: 't2',
    logPrefix: '[idealista:apartment:t2]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},apartamentos,duplex,recuados,t2/?shape=${shape}`
  },
  {
    enabled: false,
    type: 'apartment',
    topology: 't3',
    logPrefix: '[idealista:apartment:t3]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},apartamentos,duplex,recuados,t3/?shape=${shape}`
  },
  {
    enabled: false,
    type: 'apartment',
    topology: 't4',
    logPrefix: '[idealista:apartment:t4]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${maxPrice},apartamentos,duplex,recuados,t4-t5/?shape=${shape}`
  }
];

export { filters, itemsPage };
