var net = require('net')
var bwipjs = require('bwip-js')

Accounts.onCreateUser(function (options, user) {
  user.companyId = options.companyId
  user.scale = null
  user.scaleport = null
  user.scalehost = null
  user.printer = null
  user.printerport = null
  user.printerhost = null
  user.tare = 0
  user.label = null
  user.numUnitsChecked = false
  user.batchCodeChecked = false
  user.customerChecked = true
  user.priceList = null
  return user
})

Meteor.methods({
  insertCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList) {
   if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Customers.findOne({
        $and: [
          { customer_code: customer_code },
          { customer_companyId: companyId }
        ]
      })
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
        'customer_priceList': customer_priceList,
        'customer_companyId': companyId
      }, function (error, id) {
        if (error != null) {
          throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
        } else {
          console.log("Successfully inserted document: " + id)
        }
      })
    }
  },

  updateCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Customers.update({
        $and: [
          { customer_code: customer_code },
          { customer_companyId: companyId }
        ]
      },
        {
          $set: {
            'customer_name': customer_name,
            'customer_street1': customer_street1,
            'customer_street2': customer_street2,
            'customer_city': customer_city,
            'customer_province': customer_province,
            'customer_country': customer_country,
            'customer_postal': customer_postal,
            'customer_priceList': customer_priceList
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
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
      }, function (error, id) {
        if (error != null) {
          throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
        } else {
          console.log("Successfully inserted document: " + id)
        }
      })
    }
  },

  deleteBatch(lastBatch) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Batches.remove({
        $and: [
          { createdAt: lastBatch },
          { batch_companyId: companyId }
        ]
      }, function (error) {
        if (error != null) {
          throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
        } else {
          console.log("Successfully removed document.")
        }
      })
    }
  },

  insertItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Items.findOne({
        $and: [
          { item_code: item_code },
          { item_companyId: companyId }
        ]
      })
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
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updateItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Items.update({
        $and: [
          { item_code: item_code },
          { item_companyId: companyId }
        ]
      }, {
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
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  insertIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Ingredients.findOne({
        $and: [
          { ingredients_code: ingredients_code },
          { ingredients_companyId: companyId }
        ]
      })
      if (exists != null) {
        if (exists.ingredients_code === ingredients_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.ingredients_code + " already exists.")
        }
      } else {
        Ingredients.insert({
          'ingredients_code': ingredients_code,
          'ingredients_list': ingredients_list,
          'ingredients_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updateIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Ingredients.update({
        $and: [
          { ingredients_code: ingredients_code },
          { ingredients_companyId: companyId }
        ]
      }, {
          $set: {
            'ingredients_list': ingredients_list
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  insertLabel(label_code, label_layout) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Labels.findOne({
        $and: [
          { label_code: label_code },
          { label_companyId: companyId }
        ]
      })
      if (exists != null) {
        if (exists.label_code === label_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.label_code + " already exists.")
        }
      } else {
        Labels.insert({
          'label_code': label_code,
          'label_layout': label_layout,
          'label_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updateLabel(label_code, label_layout) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Labels.update({
        $and: [
          { label_code: label_code },
          { label_companyId: companyId }
        ]
      }, {
          $set: {
            'label_layout': label_layout
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  insertScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Scales.findOne({
        $and: [
          { scale_code: scale_code },
          { scale_companyId: companyId }
        ]
      })
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
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updateScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Scales.update({
        $and: [
          { scale_code: scale_code },
          { scale_companyId: companyId }
        ]
      }, {
          $set: {
            'scale_name': scale_name,
            'scale_port': scale_port,
            'scale_host': scale_host
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  insertPrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Printers.findOne({
        $and: [
          { printer_code: printer_code },
          { printer_companyId: companyId }
        ]
      })
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
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updatePrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Printers.update({
        $and: [
          { printer_code: printer_code },
          { printer_companyId: companyId }
        ]
      }, {
          $set: {
            'printer_name': printer_name,
            'printer_port': printer_port,
            'printer_host': printer_host
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  insertPrice(price_code, price_name, price_list) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Prices.findOne({
        $and: [
          { price_code: price_code },
          { price_companyId: companyId }
        ]
      })
      if (exists != null) {
        if (exists.price_code === price_code) {
          throw new Meteor.Error("duplicate-code", "Code: " + exists.price_code + " already exists.")
        }
      } else {
        Prices.insert({
          'price_code': price_code,
          'price_name': price_name,
          'price_list': price_list,
          'price_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Insert operation failed, contact support")
          } else {
            console.log("Successfully inserted document: " + id)
          }
        })
      }
    }
  },

  updatePrice(price_code, price_name, price_list) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Prices.update({
        $and: [
          { price_code: price_code },
          { price_companyId: companyId }
        ]
      }, {
          $set: {
            'price_name': price_name,
            'price_list': price_list
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        }
      )
    }
  },

  upsertSettings(companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix, priceList) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert(
        { settings: companyId }, {
          $set: {
            'company_name': companyName,
            'plant_number': plantNumber,
            'street1': Street1,
            'street2': Street2,
            'city': City,
            'province': Province,
            'country': Country,
            'postal': Postal,
            'prefix': Prefix,
            'priceList': priceList
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  upsertClogo(clogo) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert(
        { settings: companyId }, {
          $set: {
            'clogo': clogo
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  upsertPlogo(plogo) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.upsert(
        { settings: companyId }, {
          $set: {
            'plogo': plogo
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  deleteClogo() {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.update(
        { settings: companyId }, {
          $unset: {
            'clogo': ""
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  deletePlogo() {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Company.update(
        { settings: companyId }, {
          $unset: {
            'plogo': ""
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " document(s).")
          }
        })
    }
  },

  updateTareProfile(Tare) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'tare': Tare
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updatePrinterProfile(Printer, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'printer': Printer,
          'printerport': port,
          'printerhost': host
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updateScaleProfile(Scale, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'scale': Scale,
          'scaleport': port,
          'scalehost': host
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updateLabelProfile(label) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'label': label
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updateCustomerField(status) {
    if (this.userId) {
      Meteor.users.upsert(this.userId, {
        $set: {
          'customerChecked': status
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updateNumUnitsField(status) {
    if (this.userId) {
      Meteor.users.upsert(this.userId, {
        $set: {
          'numUnitsChecked': status
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
        }
      })
    }
  },

  updateBatchCodeField(status) {
    if (this.userId) {
      Meteor.users.upsert(this.userId, {
        $set: {
          'batchCodeChecked': status
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Update operation failed, contact support")
        } else {
          console.log("Successfully updated " + number + " document(s).")
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
    return Batches.find({
      'batch_companyId': companyId
    }, {
        sort: {
          createdAt: -1
        },
        limit: 1
      }
    )
  }
})

Meteor.publish('customers', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Customers.find({
      'customer_companyId': companyId
    })
  }
})

Meteor.publish('items', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Items.find({
      'item_companyId': companyId
    })
  }
})

Meteor.publish('ingredients', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Ingredients.find({
      'ingredients_companyId': companyId
    })
  }
})

Meteor.publish('labels', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Labels.find({
      'label_companyId': companyId
    })
  }
})

Meteor.publish('scales', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Scales.find({
      'scale_companyId': companyId
    })
  }
})

Meteor.publish('printers', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Printers.find({
      'printer_companyId': companyId
    })
  }
})

Meteor.publish('prices', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Prices.find({
      'price_companyId': companyId
    })
  }
})

Meteor.publish('batches', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Batches.find({
      'batch_companyId': companyId
    })
  }
})

Meteor.publish('company', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Company.find({
      'settings': companyId
    })
  }
})

Meteor.publish('users', function () {
  if (this.userId) {
    return Meteor.users.find({
      _id: this.userId
    }, {
        fields: {
          'companyId': 1,
          'tare': 1,
          'printer': 1,
          'printerport': 1,
          'printerhost': 1,
          'scale': 1,
          'scaleport': 1,
          'scalehost': 1,
          'label': 1,
          'numUnitsChecked': 1,
          'batchCodeChecked': 1,
          'customerChecked': 1
        }
      })
  }
})

Meteor.publish('update', function () {
  if (this.userId) {
    var self = this
    self.added("weightdata", "weight", { data: 0 })
    if (typeof Meteor.users.findOne(this.userId).scaleport != 'null' && typeof Meteor.users.findOne(this.userId).scalehost != 'null') {
      var port = Meteor.users.findOne(this.userId).scaleport
      var host = Meteor.users.findOne(this.userId).scalehost
      if (port === '9999') {
        self.changed("weightdata", "weight", { data: 500 })
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
        socket.on('close', function () { })
      } else {
        self.added("weightdata", "weight", { data: 250 })
        self.ready()
      }
    } else {
      self.added("weightdata", "weight", { data: 999 })
      self.ready()
    }
  }
})

Meteor.publish('barcode', function (barcode) {
  if (this.userId) {
    var self = this
    bwipjs.toBuffer({
      bcid: 'gs1-128',
      text: barcode,
      includetext: true,
      textsize: 8
    }, function (error, barcode) {
      if (error) {
        throw new Meteor.Error("Barcode error", "Error creating barcode")
      } else {
        var rawBarcode = barcode.toString('base64')
        self.added("barcodedata", "bcID", { data: rawBarcode })
        self.ready()
      }
    })
  }
})