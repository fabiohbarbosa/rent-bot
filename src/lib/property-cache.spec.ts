import PropertyCache from './property-cache';
import Property from '@models/property';

/**
 * Class used to access protected fields on tested class
  */
 class PropertyCacheTest extends PropertyCache {
  constructor() {
    super(null);
  }

  mockProperties(properties: Property[]) {
    super._properties = properties;
  }
}

describe('property-cache.ts', () => {

  const victim = new PropertyCacheTest();

  //---------------------------
  // add()
  //---------------------------
  describe('add()', () => {
    it('should add new property at the begin of array', () => {
      victim.mockProperties([
        { url: 'http://foo.co.uk', title: 'foo' },
        { url: 'http://bar.co.uk', title: 'bar' }
      ]);

      const property = {
        url: 'http://foo-bar.co.uk',
        title: 'foo-bar'
      };

      victim.add(property);
      expect(victim.properties[0]).toBe(property);
      expect(victim.properties.length).toBe(3);
    });
  });

  //---------------------------
  // updateByUrl()
  //---------------------------
  describe('updateByUrl()', () => {
    it('should update the fields', () => {
      const url = 'http://foo-bar.co.uk';
      victim.mockProperties([{
        url,
        title: 'foo-bar'
      }]);

      victim.updateByUrl(url, { title: 'fooBar' });
      expect(victim.properties[0].title).toBe('fooBar');
    });

    it('should merge new fields', () => {
      const url = 'http://foo-bar.co.uk';
      victim.mockProperties([{
        url,
        title: 'foo-bar'
      }]);

      victim.updateByUrl(url, { subtitle: 'foo-bar-subtitle' });
      expect(victim.properties[0].subtitle).toBe('foo-bar-subtitle');
    });

    it('should throw exception for unexist URL', () => {
      victim.mockProperties([{
        url: 'http://foo-bar.co.uk',
        title: 'foo-bar'
      }]);

      const fct = () => {
        victim.updateByUrl('http://unexist-foo-bar.co.uk', { title: 'foo-bar' });
      };

      expect(fct).toThrowError();
    });

  });

  //---------------------------
  // removeByUrl()
  //---------------------------
  describe('removeByUrl()', () => {
    it('should remove from cache by url', () => {
      victim.mockProperties([
        { url: 'http://foo.co.uk', title: 'foo' },
        { url: 'http://bar.co.uk', title: 'bar' }
      ]);

      victim.removeByUrl('http://foo.co.uk');

      expect(victim.properties.length).toBe(1);
    });
  });

});
