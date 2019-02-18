db.properties.updateMany(
  { property: { $exists: true } },
  { $unset: { property: "" } }
)
