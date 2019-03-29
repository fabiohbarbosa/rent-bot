import { ObjectID } from 'bson';
import { Db } from 'mongodb';
import { dataFilters } from '@config/props';

const projection = {};

//-------------------------------
// Classes
//-------------------------------
enum PropertyType {
  HOUSE, APARTMENT
}

enum PropertyTopology {
  T2 = 't2',
  T3 = 't3',
  T4 = 't4',
  UNKNOWN = 'unknown'
}

class Property {
  _id?: ObjectID;
  providerId?: string;
  createAt?: Date;
  photos?: string[];
  price?: number;
  provider?: string;
  status?: string;
  subtitle?: string;
  title?: string;
  topology?: string | PropertyTopology;
  type?: string | PropertyType;
  url?: string;
  availabilityLastCheck?: Date;
  notificated?: boolean;
  isAvailabilityLastCheck?: boolean;
  dataMiningLastCheck?: Date;
  isDataMiningLastCheck?: boolean;
  energeticCertificate?: string; // TODO enum
  notificatedAt?: Date;
  timesUnvailable?: number;
  dirty?: boolean;

  static findAll = async (db: Db) => {
    return await db.collection('properties')
      .find({ price: { $lte: dataFilters.maxPrice } }, { projection })
      .sort({ createAt: -1 })
      .toArray();
  }

  static findOneById = async (db: Db, id: string) => {
    const _id = new ObjectID(id);
    return db.collection('properties')
      .findOne({ _id }, { projection });
  }

  static findOneByUrl = async (db: Db, url: string) => {
    return db.collection('properties')
      .findOne({ url }, { projection });
  }

  static findByQuery = (db: Db, query: {}) => {
    return db.collection('properties')
      .find(query, { projection }).toArray();
  }

}

export { PropertyType, PropertyTopology };
export default Property;
