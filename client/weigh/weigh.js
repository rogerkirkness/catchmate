import moment from 'moment'
import { Customers } from '/imports/collections'
import { Batches } from '/imports/collections'
import { Items } from '/imports/collections'
import { Ingredients } from '/imports/collections'
import { Printers } from '/imports/collections'
import { Scales } from '/imports/collections'
import { Company } from '/imports/collections'
import { Labels } from '/imports/collections'

const pad = (n, width, z) => {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

const streamer = new Meteor.Streamer('scale')
const indicatorVar = new ReactiveDict('indicator', null)
streamer.on('weight', function (weight) {
  indicatorVar.set('indicator', weight)
})

Template.weigh.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('item', null)
  this.templateDict.set('batch', null)
  this.templateDict.set('numUnits', null)
  this.templateDict.set('cust', null)
  this.templateDict.set('validItem', null)
  this.templateDict.set('ready', true)
  this.templateDict.set('batchCode', null)

  this.subscribe('batch')
  this.subscribe('items')
  this.subscribe('customers')
  this.subscribe('ingredients')
  this.subscribe('scales')
  this.subscribe('company')
  this.subscribe('printers')
  this.subscribe('labels')
  this.subscribe('users')

  this.autorun(function () {
    Meteor.subscribe('update')
  })
})

