import net from 'net'
import bwipjs from 'bwip-js'
import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Customers } from '/imports/collections'
import { Batches } from '/imports/collections'
import { Items } from '/imports/collections'
import { Ingredients } from '/imports/collections'
import { Scales } from '/imports/collections'
import { Labels } from '/imports/collections'
import { Printers } from '/imports/collections'
import { Company } from '/imports/collections'

Accounts.onCreateUser(function(options, user) {
  user.companyId = options.companyId
  return user
})

Meteor.methods({
  insertCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Customers.findOne({ $and: [{ customer_code: customer_code }, { customer_companyId: companyId }] })
      if (exists != null) {
        if (exists.customer_code === customer_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.customer_code + " already exists.")
        }
      }
      Customers.insert({
        'customer_code': customer_code,
        'customer_name': customer_name,
        'customer_street1': customer_street1,
        'customer_street2': customer_street2,
        'customer_city': customer_city,
        'customer_province': customer_province,
        'customer_country': customer_country,
        'customer_postal': customer_postal,
        'customer_companyId': companyId
      })
    }
  },
  updateCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal) {
    if (this.userId) {
      Customers.update({ customer_code: customer_code }, {
        $set: {
          'customer_name': customer_name,
          'customer_street1': customer_street1,
          'customer_street2': customer_street2,
          'customer_city': customer_city,
          'customer_province': customer_province,
          'customer_country': customer_country,
          'customer_postal': customer_postal
        }
      })
    }
  },

  insertBatch(created, item_code, cust_code, item_weight, num_units, batch_code) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Batches.insert({
        'item_code': item_code,
        'cust_code': cust_code,
        'item_weight': item_weight,
        'num_units': num_units,
        'createdAt': created,
        'batch_code': batch_code,
        'batch_companyId': companyId
      })
    }
  },
  deleteBatch(lastBatch) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Batches.remove({ $and: [{ createdAt: lastBatch }, { batch_companyId: companyId }] })
    }
  },

  insertItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Items.findOne({ $and: [{ item_code: item_code }, { item_companyId: companyId }] })
      if (exists != null) {
        if (exists.item_code === item_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.item_code + " already exists.")
        }
      } else {
        Items.insert({
          'item_code': item_code,
          'item_gtin': item_gtin,
          'item_name': item_name,
          'item_unit': item_unit,
          'item_brand': item_brand,
          'item_shelfLife': item_shelfLife,
          'item_stdWeight': item_stdWeight,
          'item_minWeight': item_minWeight,
          'item_maxWeight': item_maxWeight,
          'item_ingredients': item_ingredients,
          'item_companyId': companyId
        })
      }
    }
  },
  updateItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      Items.update({ item_code: item_code }, {
        $set: {
          'item_gtin': item_gtin,
          'item_name': item_name,
          'item_unit': item_unit,
          'item_brand': item_brand,
          'item_shelfLife': item_shelfLife,
          'item_stdWeight': item_stdWeight,
          'item_minWeight': item_minWeight,
          'item_maxWeight': item_maxWeight,
          'item_ingredients': item_ingredients
        }
      })
    }
  },

  insertIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Ingredients.findOne({ $and: [{ ingredients_code: ingredients_code }, { ingredients_companyId: companyId }] })
      if (exists != null) {
        if (exists.ingredients_code === ingredients_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.ingredients_code + " already exists.")
        }
      } else {
        Ingredients.insert({
          'ingredients_code': ingredients_code,
          'ingredients_list': ingredients_list,
          'ingredients_companyId': companyId
        })
      }
    }
  },
  updateIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      Ingredients.update({ ingredients_code: ingredients_code }, {
        $set: {
          'ingredients_list': ingredients_list
        }
      })
    }
  },

  insertLabel(label_code, label_layout) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Labels.findOne({ $and: [{ label_code: label_code }, { label_companyId: companyId }] })
      if (exists != null) {
        if (exists.label_code === label_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.label_code + " already exists.")
        }
      } else {
        Labels.insert({
          'label_code': label_code,
          'label_layout': label_layout,
          'label_companyId': companyId
        })
      }
    }
  },
  updateLabel(label_code, label_layout) {
    if (this.userId) {
      Labels.update({ label_code: label_code }, {
        $set: {
          'label_layout': label_layout
        }
      })
    }
  },

  insertScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Scales.findOne({ $and: [{ scale_code: scale_code }, { scale_companyId: companyId }] })
      if (exists != null) {
        if (exists.scale_code === scale_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.scale_code + " already exists.")
        }
      } else {
        Scales.insert({
          'scale_code': scale_code,
          'scale_name': scale_name,
          'scale_port': scale_port,
          'scale_host': scale_host,
          'scale_companyId': companyId
        })
      }
    }
  },
  updateScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      Scales.update({ scale_code: scale_code }, {
        $set: {
          'scale_name': scale_name,
          'scale_port': scale_port,
          'scale_host': scale_host
        }
      })
    }
  },

  insertPrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Printers.findOne({ $and: [{ printer_code: printer_code }, { printer_companyId: companyId }] })
      if (exists != null) {
        if (exists.printer_code === printer_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.printer_code + " already exists.")
        }
      } else {
        Printers.insert({
          'printer_code': printer_code,
          'printer_name': printer_name,
          'printer_port': printer_port,
          'printer_host': printer_host,
          'printer_companyId': companyId
        })
      }
    }
  },
  updatePrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      Printers.update({ printer_code: printer_code }, {
        $set: {
          'printer_name': printer_name,
          'printer_port': printer_port,
          'printer_host': printer_host
        }
      })
    }
  },

  upsertSettings(companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert({ settings: companyId }, {
        $set: {
          'company_name': companyName,
          'plant_number': plantNumber,
          'street1': Street1,
          'street2': Street2,
          'city': City,
          'province': Province,
          'country': Country,
          'postal': Postal,
          'prefix': Prefix
        }
      })
    }
  },

  upsertClogo(clogo) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert({ settings: companyId }, {
        $set: {
          'clogo': clogo
        }
      })
    }
  },
  upsertPlogo(plogo) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert({ settings: companyId }, {
        $set: {
          'plogo': plogo
        }
      })
    }
  },
  deleteClogo() {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.update({ settings: companyId }, {
        $unset: { 'clogo': "" }
      })
    }
  },
  deletePlogo() {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.update({ settings: companyId }, {
        $unset: { 'plogo': "" }
      })
    }
  },

  updateTareProfile(Tare) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.tare': Tare
        }
      })
    }
  },
  updatePrinterProfile(Printer, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.printer': Printer,
          'profile.printerport': port,
          'profile.printerhost': host
        }
      })
    }
  },
  updateScaleProfile(Scale, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.scale': Scale,
          'profile.scaleport': port,
          'profile.scalehost': host
        }
      })
    }
  },
  updateLabelProfile(label) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.label': label
        }
      })
    }
  },
  updateNumUnitsField(status) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.numUnitsChecked': status
        }
      })
    }
  },
  updateBatchCodeField(status) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'profile.batchCodeChecked': status
        }
      })
    }
  },

  insertUser(email, password, companyId) {
    var userObject = {
      'email': email,
      'password': password,
      'companyId': companyId
    }
    Accounts.createUser(userObject)
  }
})

