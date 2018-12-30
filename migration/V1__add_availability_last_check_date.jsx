db.properties.update(
  { },
  { $set: {availabilityLastCheck: new Date()} },
  false,
  true
);
