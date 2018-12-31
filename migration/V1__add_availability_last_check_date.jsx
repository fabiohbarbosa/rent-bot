db.properties.update(
  {},
  {
    $set: {
      availabilityLastCheck: new Date(),
      isAvailabilityLastCheck: false
    }
  },
  false,
  true
);
