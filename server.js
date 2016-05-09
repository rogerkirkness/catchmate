import net from 'net'
import http from 'http'
import bwipjs from 'bwip-js'
import { Meteor } from 'meteor/meteor'
import { Customers } from '/imports/collections'
import { Batches } from '/imports/collections'
import { Items } from '/imports/collections'
import { Ingredients } from '/imports/collections'
import { Printers } from '/imports/collections'
import { Scales } from '/imports/collections'
import { Company } from '/imports/collections'
import { Labels } from '/imports/collections'
import { Images } from '/imports/collections'
import { Plogo } from '/imports/collections'

if (Meteor.isServer) {
  http.createServer(function (req, res) {
    if (req.url.indexOf('/?bcid=') !== 0) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('BWIP-JS: Unknown request format.', 'utf8')
    } else {
      bwipjs(req, res)
    }
  }).listen(8082)

  Meteor.methods({
    insertCustomer: function (doc) {
      if (this.userId) {
        Customers.insert(doc)
      }
    },
    updateCustomer: function (modifier, _id) {
      if (this.userId) {
        Customers.update(_id, modifier)
      }
    },
    insertBatch: function (created, item_code, cust_code, item_weight, num_units, batch_code) {
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
    deleteBatch: function (lastBatch) {
      if (this.userId) {
        Batches.remove({createdAt: lastBatch})
      }
    },
    insertItem: function (doc) {
      if (this.userId) {
        Items.insert(doc)
      }
    },
    updateItem: function (modifier, _id) {
      if (this.userId) {
        Items.update(_id, modifier)
      }
    },
    insertIngredients: function (doc) {
      if (this.userId) {
        Ingredients.insert(doc)
      }
    },
    updateIngredients: function (modifier, _id) {
      if (this.userId) {
        Ingredients.update(_id, modifier)
      }
    },
    insertLabel: function (doc) {
      if (this.userId) {
        Labels.insert(doc)
      }
    },
    updateLabel: function (modifier, _id) {
      if (this.userId) {
        Labels.update(_id, modifier)
      }
    },
    insertScale: function (doc) {
      if (this.userId) {
        Scales.insert(doc)
      }
    },
    updateScale: function (modifier, _id) {
      if (this.userId) {
        Scales.update(_id, modifier)
      }
    },
    insertPrinter: function (doc) {
      if (this.userId) {
        Printers.insert(doc)
      }
    },
    updatePrinter: function (modifier, _id) {
      if (this.userId) {
        Printers.update(_id, modifier)
      }
    },
    upsertSettings: function (companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix) {
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
    updateTareProfile: function (Tare) {
      if (this.userId) {
        Meteor.users.update(this.userId, { $set: {
          'profile.tare': Tare
        }})
      }
    },
    updatePrinterProfile: function (Printer, port, host) {
      if (this.userId) {
        Meteor.users.update(this.userId, { $set: {
          'profile.printer': Printer,
          'profile.printerport': port,
          'profile.printerhost': host
        }})
      }
    },
    updateScaleProfile: function (Scale, port, host) {
      if (this.userId) {
        Meteor.users.update(this.userId, { $set: {
          'profile.scale': Scale,
          'profile.scaleport': port,
          'profile.scalehost': host
        }})
      }
    },
    updateLabelProfile: function (label) {
      if (this.userId) {
        Meteor.users.update(this.userId, { $set: {
          'profile.label': label
        }})
      }
    },
    updateNumUnitsField: function (status) {
      if (this.userId) {
        Meteor.users.update(this.userId, { $set: {
          'profile.numUnitsChecked': status
        }})
      }
    },
    updateBatchCodeField: function (status) {
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

  Meteor.publish('images', function () {
    if (this.userId) {
      return Images.find({}, { sort: { uploadedAt: -1 }, limit: 1 })
    }
  })

  Meteor.publish('plogo', function () {
    if (this.userId) {
      return Plogo.find({}, { sort: { uploadedAt: -1 }, limit: 1 })
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
}
