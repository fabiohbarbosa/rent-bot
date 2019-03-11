import { ObjectID } from 'bson';
import { Db } from 'mongodb';

const projection = {
  providerId: 1, createAt: 1, price: 1, photos: 1,
  provider: 1, status: 1, title: 1, type: 1, notificated: 1,
  url: 1, topology: 1, ps: 1, energeticCertificate: 1
};

//-------------------------------
// Classes
//-------------------------------
enum PropertyType {
  HOUSE, APARTMENT
}

enum PropertyTopology {
  T2, T3, T4
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
      .find({}, { projection })
      .sort({ createAt: -1 })
      .toArray();
  }

  static findOne = async (db: Db, id: string) => {
    const _id = new ObjectID(id);
    return db.collection('properties')
      .findOne({ _id }, { projection });
  }

}

export { PropertyType, PropertyTopology };
export default Property;
