import { dataFilters } from '@config/props';

export default [
  {
    enabled: false,
    type: 'house',
    topology: 't2',
    logPrefix: '[crawler:olx:house:t2]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t2&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  },
  {
    enabled: false,
    type: 'house',
    topology: 't3',
    logPrefix: '[crawler:olx:house:t3]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  },
  {
    enabled: false,
    type: 'house',
    topology: 't4',
    logPrefix: '[crawler:olx:house:t4]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t4&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  },

  {
    enabled: false,
    type: 'apartment',
    topology: 't2',
    logPrefix: '[crawler:olx:apartment:t2]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t2&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  },
  {
    enabled: false,
    type: 'apartment',
    topology: 't3',
    logPrefix: '[crawler:olx:apartment:t3]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  },
  {
    enabled: false,
    type: 'apartment',
    topology: 't4',
    logPrefix: '[crawler:olx:apartment:t4]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t4&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc`
  }
];