Template.weigh.events({
  'blur .item_code'(event) {
    let item = event.target.value
    Template.instance().templateDict.set('validItem', item)
  },
  'click .weigh'(event) {
    let indicator = indicatorVar.get('indicator')
    let item = Template.instance().templateDict.get('validItem')
    let minWeight = Items.findOne({ item_code: item }).item_minWeight
    let maxWeight = Items.findOne({ item_code: item }).item_maxWeight

    if (maxWeight > indicator && minWeight < indicator) {
      event.preventDefault()

      Template.instance().templateDict.set('ready', false)

      let item_code = document.getElementById('item_code').value
      let cust_code = document.getElementById('cust_code').value
      let item_weight = document.getElementById('item_weight').value
      let created = moment().toDate()
      Template.instance().templateDict.set('item', item_code)
      Template.instance().templateDict.set('cust', cust_code)
      Template.instance().templateDict.set('batch', created)

      let num_units = document.getElementById('num_units').value
      Template.instance().templateDict.set('numUnits', num_units)
      if (!num_units) {
        num_units = 1
        Template.instance().templateDict.set('numUnits', num_units)
      }

      let batch_code = document.getElementById('batch_code').value
      Template.instance().templateDict.set('batchCode', batch_code)
      if (!batch_code) {
        batch_code = moment(created).format('YYYYMMDDHHmmss')
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
    let copies = Template.instance().templateDict.get('numUnits')
    let port = Meteor.user().profile.printerport
    let host = Meteor.user().profile.printerhost
    if (port != null && host != null) {
      let zpl = document.getElementById('zpl').value
      let ip_address = host + ':' + port
      let url = 'http://' + ip_address + '/pstprnt'
      let method = 'POST'
      let request = new window.XMLHttpRequest()
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
    let lastBatch = Template.instance().templateDict.get('batch')
    Meteor.call('deleteBatch', lastBatch, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'input .profileTare'(event) {
    event.preventDefault()
    let Tare = event.target.value
    Meteor.call('updateTareProfile', Tare, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectscale'(event) {
    event.preventDefault()
    let Scale = event.target.value
    let port = Scales.findOne({ scale_name: Scale }).scale_port
    let host = Scales.findOne({ scale_name: Scale }).scale_host
    Meteor.call('updateScaleProfile', Scale, port, host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectprinter'(event) {
    event.preventDefault()
    let Printer = event.target.value
    let port = Printers.findOne({ printer_name: Printer }).printer_port
    let host = Printers.findOne({ printer_name: Printer }).printer_host
    Meteor.call('updatePrinterProfile', Printer, port, host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #selectlabel'(event) {
    event.preventDefault()
    let label = event.target.value
    Meteor.call('updateLabelProfile', label, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #numUnitsCheckbox'(event) {
    event.preventDefault()
    let status = event.target.checked
    Meteor.call('updateNumUnitsField', status, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'change #batchCodeCheckbox'(event) {
    event.preventDefault()
    let status = event.target.checked
    Meteor.call('updateBatchCodeField', status, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.weigh.helpers({
  indicator() {
    let indicator = indicatorVar.get('indicator')
    if (indicator != null) {
      let item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        let stdWeight = Items.findOne({ item_code: item }).item_stdWeight
        if (stdWeight != null && stdWeight != 0) {
          return stdWeight
        } else {
          return indicator
        }
      }
    }
  },
  displayIndicator() {
    let indicator = indicatorVar.get('indicator')
    if (indicator != null) {
      let item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        let stdWeight = Items.findOne({ item_code: item }).item_stdWeight
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
    let indicator = indicatorVar.get('indicator')
    let item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      let stdWeight = Items.findOne({ item_code: item }).item_stdWeight
      let maxWeight = Items.findOne({ item_code: item }).item_maxWeight
      let minWeight = Items.findOne({ item_code: item }).item_minWeight
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
    let indicator = indicatorVar.get('indicator')
    let item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      let stdWeight = Items.findOne({ item_code: item }).item_stdWeight
      let maxWeight = Items.findOne({ item_code: item }).item_maxWeight
      let minWeight = Items.findOne({ item_code: item }).item_minWeight
      if (stdWeight != null && stdWeight != 0) {
        return 'Std Weight'
      } else {
        if (maxWeight < indicator) {
          return 'Overweight'
        } else if (minWeight > indicator) {
          return 'Underweight'
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
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({ settings: companyId })
  },
  companylogo() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).clogo
  },
  plantlogo() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).plogo
  },
  itemName() {
    let itemName = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_name
    if (itemName != null) {
      return itemName
    }
  },
  custName() {
    let custName = Customers.findOne({ customer_code: Template.instance().templateDict.get('cust') }).customer_name
    if (custName != null) {
      return custName
    }
  },
  shelfLife(createdAt) {
    let shelfLife = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_shelfLife
    return moment(createdAt).add(shelfLife, 'days').format('DD/MM/YYYY')
  },
  showWeight(item_weight) {
    return (item_weight / 1000).toFixed(3) + ' kg'
  },
  netWeight(item_weight) {
    let tare = Meteor.user().profile.tare
    return (item_weight / 1000 - tare).toFixed(3) + ' kg'
  },
  dateFull(createdAt) {
    return moment(createdAt).format('DD/MM/YYYY')
  },
  lotNumber1(createdAt) {
    let batchCode = Template.instance().templateDict.get('batchCode')
    if (!batchCode) {
      return moment(createdAt).format('YYYYMMDDHHmmss')
    } else {
      return batchCode
    }
  },
  ingredients() {
    let itemCode = Template.instance().templateDict.get('item')
    if (itemCode != null) {
      let ingredientCode = Items.findOne({ item_code: itemCode }).item_ingredients
      if (ingredientCode != null) {
        return Ingredients.findOne({ ingredients_code: ingredientCode }).ingredients_list
      }
    }
  },
  codeDate(createdAt) {
    return moment(createdAt).format('YYMMDD')
  },
  codeWeight(item_weight) {
    let formatWeight = pad(item_weight, 6)
    return formatWeight
  },
  codeLot(createdAt) {
    return moment(createdAt).format('YYYYMMDDHHmmss')
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
    let scale = function () {
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
    let status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'checked'
    }
  },
  bcChecked() {
    let status = Meteor.user().profile.batchCodeChecked
    if (status === true) {
      return 'checked'
    }
  },
  nuShowTrue() {
    let status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'true'
    }
  },
  bcShowTrue() {
    let status = Meteor.user().profile.batchCodeChecked
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
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    let settingsPrefix = Company.findOne({ settings: companyId }).prefix
    
    let itemCode = document.getElementById('item_code').value
    let itemGTIN = Items.findOne({item_code: itemCode }).item_gtin
    
    let date = Batches.findOne({}).createdAt
    let bcProdDate = moment(date).format('YYMMDD')
    let bcLotNumber = moment(date).format('YYYYMMDDHHmmss')

    let itemWeight = document.getElementById('item_weight').value
    let bcItemWeight = pad(itemWeight, 6)

    return window.location.href + 'bc/?bcid=gs1-128&text=(01)' + settingsPrefix + itemGTIN + '(11)' + bcProdDate + '(3102)' + bcItemWeight + '(21)' + bcLotNumber + '&parsefnc'
  },
  bcText() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    let settingsPrefix = Company.findOne({ settings: companyId }).prefix
    
    let itemCode = document.getElementById('item_code').value
    let itemGTIN = Items.findOne({item_code: itemCode }).item_gtin
    
    let date = Batches.findOne({}).createdAt
    let bcProdDate = moment(date).format('YYMMDD')
    let bcLotNumber = moment(date).format('YYYYMMDDHHmmss')

    let itemWeight = document.getElementById('item_weight').value
    let bcItemWeight = pad(itemWeight, 6)
    
    return '(01)' + settingsPrefix + itemGTIN + '(11)' + bcProdDate + '(3102)' + bcItemWeight + '(21)' + bcLotNumber
  },
  zpl() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    let settingsCompanyName = Company.findOne({ settings: companyId }).company_name
    let settingsStreetOne = Company.findOne({ settings: companyId }).street1
    let settingsStreetTwo = Company.findOne({ settings: companyId }).street2
    let settingsCity = Company.findOne({ settings: companyId }).city
    let settingsProvince = Company.findOne({ settings: companyId }).province
    let settingsCountry = Company.findOne({ settings: companyId }).country
    let settingsPostal = Company.findOne({ settings: companyId }).postal
    let settingsPlantNumber = Company.findOne({ settings: companyId }).plant_number
    let settingsPrefix = Company.findOne({ settings: companyId }).prefix
    let productionDate = function () {
      let date = Batches.findOne({}).createdAt
      return moment(date).format('DD/MM/YYYY')
    }
    let lotNumber = function () {
      let date = Batches.findOne({}).createdAt
      return moment(date).format('YYYYMMDDHHmmss')
    }
    let shelfLife = function () {
      let date = Batches.findOne({}).createdAt
      let shelfLife = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_shelfLife
      return moment(date).add(shelfLife, 'days').format('DD/MM/YYYY')
    }
    let bcProdDate = function () {
      let date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDD')
    }
    let bcLotNumber = function () {
      let date = Batches.findOne({}).createdAt
      return moment(date).format('YYYYMMDDHHmmss')
    }
    let grossWeight = function () {
      let item_weight = document.getElementById('item_weight').value
      return (item_weight / 1000).toFixed(3) + ' kg'
    }
    let netWeight = function () {
      let item_weight = document.getElementById('item_weight').value
      let tare = Meteor.user().profile.tare
      return (item_weight / 1000 - tare).toFixed(3) + ' kg'
    }
    let bcItemWeight = function () {
      let item_weight = document.getElementById('item_weight').value
      let formatWeight = pad(item_weight, 6)
      return formatWeight
    }
    let itemName = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_name
    let itemCode = document.getElementById('item_code').value
    let custName = Customers.findOne({ customer_code: Template.instance().templateDict.get('cust') }).customer_name
    let custCode = document.getElementById('cust_code').value
    let ingredientsList = function () {
      let ingredientCode = Items.findOne({ item_code: Template.instance().templateDict.get('item') }).item_ingredients
      return Ingredients.findOne({ ingredients_code: ingredientCode }).ingredients_list
    }
    let layout = Labels.findOne({ label_code: Meteor.user().profile.label }).label_layout
    let zpl = layout.replace('{{settings.company_name}}', settingsCompanyName).replace('{{settings.street1}}', settingsStreetOne).replace('{{settings.street2}}', settingsStreetTwo).replace('{{settings.city}}', settingsCity).replace('{{settings.province}}', settingsProvince).replace('{{settings.country}}', settingsCountry).replace('{{settings.postal}}', settingsPostal).replace('{{settings.plant_number}}', settingsPlantNumber).replace('{{settings.prefix}}', settingsPrefix).replace('{{dateFull createdAt}}', productionDate).replace('{{showWeight item_weight}}', grossWeight).replace('{{netWeight item_weight}}', netWeight).replace('{{itemName}}', itemName).replace('{{item_code}}', itemCode).replace('{{lotNumber1 createdAt}}', lotNumber).replace('{{custName}}', custName).replace('{{cust_code}}', custCode).replace('{{shelfLife createdAt}}', shelfLife).replace('{{ingredients}}', ingredientsList).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ {2}/g, '')
    return zpl
  }
})
