import { EventEmitter } from 'events';
import Property from '@models/property';
import { Db } from 'mongodb';

interface PropertCacheEventCallback {
  (properties: Property[], property: Property);
}

class PropertyCache {
  properties: Property[];
  private event: EventEmitter;

  constructor(private db: Db) {
    this.event = new EventEmitter();
    this._fillProperties();
  }

  private async _fillProperties() {
    this.properties = await Property.findAll(this.db);
    console.log('abc');
  }

  add(property: Property) {
    this.properties.push(property);
    this.event.emit('add', [this.properties, property]);
  }

  remove(property: Property) {
    const _id = property._id;
    this.properties = this.properties.filter(p => p._id !== _id);
    this.event.emit('remove', [this.properties, property]);
  }

  removeFromUrl(url: string) {
    let property: Property;
    this.properties = this.properties.filter(p => {
      if (p.url === url) property = p;
      return p.url !== url;
    });
    this.event.emit('remove', [this.properties, property]);
  }

  onAdd(callback: PropertCacheEventCallback) {
    this.event.on('add', callback);
  }

  onRemove(callback: PropertCacheEventCallback) {
    this.event.on('remove', callback);
  }

}

export default PropertyCache;
