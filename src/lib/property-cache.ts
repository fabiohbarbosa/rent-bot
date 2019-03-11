import { Db } from 'mongodb';
import { EventEmitter } from 'events';

import Property from '@models/property';
import Log from '@config/logger';

interface PropertCacheEventCallback {
  (properties: Property[], property: Property);
}

class PropertyCache {
  properties: Property[];
  private event: EventEmitter;

  constructor(private db: Db) {
    this.event = new EventEmitter();
  }

  /**
   * load all properties
   */
  async setup() {
    this.properties = await Property.findAll(this.db);
  }

  add(property: Property) {
    Log.info(`Properties array size before add: ${this.properties.length}`);
    this.properties.unshift(property);
    Log.info(`Properties array size after add: ${this.properties.length}`);
    this.event.emit('add', [this.properties, property]);
  }

  updateFromUrl(url: string, fieldsToUpdate: Property) {
    this.properties = this.properties.map(p => {
      if (p.url === url) {
        return { ...p, ...fieldsToUpdate }
      }
      return p;
    })
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
