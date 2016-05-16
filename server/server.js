import fs from 'fs'
import net from 'net'
import http from 'http'
import mkdirp from 'mkdirp'
import bwipjs from 'bwip-js'
import express from 'express'
import { Meteor } from 'meteor/meteor'
import { Customers } from '/imports/collections'
import { Batches } from '/imports/collections'
import { Items } from '/imports/collections'
import { Ingredients } from '/imports/collections'
import { Scales } from '/imports/collections'
import { Labels } from '/imports/collections'
import { Printers } from '/imports/collections'
import { Company } from '/imports/collections'

const app = express()

Meteor.methods({
  insertCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal) {
    if (this.userId) {
      Customers.insert({
        'customer_code': customer_code,
        'customer_name': customer_name,
        'customer_street1': customer_street1,
        'customer_street2': customer_street2,
        'customer_city': customer_city,
        'customer_province': customer_province,
        'customer_country': customer_country,
        'customer_postal': customer_postal
      })
    }
  },
  updateCustomer(customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal) {
    if (this.userId) {
      Customers.update({customer_code: customer_code}, { $set: {
        'customer_code': customer_code,
        'customer_name': customer_name,
        'customer_street1': customer_street1,
        'customer_street2': customer_street2,
        'customer_city': customer_city,
        'customer_province': customer_province,
        'customer_country': customer_country,
        'customer_postal': customer_postal
      }})
    }
  },
  insertBatch(created, item_code, cust_code, item_weight, num_units, batch_code) {
    if (this.userId) {
      Batches.insert({
        'item_code': item_code,
        'cust_code': cust_code,
        'item_weight': item_weight,
        'num_units': num_units,
        'createdAt': created,
        'batch_code': batch_code
      })
    }
  },
  deleteBatch(lastBatch) {
    if (this.userId) {
      Batches.remove({createdAt: lastBatch})
    }
  },
  insertItem(item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      Items.insert({
        'item_gtin': item_gtin,
        'item_name': item_name,
        'item_unit': item_unit,
        'item_brand': item_brand,
        'item_shelfLife': item_shelfLife,
        'item_stdWeight': item_stdWeight,
        'item_minWeight': item_minWeight,
        'item_maxWeight': item_maxWeight,
        'item_ingredients': item_ingredients
      })
    }
  },
  updateItem(item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients) {
    if (this.userId) {
      Items.update({item_gtin: item_gtin}, { $set: {
        'item_gtin': item_gtin,
        'item_name': item_name,
        'item_unit': item_unit,
        'item_brand': item_brand,
        'item_shelfLife': item_shelfLife,
        'item_stdWeight': item_stdWeight,
        'item_minWeight': item_minWeight,
        'item_maxWeight': item_maxWeight,
        'item_ingredients': item_ingredients
      }})
    }
  },
  insertIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      Ingredients.insert({
        'ingredients_code': ingredients_code,
        'ingredients_list': ingredients_list
      })
    }
  },
  updateIngredients(ingredients_code, ingredients_list) {
    if (this.userId) {
      Ingredients.update({ingredients_code: ingredients_code}, { $set: {
        'ingredients_code': ingredients_code,
        'ingredients_list': ingredients_list
      }})
    }
  },
  insertLabel(label_code, label_layout) {
    if (this.userId) {
      Labels.insert({
        'label_code': label_code,
        'label_layout': label_layout
      })
    }
  },
  updateLabel(label_code, label_layout) {
    if (this.userId) {
      Labels.update({label_code: label_code}, { $set: {
        'label_code': label_code,
        'label_layout': label_layout
      }})
    }
  },
  insertScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      Scales.insert({
        'scale_code': scale_code,
        'scale_name': scale_name,
        'scale_port': scale_port,
        'scale_host': scale_host
      })
    }
  },
  updateScale(scale_code, scale_name, scale_port, scale_host) {
    if (this.userId) {
      Scales.update({scale_code: scale_code}, { $set: {
        'scale_code': scale_code,
        'scale_name': scale_name,
        'scale_port': scale_port,
        'scale_host': scale_host
      }})
    }
  },
  insertPrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      Printers.insert({
        'printer_code': printer_code,
        'printer_name': printer_name,
        'printer_port': printer_port,
        'printer_host': printer_host
      })
    }
  },
  updatePrinter(printer_code, printer_name, printer_port, printer_host) {
    if (this.userId) {
      Printers.update({printer_code: printer_code}, { $set: {
        'printer_code': printer_code,
        'printer_name': printer_name,
        'printer_port': printer_port,
        'printer_host': printer_host
      }})
    }
  },
  upsertSettings(companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix) {
    if (this.userId) {
      Company.upsert({settings: 'company'}, { $set: {
        'company_name': companyName,
        'plant_number': plantNumber,
        'street1': Street1,
        'street2': Street2,
        'city': City,
        'province': Province,
        'country': Country,
        'postal': Postal,
        'prefix': Prefix
      }})
    }
  },
  updateTareProfile(Tare) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.tare': Tare
      }})
    }
  },
  updatePrinterProfile(Printer, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.printer': Printer,
        'profile.printerport': port,
        'profile.printerhost': host
      }})
    }
  },
  updateScaleProfile(Scale, port, host) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.scale': Scale,
        'profile.scaleport': port,
        'profile.scalehost': host
      }})
    }
  },
  updateLabelProfile(label) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.label': label
      }})
    }
  },
  updateNumUnitsField(status) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.numUnitsChecked': status
      }})
    }
  },
  updateBatchCodeField(status) {
    if (this.userId) {
      Meteor.users.update(this.userId, { $set: {
        'profile.batchCodeChecked': status
      }})
    }
  }
})

