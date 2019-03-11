abstract class AvailabilityProvider {
  constructor(public logPrefix: string) {}
  abstract evaluate(url: string): Promise<void>;
}

export default AvailabilityProvider;
