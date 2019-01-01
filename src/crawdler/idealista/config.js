import { dataFilters } from '../../../config/props';
const shape = '%28%28qmq%7BFvvot%40dre%40yiy%40laGrmTvtHk%7BIx%7CApd%5Dehz%40~qP%29%29';
const itemsPage = 30;

const filters = [
  {
    enabled: true,
    type: 'house',
    logPrefix: '[crawler:idealista:house:t3:t4]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${dataFilters.maxPrice},moradias,t3,t4-t5/?shape=${shape}`
  },
  {
    enabled: true,
    type: 'apartment',
    logPrefix: '[crawler:idealista:apartment:t3:t4]',
    url: `https://www.idealista.pt/areas/arrendar-casas/com-preco-max_${dataFilters.maxPrice},apartamentos,duplex,t3,t4-t5/?shape=${shape}`
  }
];

export { filters, itemsPage };
