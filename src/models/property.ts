import { ObjectID } from 'bson';

enum PropertyType {
  HOUSE, APARTMENT
}

enum PropertyTopology {
  T2, T3, T4
}

interface Property {
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
}

export { PropertyType, PropertyTopology };
export default Property;