Meteor.publish('batch', function () {
  if (this.userId) {
    return Batches.find({}, {sort: {createdAt: -1}, limit: 1})
  }
})

Meteor.publish('customers', function () {
  if (this.userId) {
    return Customers.find()
  }
})

Meteor.publish('items', function () {
  if (this.userId) {
    return Items.find()
  }
})

Meteor.publish('ingredients', function () {
  if (this.userId) {
    return Ingredients.find()
  }
})

Meteor.publish('labels', function () {
  if (this.userId) {
    return Labels.find()
  }
})

Meteor.publish('scales', function () {
  if (this.userId) {
    return Scales.find()
  }
})

Meteor.publish('printers', function () {
  if (this.userId) {
    return Printers.find()
  }
})

Meteor.publish('batches', function () {
  if (this.userId) {
    return Batches.find()
  }
})

Meteor.publish('company', function () {
  if (this.userId) {
    return Company.find()
  }
})

Meteor.publish('update', function () {
  if (this.userId) {
    var port = Meteor.users.findOne(this.userId).profile.scaleport
    var host = Meteor.users.findOne(this.userId).profile.scalehost
    this.added('scale', 'weight', {weight: 0})
    if (port === '9999') {
      this.changed('scale', 'weight', {weight: 500})
    } else if (port != null) {
      var socket = new net.Socket()
      socket.connect(port, host, function () {
        function writeSocket () {
          if (socket.writable) {
            socket.write('P')
          }
        }
        setInterval(writeSocket, 250)
      })
      socket.on('data', function (data) {
        var rawOutput = data.toString()
        var output = rawOutput.replace(/\D+/g, '')
        this.changed('scale', 'weight', {weight: output})
      })
      socket.on('error', function (error) {
        window.alert(error)
      })
      socket.on('close', function () {})
    }
  }
})

http.createServer((request, response) => {
  if (request.url.indexOf('/?bcid=') !== 0) {
    response.writeHead(404, { 'Content-Type': 'text/plain' })
    response.end('BWIP-JS: Unknown request format.', 'utf8')
  } else {
    bwipjs(request, response)
  }
}).listen(8082)

http.createServer((request, response) => {
  var companyLogo = fs.readFileSync('../../../files/companylogo.jpg')
  response.writeHead(200, { 'Content-Type': 'image/jpeg' })
  response.end(companyLogo, 'binary')
}).listen(8083)

http.createServer((request, response) => {
  var plantLogo = fs.readFileSync('../../../files/plantlogo.jpg')
  response.writeHead(200, { 'Content-Type': 'image/jpeg' })
  response.end(plantLogo, 'binary')
}).listen(8084)

app.get('/uploadCompanyLogo', (request, response) => {
  mkdirp('../../../files/')
  var path = '../../../files/companylogo.jpg'
  var file = fs.createWriteStream(path)
  file.on('error', function (error) {
    console.log(error)
  })
  file.on('finish', function () {
    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end()
  })
  request.pipe(file)
})

app.get('/uploadPlantLogo', (request, response) => {
  mkdirp('../../../files/')
  var path = '../../../files/plantlogo.jpg'
  var file = fs.createWriteStream(path)
  file.on('error', function (error) {
    console.log(error)
  })
  file.on('finish', function () {
    response.writeHead(200, { 'content-type': 'text/plain' })
    response.end()
  })
  request.pipe(file)
})
