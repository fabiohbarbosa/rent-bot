import CustoJustoMiner from './custojusto';
import Property, { PropertyTopology } from '@models/property';

/**
 * Class used to access protected fields on tested class
  */
 class CustoJustoMinerTest extends CustoJustoMiner {
  constructor() {
    super('[test]');
  }

  _isOnFilter(data: Property): boolean {
    return super._isOnFilter(data);
  }
}

describe('custojusto.ts', () => {
  const victim = new CustoJustoMinerTest();

  //---------------------------
  // _isOnFilter()
  //---------------------------
  describe('_isOnFilter()', () => {
    it('should be on filter when energetic certify, price and topology match and topology is ENUM', () => {
      const property = {
        energeticCertificate: 'a',
        price: 700,
        topology: PropertyTopology.T3
      };

      const isOnFilter = victim._isOnFilter(property);
      expect(isOnFilter).toBe(true);
    });

    it('should be on filter when energetic certify, price and topology match', () => {
      const property = {
        energeticCertificate: 'a',
        price: 700,
        topology: 't3'
      };

      expect(victim._isOnFilter(property)).toBe(true);
    });

    it('should not be on filter when energetic certify not match', () => {
      const property = {
        energeticCertificate: 'd',
        price: 700,
        topology: 't3'
      };

      expect(victim._isOnFilter(property)).toBe(false);
    });

    it('should not be on filter when price not match', () => {
      const property = {
        energeticCertificate: 'b',
        price: 2000,
        topology: 't3'
      };

      expect(victim._isOnFilter(property)).toBe(false);
    });

    it('should not be on filter when topology not match', () => {
      const property = {
        energeticCertificate: 'b',
        price: 700,
        topology: 't0'
      };

      expect(victim._isOnFilter(property)).toBe(false);
    });
  });

});
