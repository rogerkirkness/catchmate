import Tabular from 'meteor/aldeed:tabular'

new Tabular.Table({
  name: "Customers",
  collection: Customers,
  columns: [
    { data: "customer_code", title: "Code" },
    { data: "customer_name", title: "Name" },
    { data: "customer_street1", title: "Address" },
    { data: "customer_street2", title: "Address 2" },
    { data: "customer_city", title: "City" },
    { data: "customer_province", title: "State" },
    { data: "customer_country", title: "Country" },
    { data: "customer_postal", title: "Zip" },
    {
      tmpl: Meteor.isClient && Template.edit
    }
  ]
})

new Tabular.Table({
  name: "Items",
  collection: Items,
  columns: [
    { data: "item_code", title: "Code" },
    { data: "item_gtin", title: "GTIN" },
    { data: "item_name", title: "Name" },
    { data: "item_brand", title: "Brand" },
    { data: "item_shelfLife", title: "Life (Days)" },
    { data: "item_stdWeight", title: "Weight" },
    { data: "item_minWeight", title: "Min" },
    { data: "item_maxWeight", title: "Max" },
    {
      tmpl: Meteor.isClient && Template.edit
    }
  ]
})