import { PropertyType, PropertyTopology } from '@models/property';

abstract class CrawlerProvider {
  constructor(protected logPrefix: string,
              protected type: PropertyType,
              protected topology: PropertyTopology,
              protected url: string) {
  }

  abstract parse();
}

interface CrawlerFilter {
  enabled: boolean;
  type: string;
  topology?: string;
  logPrefix: string;
  url: string;
}

export { CrawlerFilter };
export default CrawlerProvider;
