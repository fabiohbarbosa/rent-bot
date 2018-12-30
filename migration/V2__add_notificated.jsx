db.properties.update(
  { },
  { $set: { notificated: false } },
  false,
  true
);
