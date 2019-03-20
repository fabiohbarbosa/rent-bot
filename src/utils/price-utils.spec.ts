import { priceFromArrayLeftSymbol, priceFromArrayRightSymbol } from './price-utils';

describe('property-cache.ts', () => {

  //---------------------------
  // priceFromArrayLeftSymbol()
  //---------------------------
  describe('priceFromArrayRightSymbol()', () => {
    it('should merge price with thousand separators coming from array of strings', () => {
      const priceArray = ['€', '1', '500'];
      const price = priceFromArrayLeftSymbol(priceArray);

      expect(price).toBe(1500);
    });

    it('should merge price without thousand separators coming from array of strings', () => {
      const priceArray = ['€', '500'];
      const price = priceFromArrayLeftSymbol(priceArray);

      expect(price).toBe(500);
    });
  });

  //---------------------------
  // priceFromArrayRightSymbol()
  //---------------------------
  describe('priceFromArrayRightSymbol()', () => {
    it('should merge price with thousand separators coming from array of strings', () => {
      const priceArray = ['1', '500', '€'];
      const price = priceFromArrayRightSymbol(priceArray);

      expect(price).toBe(1500);
    });

    it('should merge price without thousand separators coming from array of strings', () => {
      const priceArray = ['500', '€'];
      const price = priceFromArrayRightSymbol(priceArray);

      expect(price).toBe(500);
    });
  });

});
