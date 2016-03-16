// Database methods
Meteor.methods({
  insertCustomer: function(doc) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Customers.insert(doc);
    }
  },
  updateCustomer: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Customers.update(_id, modifier);
    }
  },
  insertBatch: function (created, item_code, cust_code, item_weight, num_units) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Batches.insert({
        "item_code": item_code,
        "cust_code": cust_code,
        "item_weight": item_weight,
        "num_units": num_units,
        "createdAt": created
      });
    }
  },
  deleteBatch: function(lastBatch) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Batches.remove({createdAt: lastBatch});
    }
  },
  insertItem: function(doc) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Items.insert(doc);
    }
  },
  updateItem: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Items.update(_id, modifier);
    }
  },
  insertIngredients: function(doc) {
    check(doc.ingredients_code, String);
    check(doc.ingredients_list, String);
    if(this.userId){
      Ingredients.insert(doc);
    }
  },
  updateIngredients: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Ingredients.update(_id, modifier);
    }
  },
  insertLabel: function(doc) {
    check(doc.label_code, String);
    check(doc.label_layout, String);
    if(this.userId){
      Labels.insert(doc);
    }
  },
  updateLabel: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Labels.update(_id, modifier);
    }
  },
  insertScale: function(doc) {
    check(doc.scale_code, String);
    check(doc.scale_name, String);
    check(doc.scale_port, String);
    check(doc.scale_host, String);
    if(this.userId){
      Scales.insert(doc);
    }
  },
  updateScale: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Scales.update(_id, modifier);
    }
  },
  insertPrinter: function(doc) {
    check(doc.printer_code, String);
    check(doc.printer_name, String);
    check(doc.printer_port, String);
    check(doc.printer_host, String);
    if(this.userId){
      Printers.insert(doc);
    }
  },
  updatePrinter: function(modifier, _id) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Printers.update(_id, modifier);
    }
  },
  upsertSettings: function (companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Company.upsert({settings: "company"}, { $set: {
        "company_name": companyName,
        "plant_number": plantNumber,
        "street1": Street1,
        "street2": Street2,
        "city": City,
        "province": Province,
        "country": Country,
        "postal": Postal,
        "prefix": Prefix
      }});
    }
  },
  updateTareProfile: function (Tare) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.tare": Tare
      }});
    }
  },
  updatePrinterProfile: function (Printer, port, host) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.printer": Printer,
        "profile.printerport": port,
        "profile.printerhost": host
      }});
    }
  },
  updateScaleProfile: function (Scale, port, host) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.scale": Scale,
        "profile.scaleport": port,
        "profile.scalehost": host
      }});
    }
  },
  updateLabelProfile: function (label) {
    check(arguments, [Match.Any]);
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.label": label
      }});
    }
  }
});