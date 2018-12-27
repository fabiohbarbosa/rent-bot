const maxPrice = 800;

export default [
  {
    enabled: false,
    type: 'house',
    topology: 't2',
    logPrefix: '[olx:house:t2]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bfilter_enum_tipologia%5D%5B0%5D=t2&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  },
  {
    enabled: true,
    type: 'house',
    topology: 't3',
    logPrefix: '[olx:house:t3]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  },
  {
    enabled: true,
    type: 'house',
    topology: 't4',
    logPrefix: '[olx:house:t4]',
    url: `https://www.olx.pt/imoveis/casas-moradias-para-arrendar-vender/moradias-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bfilter_enum_tipologia%5D%5B0%5D=t4&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  },

  {
    enabled: false,
    type: 'apartment',
    topology: 't2',
    logPrefix: '[olx:apartment:t2]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t2&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  },
  {
    enabled: true,
    type: 'apartment',
    topology: 't3',
    logPrefix: '[olx:apartment:t3]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t3&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  },
  {
    enabled: true,
    type: 'apartment',
    topology: 't4',
    logPrefix: '[olx:apartment:t4]',
    url: `https://www.olx.pt/imoveis/apartamento-casa-a-venda/apartamentos-arrenda/porto/?search%5Bfilter_float_price%3Ato%5D=${maxPrice}&search%5Bfilter_enum_tipologia%5D%5B0%5D=t4&search%5Bfilter_enum_certificado_energetico%5D%5B0%5D=a-&search%5Bfilter_enum_certificado_energetico%5D%5B1%5D=a&search%5Bfilter_enum_certificado_energetico%5D%5B2%5D=b&search%5Bfilter_enum_certificado_energetico%5D%5B3%5D=b-&search%5Bdescription%5D=1&search%5Border%5D=filter_float_price%3Aasc&min_id=567618410`
  }
];
