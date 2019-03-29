import { Db } from 'mongodb';
import { EventEmitter } from 'events';

import Property from '@models/property';
import Log from '@config/logger';

interface PropertCacheEventCallback {
  (properties: Property[], property: Property);
}

class PropertyCache {
  protected _properties: Property[] = [];
  protected event: EventEmitter;

  constructor(private db: Db) {
    this.event = new EventEmitter();
  }

  get properties(): Property[] {
    return this._properties;
  }

  /**
   * load all properties
   */
  async setup() {
    this._properties = await Property.findAll(this.db);
  }

  add(property: Property) {
    this._properties.unshift(property);
    this.event.emit('add', [this._properties, property]);
  }

  updateByUrl(url: string, fieldsToUpdate: Property) {
    let exists = false;

    this._properties = this._properties.map(p => {
      if (p.url === url) {
        exists = true;
        return { ...p, ...fieldsToUpdate };
      }
      return p;
    });

    if (!exists) {
      throw new Error(`Not found property '${url}' on cache`);
    }
  }

  removeByUrl(url: string) {
    let property: Property;
    this._properties = this._properties.filter(p => {
      if (p.url === url) property = p;
      return p.url !== url;
    });
    this.event.emit('remove', [this._properties, property]);
  }

  onAdd(callback: PropertCacheEventCallback) {
    this.event.on('add', callback);
  }

  onRemove(callback: PropertCacheEventCallback) {
    this.event.on('remove', callback);
  }

}

export default PropertyCache;
