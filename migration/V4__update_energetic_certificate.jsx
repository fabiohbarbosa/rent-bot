db.properties.update(
  {
    status: 'MATCHED',
  },
  {
    $set: { status: 'OUT_OF_FILTER' }
  },
  false,
  true
);
