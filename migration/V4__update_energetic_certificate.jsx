db.properties.update(
  {
    status: 'MATCHED',
    energeticCertificate: { $in: ['unknown', 'd', null, 'e', 'c', 'isento', 'f'] }
  },
  {
    $set: { status: 'OUT_OF_FILTER' }
  },
  false,
  true
);
