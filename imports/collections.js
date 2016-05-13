import { Mongo } from 'meteor/mongo'
import { SimpleSchema } from 'meteor/aldeed:simple-schema'

const Customers = new Mongo.Collection('customers')
const Batches = new Mongo.Collection('batches')
const Items = new Mongo.Collection('items')
const Ingredients = new Mongo.Collection('ingredients')
const Labels = new Mongo.Collection('labels')
const Company = new Mongo.Collection('company')
const Scales = new Mongo.Collection('scales')
const Printers = new Mongo.Collection('printers')

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
    label: 'Customer Code',
    max: 8,
    unique: true
  },
  customer_name: {
    type: String,
    label: 'Customer Name'
  },
  customer_street1: {
    type: String,
    label: 'Address Line 1'
  },
  customer_street2: {
    type: String,
    label: 'Address Line 2',
    optional: true
  },
  customer_city: {
    type: String,
    label: 'City'
  },
  customer_province: {
    type: String,
    label: 'Province'
  },
  customer_country: {
    type: String,
    label: 'Country'
  },
  customer_postal: {
    type: String,
    label: 'Postal / Zip'
  }
})

BatchesSchema = new SimpleSchema({
  item_code: {
    type: String,
    label: 'Item Code',
    max: 8
  },
  cust_code: {
    type: String,
    label: 'Customer Code',
    max: 8,
    optional: true
  },
  item_weight: {
    type: Number
  },
  num_units: {
    type: Number,
    label: 'Number of Units'
  },
  createdAt: {
    type: Date
  },
  batch_code: {
    type: Number,
    label: 'Batch Code',
    optional: true
  }
})

ItemsSchema = new SimpleSchema({
  item_gtin: {
    type: String,
    label: 'Item Code',
    max: 8,
    unique: true
  },
  item_name: {
    type: String,
    label: 'Item Name'
  },
  item_unit: {
    type: String,
    label: 'Item Unit'
  },
  item_brand: {
    type: String,
    label: 'Item Brand',
    optional: true
  },
  item_shelfLife: {
    type: Number,
    label: 'Shelf Life (Days)'
  },
  item_stdWeight: {
    type: Number,
    label: 'Std Weight (g)',
    optional: true,
    decimal: true
  },
  item_minWeight: {
    type: Number,
    label: 'Min Weight (g)',
    optional: true,
    decimal: true
  },
  item_maxWeight: {
    type: Number,
    label: 'Max Weight (g)',
    optional: true,
    decimal: true
  },
  item_ingredients: {
    type: String,
    label: 'Ingredients List',
    optional: true
  }
})

IngredientsSchema = new SimpleSchema({
  ingredients_code: {
    type: String,
    label: 'Ingredients Code',
    max: 8,
    unique: true
  },
  ingredients_list: {
    type: String,
    label: 'Ingredients List'
  }
})

LabelsSchema = new SimpleSchema({
  label_code: {
    type: String,
    label: 'Label Code',
    max: 8,
    unique: true
  },
  label_layout: {
    type: String,
    label: 'Label Layout'
  }
})

ScalesSchema = new SimpleSchema({
  scale_code: {
    type: String,
    label: 'Scale Code',
    max: 8,
    unique: true
  },
  scale_name: {
    type: String,
    label: 'Scale Name',
    max: 30
  },
  scale_port: {
    type: String,
    label: 'Scale Port',
    max: 5
  },
  scale_host: {
    type: String,
    label: 'Scale Host',
    max: 15
  }
})

PrintersSchema = new SimpleSchema({
  printer_code: {
    type: String,
    label: 'Printer Code',
    max: 8,
    unique: true
  },
  printer_name: {
    type: String,
    label: 'Printer Name',
    max: 30
  },
  printer_port: {
    type: String,
    label: 'Printer Port',
    max: 5,
    optional: true
  },
  printer_host: {
    type: String,
    label: 'Printer Host',
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
export { Printers }
export { Scales }
export { Company }
export { Labels }
