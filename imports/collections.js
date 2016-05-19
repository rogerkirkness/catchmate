const Customers = new Mongo.Collection('customers')
const Batches = new Mongo.Collection('batches')
const Items = new Mongo.Collection('items')
const Ingredients = new Mongo.Collection('ingredients')
const Labels = new Mongo.Collection('labels')
const Scales = new Mongo.Collection('scales')
const Printers = new Mongo.Collection('printers')
const Company = new Mongo.Collection('company')

var CustomersSchema = {}
var BatchesSchema = {}
var ItemsSchema = {}
var IngredientsSchema = {}
var LabelsSchema = {}
var ScalesSchema = {}
var PrintersSchema = {}

CustomersSchema = new SimpleSchema({
  customer_code: {
    type: String,
    max: 8,
    unique: true
  },
  customer_name: {
    type: String
  },
  customer_street1: {
    type: String
  },
  customer_street2: {
    type: String,
    optional: true
  },
  customer_city: {
    type: String
  },
  customer_province: {
    type: String
  },
  customer_country: {
    type: String
  },
  customer_postal: {
    type: String
  }
})

BatchesSchema = new SimpleSchema({
  item_code: {
    type: String,
    max: 8
  },
  cust_code: {
    type: String,
    max: 8,
    optional: true
  },
  item_weight: {
    type: Number
  },
  num_units: {
    type: Number
  },
  createdAt: {
    type: Date
  },
  batch_code: {
    type: Number,
    optional: true
  }
})

ItemsSchema = new SimpleSchema({
  item_gtin: {
    type: String,
    max: 8,
    unique: true
  },
  item_name: {
    type: String
  },
  item_unit: {
    type: String
  },
  item_brand: {
    type: String,
    optional: true
  },
  item_shelfLife: {
    type: Number
  },
  item_stdWeight: {
    type: Number,
    optional: true,
    decimal: true
  },
  item_minWeight: {
    type: Number,
    optional: true,
    decimal: true
  },
  item_maxWeight: {
    type: Number,
    optional: true,
    decimal: true
  },
  item_ingredients: {
    type: String,
    optional: true
  }
})

IngredientsSchema = new SimpleSchema({
  ingredients_code: {
    type: String,
    max: 8,
    unique: true
  },
  ingredients_list: {
    type: String
  }
})

LabelsSchema = new SimpleSchema({
  label_code: {
    type: String,
    max: 8,
    unique: true
  },
  label_layout: {
    type: String
  }
})

ScalesSchema = new SimpleSchema({
  scale_code: {
    type: String,
    max: 8,
    unique: true
  },
  scale_name: {
    type: String,
    max: 30
  },
  scale_port: {
    type: String,
    max: 5
  },
  scale_host: {
    type: String,
    max: 15
  }
})

PrintersSchema = new SimpleSchema({
  printer_code: {
    type: String,
    max: 8,
    unique: true
  },
  printer_name: {
    type: String,
    max: 30
  },
  printer_port: {
    type: String,
    max: 5,
    optional: true
  },
  printer_host: {
    type: String,
    max: 15,
    optional: true
  }
})

Customers.attachSchema(CustomersSchema)
Batches.attachSchema(BatchesSchema)
Items.attachSchema(ItemsSchema)
Ingredients.attachSchema(IngredientsSchema)
Labels.attachSchema(LabelsSchema)
Scales.attachSchema(ScalesSchema)
Printers.attachSchema(PrintersSchema)

export { Customers }
export { Batches }
export { Items }
export { Ingredients }
export { Labels }
export { Scales }
export { Printers }
export { Company }