Meteor.publish('batch', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Batches.find({ 'batch_companyId': companyId }, { sort: { createdAt: -1 }, limit: 1 })
  }
})

Meteor.publish('customers', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Customers.find({ 'customer_companyId': companyId })
  }
})

Meteor.publish('items', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Items.find({ 'item_companyId': companyId })
  }
})

Meteor.publish('ingredients', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Ingredients.find({ 'ingredients_companyId': companyId })
  }
})

Meteor.publish('labels', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Labels.find({ 'label_companyId': companyId })
  }
})

Meteor.publish('scales', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Scales.find({ 'scale_companyId': companyId })
  }
})

Meteor.publish('printers', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Printers.find({ 'printer_companyId': companyId })
  }
})

Meteor.publish('batches', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Batches.find({ 'batch_companyId': companyId })
  }
})

Meteor.publish('company', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Company.find({ 'settings': companyId })
  }
})

Meteor.publish('users', function () {
  if (this.userId) {
    return Meteor.users.find({ _id: this.userId }, { fields: { 'companyId': 1 } })
  }
})

Meteor.publish('update', function () {
  if (this.userId) {
    var self = this
    var port = Meteor.users.findOne(this.userId).profile.scaleport
    var host = Meteor.users.findOne(this.userId).profile.scalehost
    self.added("weightdata", "weight", { data: 0 })
    if (port === '9999') {
      var weight = 500
      self.changed("weightdata", "weight", { data: weight })
      self.ready()
    } else if (port != null) {
      var socket = new net.Socket()
      socket.connect(port, host, function () {
        function writeSocket() {
          if (socket.writable) {
            socket.write('P')
          }
        }
        setInterval(writeSocket, 250)
      })
      socket.on('data', function (data) {
        var rawOutput = data.toString()
        var output = rawOutput.replace(/\D+/g, '')
        self.changed("weightdata", "weight", { data: weight })
        self.ready()
      })
      socket.on('error', function (error) {
        console.log(error)
      })
      socket.on('close', function () {} )
    }
  }
})

Meteor.publish('barcode', function(barcode) {
  if (this.userId) {
    var self = this
    bwipjs.toBuffer({
        bcid:         'gs1-128',
        text:         barcode,
        scale:        1,
        height:       20,
        width:        6,
        includetext:  false,
        parsefnc:     true
    }, function (err, bc) {
        if (err) {
            throw new Meteor.Error("Barcode error", "Error creating barcode")
        } else {
            var barcode = bc.toString('base64')
            self.added("barcodedata", "bcID", {data: barcode})
            self.ready()
        }
    })
  }
})