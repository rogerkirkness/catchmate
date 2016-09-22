import moment from 'moment'
var pad = function(n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

BarcodeData = new Mongo.Collection('barcodedata')
WeightData = new Mongo.Collection('weightdata')

Template.weigh.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('item', null)
  this.templateDict.set('batch', null)
  this.templateDict.set('numUnits', null)
  this.templateDict.set('cust', null)
  this.templateDict.set('validItem', null)
  this.templateDict.set('ready', true)
  this.templateDict.set('batchCode', null)
  this.templateDict.set('barcode', null)

  this.subscribe('batch')
  this.subscribe('items')
  this.subscribe('customers')
  this.subscribe('ingredients')
  this.subscribe('scales')
  this.subscribe('company')
  this.subscribe('printers')
  this.subscribe('labels')
  this.subscribe('users')
  this.autorun(function() {
    Meteor.subscribe('barcode', Template.instance().templateDict.get('barcode'))
  })
  this.autorun(function () {
    Meteor.subscribe('update')
  })
})

Template.weigh.events({
  'blur .item_code'(event) {
    var item = event.target.value
    Template.instance().templateDict.set('validItem', item)
  },
  'click .weigh'(event) {
    var indicator = WeightData.findOne("weight").data
    var item = Template.instance().templateDict.get('validItem')
    var minWeight = Items.findOne({ item_code: item }).item_minWeight
    var maxWeight = Items.findOne({ item_code: item }).item_maxWeight
    if (maxWeight > indicator && minWeight < indicator) {
      event.preventDefault()
      var cust_code = document.getElementById('cust_code').value
      var companyId = Meteor.users.findOne(Meteor.userId()).companyId
      var settingsPrefix = Company.findOne({ settings: companyId }).prefix
      var item_code = document.getElementById('item_code').value
      var itemGTIN = Items.findOne({item_code: item_code }).item_gtin
      var created = moment().toDate()
      var bcProdDate = moment(created).format('YYMMDD')
      var bcLotNumber = moment(created).format('YYMMDDHHmmss')
      var item_weight = document.getElementById('item_weight').value
      var bcItemWeight = pad(item_weight, 6)
      var barcode = '(01)' + settingsPrefix + itemGTIN + '(11)' + bcProdDate + '(3102)' + bcItemWeight + '(21)' + bcLotNumber

      
      Template.instance().templateDict.set('barcode', barcode)
      Template.instance().templateDict.set('item', item_code)
      Template.instance().templateDict.set('ready', false)
      Template.instance().templateDict.set('item', item_code)
      Template.instance().templateDict.set('cust', cust_code)
      Template.instance().templateDict.set('batch', created)

      var num_units = document.getElementById('num_units').value
      Template.instance().templateDict.set('numUnits', num_units)
      if (!num_units) {
        num_units = 1
        Template.instance().templateDict.set('numUnits', num_units)
      }

      var batch_code = document.getElementById('batch_code').value
      Template.instance().templateDict.set('batchCode', batch_code)
      if (!batch_code) {
        batch_code = moment(created).format('YYMMDDHHmmss')
        Template.instance().templateDict.set('batchCode', batch_code)
      }

      Meteor.call('insertBatch', created, item_code, cust_code, item_weight, num_units, batch_code, function (error) {
        if (error) {
          window.alert(error)
        }
      })
    }
  },
  'click .print'(event) {
    event.preventDefault()
    var copies = Template.instance().templateDict.get('numUnits')
    var port = Meteor.user().profile.printerport
    var host = Meteor.user().profile.printerhost
    if (port != null && host != null) {
      var zpl = document.getElementById('zpl').value
      var ip_address = host + ':' + port
      var url = 'http://' + ip_address + '/pstprnt'
      var method = 'POST'
      var request = new window.XMLHttpRequest()
      request.open(method, url, true)
      request.send(zpl)
    } else {
      while (copies > 0) {
        window.print()
        copies = copies - 1
      }
    }
  },
  'click .undo'(event) {
    event.preventDefault()
    window.confirm('Are you sure you want to undo that label?')
    var lastBatch = Template.instance().templateDict.get('batch')
    Meteor.call('deleteBatch', lastBatch, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'input .profileTare'(event) {
    event.preventDefault()
    var Tare = event.target.value
    Meteor.call('updateTareProfile', Tare, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectscale'(event) {
    event.preventDefault()
    var Scale = event.target.value
    var port = Scales.findOne({ scale_name: Scale }).scale_port
    var host = Scales.findOne({ scale_name: Scale }).scale_host
    Meteor.call('updateScaleProfile', Scale, port, host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectprinter'(event) {
    event.preventDefault()
    var Printer = event.target.value
    var port = Printers.findOne({ printer_name: Printer }).printer_port
    var host = Printers.findOne({ printer_name: Printer }).printer_host
    Meteor.call('updatePrinterProfile', Printer, port, host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectlabel'(event) {
    event.preventDefault()
    var label = event.target.value
    Meteor.call('updateLabelProfile', label, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #numUnitsCheckbox'(event) {
    event.preventDefault()
    var status = event.target.checked
    Meteor.call('updateNumUnitsField', status, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #batchCodeCheckbox'(event) {
    event.preventDefault()
    var status = event.target.checked
    Meteor.call('updateBatchCodeField', status, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.weigh.helpers({
  indicator() {
    var indicator = WeightData.findOne("weight").data
    if (indicator != null) {
      var item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        var stdWeight = Items.findOne({ item_code: item }).item_stdWeight
        if (stdWeight != null && stdWeight != 0) {
          return stdWeight
        } else {
          return indicator
        }
      }
    }
  },
  displayIndicator() {
    var indicator = WeightData.findOne("weight").data
    if (indicator != null) {
      var item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        var stdWeight = Items.findOne({ item_code: item }).item_stdWeight
        if (stdWeight != null && stdWeight != 0) {
          return (stdWeight / 1000).toFixed(3) + ' kg'
        } else {
          return (indicator / 1000).toFixed(3) + ' kg'
        }
      } else {
        return (indicator / 1000).toFixed(3) + ' kg'
      }
    }
  },
  getStatus() {
    var indicator = WeightData.findOne("weight").data
    var item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      var stdWeight = Items.findOne({ item_code: item }).item_stdWeight
      var maxWeight = Items.findOne({ item_code: item }).item_maxWeight
      var minWeight = Items.findOne({ item_code: item }).item_minWeight
      if (stdWeight != null && stdWeight != 0) {
        return 'green'
      } else {
        if (maxWeight < indicator) {
          return 'blue'
        } else if (minWeight > indicator) {
          return 'red'
        } else {
          return 'green'
        }
      }
    }
  },
  statusMessage() {
    var indicator = WeightData.findOne("weight").data
    var item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      var stdWeight = Items.findOne({ item_code: item }).item_stdWeight
      var maxWeight = Items.findOne({ item_code: item }).item_maxWeight
      var minWeight = Items.findOne({ item_code: item }).item_minWeight
      if (stdWeight != null && stdWeight != 0) {
        return 'Standard Weight'
      } else {
        if (maxWeight < indicator) {
          return 'Over Max Weight'
        } else if (minWeight > indicator) {
          return 'Under Min Weight'
        } else {
          return 'In Range'
        }
      }
    }
  },
  hideLabel() {
    return Template.instance().templateDict.get('ready')
  },
  batches(createdAt) {
    return Batches.find({}, { sort: { createdAt: -1 }, limit: 1 })
  },
  settings() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({ settings: companyId })
  },
  companylogo() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).clogo
  },
  plantlogo() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).plogo
  },
  itemName() {
    var itemName = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_name
    if (itemName != null) {
      return itemName
    }
  },
  custName() {
    var custName = Customers.findOne({ customer_code: Template.instance().templateDict.get('cust') }).customer_name
    if (custName != null) {
      return custName
    }
  },
  shelfLife(createdAt) {
    var shelfLife = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_shelfLife
    return moment(createdAt).add(shelfLife, 'days').format('DD/MM/YYYY')
  },
  showWeight(item_weight) {
    return (item_weight / 1000).toFixed(3) + ' kg'
  },
  netWeight(item_weight) {
    var tare = Meteor.user().profile.tare
    return (item_weight / 1000 - tare).toFixed(3) + ' kg'
  },
  dateFull(createdAt) {
    return moment(createdAt).format('DD/MM/YYYY')
  },
  lotNumber1(createdAt) {
    var batchCode = Template.instance().templateDict.get('batchCode')
    if (!batchCode) {
      return moment(createdAt).format('YYMMDDHHmmss')
    } else {
      return batchCode
    }
  },
  ingredients() {
    var itemCode = Template.instance().templateDict.get('item')
    if (itemCode != null) {
      var ingredientCode = Items.findOne({ item_code: itemCode }).item_ingredients
      if (ingredientCode != null) {
        return Ingredients.findOne({ ingredients_code: ingredientCode }).ingredients_list
      }
    }
  },
  codeDate(createdAt) {
    return moment(createdAt).format('YYMMDD')
  },
  codeWeight(item_weight) {
    var formatWeight = pad(item_weight, 6)
    return formatWeight
  },
  codeLot(createdAt) {
    return moment(createdAt).format('YYMMDDHHmmss')
  },
  scales() {
    return Scales.find({})
  },
  printers() {
    return Printers.find({})
  },
  printerSelected() {
    if (this.printer_name === Meteor.user().profile.printer) {
      return 'selected'
    }
  },
  scaleSelected() {
    var scale = function () {
      if (typeof Meteor.user().profile.scale != undefined) {
        return Meteor.user().profile.scale
      }
    }
    if (this.scale_name === Meteor.user().profile.scale) {
      return 'selected'
    }
  },
  labelSelected() {
    if (this.label_code === Meteor.user().profile.label) {
      return 'selected'
    }
  },
  nuChecked() {
    var status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'checked'
    }
  },
  bcChecked() {
    var status = Meteor.user().profile.batchCodeChecked
    if (status === true) {
      return 'checked'
    }
  },
  nuShowTrue() {
    var status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'true'
    }
  },
  bcShowTrue() {
    var status = Meteor.user().profile.batchCodeChecked
    if (status === true) {
      return 'true'
    }
  },
  labels() {
    return Labels.find({})
  },
  itemSettings() {
    return {
      position: 'bottom',
      limit: 5,
      rules: [{
        token: '',
        collection: Items,
        field: 'item_code',
        sort: true,
        template: Template.itemDropdown
      }]
    }
  },
  custSettings() {
    return {
      position: 'bottom',
      limit: 5,
      rules: [{
        token: '',
        collection: Customers,
        field: 'customer_code',
        sort: true,
        template: Template.custDropdown
      }]
    }
  },
  url() {
    return BarcodeData.findOne("bcID").data
  },
  zpl() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    var settingsCompanyName = Company.findOne({ settings: companyId }).company_name
    var settingsStreetOne = Company.findOne({ settings: companyId }).street1
    var settingsStreetTwo = Company.findOne({ settings: companyId }).street2
    var settingsCity = Company.findOne({ settings: companyId }).city
    var settingsProvince = Company.findOne({ settings: companyId }).province
    var settingsCountry = Company.findOne({ settings: companyId }).country
    var settingsPostal = Company.findOne({ settings: companyId }).postal
    var settingsPlantNumber = Company.findOne({ settings: companyId }).plant_number
    var settingsPrefix = Company.findOne({ settings: companyId }).prefix
    var productionDate = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('DD/MM/YYYY')
    }
    var lotNumber = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDDHHmmss')
    }
    var shelfLife = function () {
      var date = Batches.findOne({}).createdAt
      var shelfLife = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_shelfLife
      return moment(date).add(shelfLife, 'days').format('DD/MM/YYYY')
    }
    var bcProdDate = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDD')
    }
    var bcLotNumber = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDDHHmmss')
    }
    var grossWeight = function () {
      var item_weight = document.getElementById('item_weight').value
      return (item_weight / 1000).toFixed(3) + ' kg'
    }
    var netWeight = function () {
      var item_weight = document.getElementById('item_weight').value
      var tare = Meteor.user().profile.tare
      return (item_weight / 1000 - tare).toFixed(3) + ' kg'
    }
    var bcItemWeight = function () {
      var item_weight = document.getElementById('item_weight').value
      var formatWeight = pad(item_weight, 6)
      return formatWeight
    }
    var itemName = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_name
    var itemCode = document.getElementById('item_code').value
    var custName = Customers.findOne({ customer_code: Template.instance().templateDict.get('cust') }).customer_name
    var custCode = document.getElementById('cust_code').value
    var ingredientsList = function () {
      var ingredientCode = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_ingredients
      return Ingredients.findOne({ ingredients_code: ingredientCode }).ingredients_list
    }
    var layout = Labels.findOne({ label_code: Meteor.user().profile.label }).label_layout
    var zpl = layout.replace('{{settings.company_name}}', settingsCompanyName).replace('{{settings.street1}}', settingsStreetOne).replace('{{settings.street2}}', settingsStreetTwo).replace('{{settings.city}}', settingsCity).replace('{{settings.province}}', settingsProvince).replace('{{settings.country}}', settingsCountry).replace('{{settings.postal}}', settingsPostal).replace('{{settings.plant_number}}', settingsPlantNumber).replace('{{settings.prefix}}', settingsPrefix).replace('{{dateFull createdAt}}', productionDate).replace('{{showWeight item_weight}}', grossWeight).replace('{{netWeight item_weight}}', netWeight).replace('{{itemName}}', itemName).replace('{{item_code}}', itemCode).replace('{{lotNumber1 createdAt}}', lotNumber).replace('{{custName}}', custName).replace('{{cust_code}}', custCode).replace('{{shelfLife createdAt}}', shelfLife).replace('{{ingredients}}', ingredientsList).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ {2}/g, '')
    return zpl
  }
})
