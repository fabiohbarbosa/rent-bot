const priceFromArrayLeftSymbol = (priceArray: string[]): number => {
  priceArray.shift();
  return parseInt(priceArray.join(''), 10);
};

const priceFromArrayRightSymbol = (priceArray: string[]): number => {
  priceArray.pop();
  return parseInt(priceArray.join(''), 10);
};

export { priceFromArrayLeftSymbol, priceFromArrayRightSymbol };
