import PropertyCache from '@lib/property-cache';

class PropertyDuplicationAnalyzer {
  constructor(private cache: PropertyCache) {
    this._listenPropertyAddChanges();
  }

  _listenPropertyAddChanges() {
    this.cache.onAdd(properties => {

    });
  }
}

export default PropertyDuplicationAnalyzer;
