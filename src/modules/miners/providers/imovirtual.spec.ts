import ImovirtualMiner from './imovirtual';

/**
 * Class used to access protected fields on tested class
  */
 class ImovirtualMinerTest extends ImovirtualMiner {
  constructor() {
    super('[miner:imovirtual]');
  }

  _getPriceFromArray(priceArray: string[]): number {
    return super._getPriceFromArray(priceArray);
  }
}

describe('property-cache.ts', () => {

  const victim = new ImovirtualMinerTest();

  //---------------------------
  // _getPriceFromArray()
  //---------------------------
  describe('_getPriceFromArray()', () => {
    it('should merge price with thousand separators coming from array of strings', () => {
      const priceArray = ['1', '500', '€'];
      const price = victim._getPriceFromArray(priceArray);

      expect(price).toBe(1500);
    });

    it('should merge price without thousand separators coming from array of strings', () => {
      const priceArray = ['500', '€'];
      const price = victim._getPriceFromArray(priceArray);

      expect(price).toBe(500);
    });

  });

});
