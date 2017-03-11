var net = require('net')
var bwipjs = require('bwip-js')
var _ = require('underscore')

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
  user.multiItemChecked = false
  user.priceList = null
  return user
})

Meteor.methods({

  importSQL() {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      if (companyId === "SMUCKERS") {
        Sql.q("SELECT * FROM dbo.Customers", function (error, results) {
          if (error != null) {
            throw new Meteor.Error("SQL-query-error", "Querying customers from SQL failed, contact support")
          } else {
            _.forEach(results, function (result) {
              Customers.upsert({
                $and: [
                  { customer_code: result.CustomerID },
                  { customer_companyId: companyId }
                ]
              }, {
                  $set: {
                    'customer_code': result.CustomerID,
                    'customer_name': result.Company,
                    'customer_street1': result.BillAddress,
                    'customer_city': result.BillCity,
                    'customer_province': result.BillState,
                    'customer_postal': result.BillZip,
                    'customer_billID': result.ID,
                    'customer_companyId': companyId
                  }
                }, function (error, number) {
                  if (error != null) {
                    throw new Meteor.Error("upsert-error", "Customer upsert operation failed, contact support")
                  } else {
                    console.log("Successfully upserted customer record.")
                  }
                }
              )
            })
          }
        })
      }
    }
  },

  insertCustomer(customer_code, customer_logo, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList) {
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
          throw new Meteor.Error("duplicate-code", "Customer code: " + exists.customer_code + " already exists.")
        }
      }
      Customers.insert({
        'customer_code': customer_code,
        'customer_logo': customer_logo,
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
          throw new Meteor.Error("insert-error", "Customer insert operation failed, contact support")
        } else {
          console.log("Successfully inserted customer: " + id)
        }
      })
    }
  },

  updateCustomer(customer_code, customer_logo, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList) {
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
            'customer_logo': customer_logo,
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
            throw new Meteor.Error("update-error", "Customer update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " customer(s).")
          }
        }
      )
    }
  },

  updateCustomerLogo(customer_logo, customer_code) {
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
            'customer_logo': customer_logo
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-logo-error", "Customer logo update operation failed, contact support")
          } else {
            console.log("Successfully uploaded " + number + " customer logo")
          }
        }
      )
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
          throw new Meteor.Error("insert-error", "Batch insert operation failed, contact support")
        } else {
          console.log("Successfully inserted batch: " + id)
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
          throw new Meteor.Error("insert-error", "Delete batch operation failed, contact support")
        } else {
          console.log("Successfully removed batch: " + id)
        }
      })
    }
  },

  insertItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, item_nutrition) {
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
          throw new Meteor.Error("duplicate-code", "Item code: " + exists.item_code + " already exists.")
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
          'item_nutrition': item_nutrition,
          'item_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Item insert operation failed, contact support")
          } else {
            console.log("Successfully inserted item: " + id)
          }
        })
      }
    }
  },

  updateItem(item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, item_nutrition) {
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
            'item_ingredients': item_ingredients,
            'item_nutrition': item_nutrition
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Item update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " items(s).")
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
          throw new Meteor.Error("duplicate-code", "Ingredient code: " + exists.ingredients_code + " already exists.")
        }
      } else {
        Ingredients.insert({
          'ingredients_code': ingredients_code,
          'ingredients_list': ingredients_list,
          'ingredients_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Ingredient insert operation failed, contact support")
          } else {
            console.log("Successfully inserted ingredient: " + id)
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
            throw new Meteor.Error("update-error", "Ingredient update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " ingredients(s).")
          }
        })
    }
  },

  insertLabel(label_code, label_name, label_layout) {
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
          throw new Meteor.Error("duplicate-code", "Label code: " + exists.label_code + " already exists.")
        }
      } else {
        Labels.insert({
          'label_code': label_code,
          'label_name': label_name,
          'label_layout': label_layout,
          'label_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Label insert operation failed, contact support")
          } else {
            console.log("Successfully inserted label: " + id)
          }
        })
      }
    }
  },

  updateLabel(label_code, label_name, label_layout) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Labels.update({
        $and: [
          { label_code: label_code },
          { label_companyId: companyId }
        ]
      }, {
          $set: {
            'label_name': label_name,
            'label_layout': label_layout
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Label update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " label(s).")
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
          throw new Meteor.Error("duplicate-code", "Scale code: " + exists.scale_code + " already exists.")
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
            throw new Meteor.Error("insert-error", "Scale insert operation failed, contact support")
          } else {
            console.log("Successfully inserted scale: " + id)
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
            throw new Meteor.Error("update-error", "Scale update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " scales(s).")
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
          throw new Meteor.Error("duplicate-code", "Printer code: " + exists.printer_code + " already exists.")
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
            throw new Meteor.Error("insert-error", "Printer insert operation failed, contact support")
          } else {
            console.log("Successfully inserted printer: " + id)
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
            throw new Meteor.Error("update-error", "Printer update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " printer(s).")
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
          throw new Meteor.Error("duplicate-code", "Price code: " + exists.price_code + " already exists.")
        }
      } else {
        Prices.insert({
          'price_code': price_code,
          'price_name': price_name,
          'price_list': price_list,
          'price_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Price insert operation failed, contact support")
          } else {
            console.log("Successfully inserted price: " + id)
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
            throw new Meteor.Error("update-error", "Price update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " price(s).")
          }
        }
      )
    }
  },

  insertNutrition(nutrition_code, nutrition_name, nutrition_servingsPerContainer, nutrition_servingSize, nutrition_servingSizeFR, nutrition_calories, nutrition_totalFat, nutrition_saturatedFat, nutrition_transFat, nutrition_cholesterol, nutrition_sodium, nutrition_carbohydrates, nutrition_fiber, nutrition_sugar, nutrition_addedSugar, nutrition_protein, nutrition_vitaminA, nutrition_vitaminC, nutrition_vitaminD, nutrition_calcium, nutrition_iron, nutrition_potassium) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      var exists = Nutrition.findOne({
        $and: [
          { nutrition_code: nutrition_code },
          { nutrition_companyId: companyId }
        ]
      })
      if (exists != null) {
        if (exists.nutrition_code === nutrition_code) {
          throw new Meteor.Error("duplicate-code", "Nutrition code: " + exists.nutrition_code + " already exists.")
        }
      } else {
        Nutrition.insert({
          'nutrition_code': nutrition_code,
          'nutrition_name': nutrition_name,
          'nutrition_servingsPerContainer': nutrition_servingsPerContainer,
          'nutrition_servingSize': nutrition_servingSize,
          'nutrition_servingSizeFR': nutrition_servingSizeFR,
          'nutrition_calories': nutrition_calories,
          'nutrition_totalFat': nutrition_totalFat,
          'nutrition_saturatedFat': nutrition_saturatedFat,
          'nutrition_transFat': nutrition_transFat,
          'nutrition_cholesterol': nutrition_cholesterol,
          'nutrition_sodium': nutrition_sodium,
          'nutrition_carbohydrates': nutrition_carbohydrates,
          'nutrition_fiber': nutrition_fiber,
          'nutrition_sugar': nutrition_sugar,
          'nutrition_addedSugar': nutrition_addedSugar,
          'nutrition_protein': nutrition_protein,
          'nutrition_vitaminA': nutrition_vitaminA,
          'nutrition_vitaminC': nutrition_vitaminC,
          'nutrition_vitaminD': nutrition_vitaminD,
          'nutrition_calcium': nutrition_calcium,
          'nutrition_iron': nutrition_iron,
          'nutrition_potassium': nutrition_potassium,
          'nutrition_companyId': companyId
        }, function (error, id) {
          if (error != null) {
            throw new Meteor.Error("insert-error", "Nutrition insert operation failed, contact support")
          } else {
            console.log("Successfully inserted nutrition: " + id)
          }
        })
      }
    }
  },

  updateNutrition(nutrition_code, nutrition_name, nutrition_servingsPerContainer, nutrition_servingSize, nutrition_servingSizeFR, nutrition_calories, nutrition_totalFat, nutrition_saturatedFat, nutrition_transFat, nutrition_cholesterol, nutrition_sodium, nutrition_carbohydrates, nutrition_fiber, nutrition_sugar, nutrition_addedSugar, nutrition_protein, nutrition_vitaminA, nutrition_vitaminC, nutrition_vitaminD, nutrition_calcium, nutrition_iron, nutrition_potassium) {
    if (this.userId) {
      var companyId = Meteor.user().companyId
      Nutrition.update({
        $and: [
          { nutrition_code: nutrition_code },
          { nutrition_companyId: companyId }
        ]
      }, {
          $set: {
            'nutrition_name': nutrition_name,
            'nutrition_name': nutrition_name,
            'nutrition_servingsPerContainer': nutrition_servingsPerContainer,
            'nutrition_servingSize': nutrition_servingSize,
            'nutrition_servingSizeFR': nutrition_servingSizeFR,
            'nutrition_calories': nutrition_calories,
            'nutrition_totalFat': nutrition_totalFat,
            'nutrition_saturatedFat': nutrition_saturatedFat,
            'nutrition_transFat': nutrition_transFat,
            'nutrition_cholesterol': nutrition_cholesterol,
            'nutrition_sodium': nutrition_sodium,
            'nutrition_carbohydrates': nutrition_carbohydrates,
            'nutrition_fiber': nutrition_fiber,
            'nutrition_sugar': nutrition_sugar,
            'nutrition_addedSugar': nutrition_addedSugar,
            'nutrition_protein': nutrition_protein,
            'nutrition_vitaminA': nutrition_vitaminA,
            'nutrition_vitaminC': nutrition_vitaminC,
            'nutrition_vitaminD': nutrition_vitaminD,
            'nutrition_calcium': nutrition_calcium,
            'nutrition_iron': nutrition_iron,
            'nutrition_potassium': nutrition_potassium
          }
        }, function (error, number) {
          if (error != null) {
            throw new Meteor.Error("update-error", "Nutrition update operation failed, contact support")
          } else {
            console.log("Successfully updated " + number + " nutrition(s).")
          }
        })
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
            throw new Meteor.Error("update-error", "Settings update operation failed, contact support")
          } else {
            console.log("Successfully updated settings.")
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
            throw new Meteor.Error("update-error", "Company logo update operation failed, contact support")
          } else {
            console.log("Successfully updated company logo.")
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
            throw new Meteor.Error("update-error", "Plant logo update operation failed, contact support")
          } else {
            console.log("Successfully updated plant logo.")
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
            throw new Meteor.Error("update-error", "Company logo remove operation failed, contact support")
          } else {
            console.log("Successfully removed company logo.")
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
            throw new Meteor.Error("update-error", "Plant logo remove operation failed, contact support")
          } else {
            console.log("Successfully removed plant logo.")
          }
        })
    }
  },

  updateTareProfile(tare) {
    if (this.userId) {
      Meteor.users.update(this.userId, {
        $set: {
          'tare': tare
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Tare update operation failed, contact support")
        } else {
          console.log("Successfully updated tare weight.")
        }
      })
    }
  },

  updatePrinterProfile(printer) {
    if (this.userId) {
      var port = Printers.findOne({ printer_name: printer }).printer_port
      var host = Printers.findOne({ printer_name: printer }).printer_host
      Meteor.users.update(this.userId, {
        $set: {
          'printer': printer,
          'printerport': port,
          'printerhost': host
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Printer settings update operation failed, contact support")
        } else {
          console.log("Successfully updated printer settings.")
        }
      })
    }
  },

  updateScaleProfile(scale) {
    if (this.userId) {
      var port = Scales.findOne({ scale_name: scale }).scale_port
      var host = Scales.findOne({ scale_name: scale }).scale_host
      Meteor.users.update(this.userId, {
        $set: {
          'scale': scale,
          'scaleport': port,
          'scalehost': host
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Scale settings update operation failed, contact support")
        } else {
          console.log("Successfully updated scale settings.")
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
          throw new Meteor.Error("update-error", "Label settings operation failed, contact support")
        } else {
          console.log("Successfully updated label settings.")
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
          throw new Meteor.Error("update-error", "Show customer field update operation failed, contact support")
        } else {
          console.log("Successfully updated customer field setting.")
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
          throw new Meteor.Error("update-error", "Show number of units field setting operation failed, contact support")
        } else {
          console.log("Successfully updated number of units field setting.")
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
          throw new Meteor.Error("update-error", "Show batch code field setting update operation failed, contact support")
        } else {
          console.log("Successfully updated batch code field setting.")
        }
      })
    }
  },

  updateMultiItemField(status) {
    if (this.userId) {
      Meteor.users.upsert(this.userId, {
        $set: {
          'multiItemChecked': status
        }
      }, function (error, number) {
        if (error != null) {
          throw new Meteor.Error("update-error", "Show multi item field setting update operations failed, contact support")
        } else {
          console.log("Successfully updated multi item field setting.")
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

Meteor.publish('nutrition', function () {
  if (this.userId) {
    var companyId = Meteor.users.findOne(this.userId).companyId
    return Nutrition.find({
      'nutrition_companyId': companyId
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
          'customerChecked': 1,
          'multiItemChecked': 1
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
      var companyId = Meteor.users.findOne(this.userId).companyId
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
          setInterval(writeSocket, 500)
        })
        socket.on('data', function (data) {
          var rawOutput = data.toString()
          if (companyId === "SMUCKERS") {
            var rawWeight = rawOutput.substr(0, rawOutput.indexOf('\n'))
            var output = rawWeight.replace(/\D+/g, '')
          } else {
            var output = raw.replace(/\D+/g, '')
          }
          self.changed("weightdata", "weight", { data: output })
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

// Publish the barcode to the client for display on labels
Meteor.publish('barcode', function (barcode) {
  if (this.userId) {
    var self = this
    bwipjs.toBuffer({
      bcid: 'gs1datamatrix',
      text: barcode
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

Meteor.publish('smuckers', function (batchCode) {
  if (this.userId) {
    var self = this
    var companyId = Meteor.users.findOne(this.userId).companyId
    if (companyId === "SMUCKERS" && batchCode != null) {
      var ordersQuery = "SELECT BillToID, ID, OrderType, OrderFor FROM dbo.orders WHERE OrderNumber = " + batchCode
      Sql.q(ordersQuery, function (error, orderResult) {
        if (error != null) {
          throw new Meteor.Error("Error with OrderID", "Please check SQL connection and batchCode")
        } else {
          self.added("smuckersdata", "orderResult", { data: orderResult })
          self.added("smuckersdata", "customerCode", { data: orderResult[0].BillToID })
          self.added("smuckersdata", "orderType", { data: orderResult[0].OrderType })
          var carcassQuery = "SELECT CarcassID, HotWeight FROM dbo.v_carcassesForOrder WHERE OrderID = " + orderResult[0].ID
          Sql.q(carcassQuery, function (error, carcassResults) {
            if (error != null) {
              throw new Meteor.Error("Error with CarcassID", "Please check SQL connection and OrderID")
            } else {
              self.added("smuckersdata", "carcassResult", { data: carcassResults })
              self.ready()
            }
          })
        }
      })
    }
  }
})