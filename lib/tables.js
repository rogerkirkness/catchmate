// Define table object
TabularTables = {};

// Table for item master
TabularTables.Items = new Tabular.Table({
  name: "Items",
  collection: Items,
  columns: [
    {data: 'item_gtin', title: 'Item Code' },
    {data: 'item_name', title: 'Item Name' },
    {data: 'item_unit', title: 'Item Unit' },
    {data: 'item_brand', title: 'Item Brand' },
    {data: 'item_shelfLife', title: 'Life (Days)' },
    {data: 'item_minWeight', title: 'Min (g)' },
    {data: 'item_maxWeight', title: 'Max (g)' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});

// Table for customer master
TabularTables.Customers = new Tabular.Table({
  name: "Customers",
  collection: Customers,
  columns: [
    {data: 'customer_code', title: 'Code' },
    {data: 'customer_name', title: 'Name', class: "col-sm-2" },
    {data: 'customer_street1', title: 'Address 1' },
    {data: 'customer_street2', title: 'Address 2' },
    {data: 'customer_city', title: 'City' },
    {data: 'customer_province', title: 'Prov' },
    {data: 'customer_country', title: 'Country' },
    {data: 'customer_postal', title: 'Postal' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});

// Table for ingredient master
TabularTables.Ingredients = new Tabular.Table({
  name: "Ingredients",
  collection: Ingredients,
  columns: [
    {data: 'ingredients_code', title: 'Ingredients Code' },
    {data: 'ingredients_list', title: 'Ingredients List' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});

// Table for label master
TabularTables.Labels = new Tabular.Table({
  name: "Labels",
  collection: Labels,
  columns: [
    {data: 'label_code', title: 'Label Code' },
    {data: 'label_layout', title: 'Label Layout' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});

// Table for scale master
TabularTables.Scales = new Tabular.Table({
  name: "Scales",
  collection: Scales,
  columns: [
    {data: 'scale_code', title: 'Scale Code' },
    {data: 'scale_name', title: 'Scale Name' },
    {data: 'scale_port', title: 'Scale Port' },
    {data: 'scale_host', title: 'Scale Host' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});

// Table for printer master
TabularTables.Printers = new Tabular.Table({
  name: "Printers",
  collection: Printers,
  columns: [
    {data: 'printer_code', title: 'Printer Code' },
    {data: 'printer_name', title: 'Printer Name' },
    {data: 'printer_port', title: 'Printer Port' },
    {data: 'printer_host', title: 'Printer Host' },
    {tmpl: Meteor.isClient && Template.edit, title: "Edit"}
  ]
});