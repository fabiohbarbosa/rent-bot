db.properties.aggregate(
  { $group: {
      _id: { provider: "$provider" },
      count: { $sum:  1 },
      docs: { $push: "$provider" }
  }},
  { $match: {
      count: { $gt : 1 }
  }}
)

db.properties.remove({_id: ObjectId("5c6da8ab6bdd083919c5d1bc") })
