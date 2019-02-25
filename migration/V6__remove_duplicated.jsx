db.properties.aggregate(
  { $group: {
      _id: { url: "$url" },
      count: { $sum:  1 },
      docs: { $push: "$_id" }
  }},
  { $match: {
      count: { $gt : 1 }
  }}
)

db.properties.remove({_id: ObjectId("5c6da8ab6bdd083919c5d1bc") })
