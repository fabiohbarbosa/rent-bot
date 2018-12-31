db.properties.update(
  {},
  {
    $set: {
      dataMiningLastCheck: new Date(),
      isDataMiningLastCheck: false
    }
  },
  false,
  true
);
