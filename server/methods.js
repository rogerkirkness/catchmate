// Database methods
Meteor.methods({
  insertCustomer: function(doc) {
    if(this.userId){
      Customers.insert(doc);
    }
  },
  updateCustomer: function(modifier, _id) {
    if(this.userId){
      Customers.update(_id, modifier);
    }
  },
  insertBatch: function (created, item_code, cust_code, item_weight, num_units, batch_code) {
    if(this.userId){
      Batches.insert({
        "item_code": item_code,
        "cust_code": cust_code,
        "item_weight": item_weight,
        "num_units": num_units,
        "createdAt": created,
        "batch_code": batch_code
      });
    }
  },
  deleteBatch: function(lastBatch) {
    if(this.userId){
      Batches.remove({createdAt: lastBatch});
    }
  },
  insertItem: function(doc) {
    if(this.userId){
      Items.insert(doc);
    }
  },
  updateItem: function(modifier, _id) {
    if(this.userId){
      Items.update(_id, modifier);
    }
  },
  insertIngredients: function(doc) {
    if(this.userId){
      Ingredients.insert(doc);
    }
  },
  updateIngredients: function(modifier, _id) {
    if(this.userId){
      Ingredients.update(_id, modifier);
    }
  },
  insertLabel: function(doc) {
    if(this.userId){
      Labels.insert(doc);
    }
  },
  updateLabel: function(modifier, _id) {
    if(this.userId){
      Labels.update(_id, modifier);
    }
  },
  insertScale: function(doc) {
    if(this.userId){
      Scales.insert(doc);
    }
  },
  updateScale: function(modifier, _id) {
    if(this.userId){
      Scales.update(_id, modifier);
    }
  },
  insertPrinter: function(doc) {
    if(this.userId){
      Printers.insert(doc);
    }
  },
  updatePrinter: function(modifier, _id) {
    if(this.userId){
      Printers.update(_id, modifier);
    }
  },
  upsertSettings: function (companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix) {
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
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.tare": Tare
      }});
    }
  },
  updatePrinterProfile: function (Printer, port, host) {
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.printer": Printer,
        "profile.printerport": port,
        "profile.printerhost": host
      }});
    }
  },
  updateScaleProfile: function (Scale, port, host) {
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.scale": Scale,
        "profile.scaleport": port,
        "profile.scalehost": host
      }});
    }
  },
  updateLabelProfile: function (label) {
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.label": label
      }});
    }
  },
  updateNumUnitsField: function(status) {
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.numUnitsChecked": status
      }});
    }
  },
  updateBatchCodeField: function(status) {
    if(this.userId){
      Meteor.users.update(this.userId, { $set: {
        "profile.batchCodeChecked": status
      }});
    }
  }
});