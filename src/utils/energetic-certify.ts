import { dataFilters } from '@config/props';

const isMatched = (energicCertify) => {
  return dataFilters.energeticCertificates.includes(energicCertify.toLowerCase());
};

export { isMatched };
