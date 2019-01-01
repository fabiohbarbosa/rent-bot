import { dataFilters } from '../../../config/props';

export default [
  {
    enabled: false,
    type: 'house',
    topology: 't2',
    logPrefix: '[crawler:imovirtual:house:t2]',
    url: `https://www.imovirtual.com/arrendar/moradia/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=2&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  },
  {
    enabled: true,
    type: 'house',
    topology: 't3',
    logPrefix: '[crawler:imovirtual:house:t3]',
    url: `https://www.imovirtual.com/arrendar/moradia/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=3&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  },
  {
    enabled: true,
    type: 'house',
    topology: 't4',
    logPrefix: '[crawler:imovirtual:house:t4]',
    url: `https://www.imovirtual.com/arrendar/moradia/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=4&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  },
  {
    enabled: false,
    type: 'apartment',
    topology: 't2',
    logPrefix: '[crawler:imovirtual:apartment:t2]',
    url: `https://www.imovirtual.com/arrendar/apartamento/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=2&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  },
  {
    enabled: true,
    type: 'apartment',
    topology: 't3',
    logPrefix: '[crawler:imovirtual:apartment:t3]',
    url: `https://www.imovirtual.com/arrendar/apartamento/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=3&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  },
  {
    enabled: true,
    type: 'apartment',
    topology: 't4',
    logPrefix: '[crawler:imovirtual:apartment:t4]',
    url: `https://www.imovirtual.com/arrendar/apartamento/porto/?search%5Bfilter_float_price%3Ato%5D=${dataFilters.maxPrice}&search%5Bfilter_enum_rooms_num%5D%5B0%5D=4&search%5Bfilter_enum_energy_certificate%5D%5B0%5D=aplus&search%5Bfilter_enum_energy_certificate%5D%5B1%5D=a&search%5Bfilter_enum_energy_certificate%5D%5B2%5D=b&search%5Bfilter_enum_energy_certificate%5D%5B3%5D=bminus&search%5Bfilter_enum_energy_certificate%5D%5B4%5D=c&search%5Bdescription%5D=1&search%5Border%5D=created_at_first%3Adesc`
  }
];
