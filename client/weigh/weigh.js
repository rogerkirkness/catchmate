import moment from 'moment'
import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

const pad = function (n, width, z) {
  z = z || '0'
  n = n + ''
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n
}

var indicatorVar = new ReactiveDict('indicator', null)
var Scale = new Meteor.Collection('scale')
Scale.find({}).observe({
  changed: function (newDoc, oldDoc) {
    if (newDoc._id === 'weight') {
      indicatorVar.set('indicator', newDoc.weight)
    }
  }
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
  this.subscribe('images')
  this.subscribe('plogo')
  this.subscribe('printers')
  this.subscribe('labels')
  this.autorun(function () {
    Meteor.subscribe('update')
  })
})

Template.weigh.events({
  'blur .item_code': function (event) {
    var item = event.target.value
    Template.instance().templateDict.set('validItem', item)
  },
  'click .weigh': function (event) {
    var indicator = indicatorVar.get('indicator')
    var item = Template.instance().templateDict.get('validItem')
    var minWeight = Items.findOne({item_gtin: item}).item_minWeight
    var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight
    if (maxWeight > indicator && minWeight < indicator) {
      event.preventDefault()
      Template.instance().templateDict.set('ready', false)
      var item_code = document.getElementById('item_code').value
      var cust_code = document.getElementById('cust_code').value
      var created = moment().toDate()
      Template.instance().templateDict.set('item', item_code)
      Template.instance().templateDict.set('cust', cust_code)
      Template.instance().templateDict.set('batch', created)
      var item_weight = document.getElementById('item_weight').value
      var num_units = document.getElementById('num_units').value
      Template.instance().templateDict.set('numUnits', num_units)
      if (!num_units) {
        num_units = 1
        Template.instance().templateDict.set('numUnits', num_units)
      }
      var batch_code = document.getElementById('batch_code').value
      Template.instance().templateDict.set('batchCode', batch_code)
      if (!batch_code) {
        batch_code = moment(created).format('YYYYMMDDHHmmss')
        Template.instance().templateDict.set('batchCode', batch_code)
      }
      Meteor.call('insertBatch', created, item_code, cust_code, item_weight, num_units, batch_code, function (error) {
        if (error) {
          console.log(error)
        }
      })
    }
  },
  'click .print': function (event) {
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
  'click .undo': function (event) {
    event.preventDefault()
    window.confirm('Are you sure you want to undo that label?')
    var lastBatch = Template.instance().templateDict.get('batch')
    Meteor.call('deleteBatch', lastBatch, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'input .profileTare': function (event) {
    event.preventDefault()
    var Tare = event.target.value
    Meteor.call('updateTareProfile', Tare, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'change #selectscale': function (event) {
    event.preventDefault()
    var Scale = event.target.value
    var port = Scales.findOne({scale_name: Scale}).scale_port
    var host = Scales.findOne({scale_name: Scale}).scale_host
    Meteor.call('updateScaleProfile', Scale, port, host, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'change #selectprinter': function (event) {
    event.preventDefault()
    var Printer = event.target.value
    var port = Printers.findOne({printer_name: Printer}).printer_port
    var host = Printers.findOne({printer_name: Printer}).printer_host
    Meteor.call('updatePrinterProfile', Printer, port, host, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'change #selectlabel': function (event) {
    event.preventDefault()
    var label = event.target.value
    Meteor.call('updateLabelProfile', label, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'change #numUnitsCheckbox': function (event) {
    event.preventDefault()
    var status = event.target.checked
    Meteor.call('updateNumUnitsField', status, function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'change #batchCodeCheckbox': function (event) {
    event.preventDefault()
    var status = event.target.checked
    Meteor.call('updateBatchCodeField', status, function (error) {
      if (error) {
        console.log(error)
      }
    })
  }
})

Template.weigh.helpers({
  indicator: function () {
    var indicator = indicatorVar.get('indicator')
    if (indicator != null) {
      var item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        var stdWeight = Items.findOne({item_gtin: item}).item_stdWeight
        if (stdWeight != null) {
          return stdWeight
        } else {
          return indicator
        }
      }
    }
  },
  displayIndicator: function () {
    var indicator = indicatorVar.get('indicator')
    if (indicator != null) {
      var item = Template.instance().templateDict.get('validItem')
      if (item != null) {
        var stdWeight = Items.findOne({item_gtin: item}).item_stdWeight
        if (stdWeight != null) {
          return (stdWeight / 1000).toFixed(3) + ' kg'
        } else {
          return (indicator / 1000).toFixed(3) + ' kg'
        }
      } else {
        return (indicator / 1000).toFixed(3) + ' kg'
      }
    }
  },
  getStatus: function () {
    var indicator = indicatorVar.get('indicator')
    var item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      var stdWeight = Items.findOne({item_gtin: item}).item_stdWeight
      var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight
      var minWeight = Items.findOne({item_gtin: item}).item_minWeight
      if (stdWeight != null) {
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
  statusMessage: function () {
    var indicator = indicatorVar.get('indicator')
    var item = Template.instance().templateDict.get('validItem')
    if (item != null && indicator != null) {
      var stdWeight = Items.findOne({item_gtin: item}).item_stdWeight
      var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight
      var minWeight = Items.findOne({item_gtin: item}).item_minWeight
      if (stdWeight != null) {
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
  hideLabel: function () {
    return Template.instance().templateDict.get('ready')
  },
  batches: function (createdAt) {
    return Batches.find({}, {sort: {createdAt: -1}, limit: 1})
  },
  settings: function () {
    return Company.findOne({settings: 'company'})
  },
  images: function () {
    return Images.find({})
  },
  plogo: function () {
    return Plogo.find({})
  },
  itemName: function () {
    return Items.findOne({item_gtin: Template.instance().templateDict.get('item')}).item_name
  },
  custName: function () {
    var custName = Customers.findOne({customer_code: Template.instance().templateDict.get('cust')}).customer_name
    if (custName != null) {
      return custName
    }
  },
  shelfLife: function (createdAt) {
    var shelfLife = Items.findOne({item_gtin: Template.instance().templateDict.get('item')}).item_shelfLife
    return moment(createdAt).add(shelfLife, 'days').format('DD/MM/YYYY')
  },
  showWeight: function (item_weight) {
    return (item_weight / 1000).toFixed(3) + ' kg'
  },
  netWeight: function (item_weight) {
    var tare = Meteor.user().profile.tare
    return (item_weight / 1000 - tare).toFixed(3) + ' kg'
  },
  dateFull: function (createdAt) {
    return moment(createdAt).format('DD/MM/YYYY')
  },
  lotNumber1: function (createdAt) {
    var batchCode = Template.instance().templateDict.get('batchCode')
    if (!batchCode) {
      return moment(createdAt).format('YYYYMMDDHHmmss')
    } else {
      return batchCode
    }
  },
  ingredients: function () {
    var itemCode = Template.instance().templateDict.get('item')
    if (itemCode != null) {
      var ingredientCode = Items.findOne({item_gtin: itemCode}).item_ingredients
      if (ingredientCode != null) {
        return Ingredients.findOne({ingredients_code: ingredientCode}).ingredients_list
      }
    }
  },
  codeDate: function (createdAt) {
    return moment(createdAt).format('YYMMDD')
  },
  codeWeight: function (item_weight) {
    var formatWeight = pad(item_weight, 6)
    return formatWeight
  },
  codeLot: function (createdAt) {
    return moment(createdAt).format('YYYYMMDDHHmmss')
  },
  scales: function () {
    return Scales.find({})
  },
  printers: function () {
    return Printers.find({})
  },
  printerSelected: function () {
    if (this.printer_name === Meteor.user().profile.printer) {
      return 'selected'
    }
  },
  scaleSelected: function () {
    if (this.scale_name === Meteor.user().profile.scale) {
      return 'selected'
    }
  },
  labelSelected: function () {
    if (this.label_code === Meteor.user().profile.label) {
      return 'selected'
    }
  },
  nuChecked: function () {
    var status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'checked'
    }
  },
  bcChecked: function () {
    var status = Meteor.user().profile.batchCodeChecked
    if (status === true) {
      return 'checked'
    }
  },
  nuShowTrue: function () {
    var status = Meteor.user().profile.numUnitsChecked
    if (status === true) {
      return 'true'
    }
  },
  bcShowTrue: function () {
    var status = Meteor.user().profile.batchCodeChecked
    if (status === true) {
      return 'true'
    }
  },
  labels: function () {
    return Labels.find({})
  },
  itemSettings: function () {
    return {
      position: 'bottom',
      limit: 5,
      rules: [{
        token: '',
        collection: Items,
        field: 'item_gtin',
        sort: true,
        template: Template.itemDropdown
      }]
    }
  },
  custSettings: function () {
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
  url: function () {
    var settingsPrefix = Company.findOne({settings: 'company'}).prefix
    var itemCode = document.getElementById('item_code').value
    var bcProdDate = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDD')
    }
    var bcLotNumber = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYYYMMDDHHmmss')
    }
    var bcItemWeight = function () {
      var itemWeight = document.getElementById('item_weight').value
      var formatWeight = pad(itemWeight, 6)
      return formatWeight
    }
    if (window.location.href.indexOf('catchmate') > -1) {
      var urlapi = 'http://api-bwipjs.rhcloud.com/?bcid=gs1-128&text=(01){{settings.prefix}}{{item_code}}(11){{codeDate createdAt}}(3102){{codeWeight item_weight}}(21){{codeLot createdAt}}&parsefnc'
      var cloudUrl = urlapi.replace('{{settings.prefix}}', settingsPrefix).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ /g, '')
      return cloudUrl
    } else {
      var urlhttp = 'http://localhost:8082/?bcid=gs1-128&text=(01){{settings.prefix}}{{item_code}}(11){{codeDate createdAt}}(3102){{codeWeight item_weight}}(21){{codeLot createdAt}}&parsefnc'
      var localUrl = urlhttp.replace('{{settings.prefix}}', settingsPrefix).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ /g, '')
      return localUrl
    }
  },
  zpl: function () {
    var settingsCompanyName = Company.findOne({settings: 'company'}).company_name
    var settingsStreetOne = Company.findOne({settings: 'company'}).street1
    var settingsStreetTwo = Company.findOne({settings: 'company'}).street2
    var settingsCity = Company.findOne({settings: 'company'}).city
    var settingsProvince = Company.findOne({settings: 'company'}).province
    var settingsCountry = Company.findOne({settings: 'company'}).country
    var settingsPostal = Company.findOne({settings: 'company'}).postal
    var settingsPlantNumber = Company.findOne({settings: 'company'}).plant_number
    var settingsPrefix = Company.findOne({settings: 'company'}).prefix
    var productionDate = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('DD/MM/YYYY')
    }
    var lotNumber = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYYYMMDDHHmmss')
    }
    var shelfLife = function () {
      var date = Batches.findOne({}).createdAt
      var shelfLife = Items.findOne({item_gtin: Template.instance().templateDict.get('item')}).item_shelfLife
      return moment(date).add(shelfLife, 'days').format('DD/MM/YYYY')
    }
    var bcProdDate = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYMMDD')
    }
    var bcLotNumber = function () {
      var date = Batches.findOne({}).createdAt
      return moment(date).format('YYYYMMDDHHmmss')
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
    var itemName = Items.findOne({item_gtin: Template.instance().templateDict.get('item')}).item_name
    var itemCode = document.getElementById('item_code').value
    var custName = Customers.findOne({customer_code: Template.instance().templateDict.get('cust')}).customer_name
    var custCode = document.getElementById('cust_code').value
    var ingredientsList = function () {
      var ingredientCode = Items.findOne({item_gtin: Template.instance().templateDict.get('item')}).item_ingredients
      return Ingredients.findOne({ingredients_code: ingredientCode}).ingredients_list
    }
    var layout = Labels.findOne({label_code: Meteor.user().profile.label}).label_layout
    var zpl = layout.replace('{{settings.company_name}}', settingsCompanyName).replace('{{settings.street1}}', settingsStreetOne).replace('{{settings.street2}}', settingsStreetTwo).replace('{{settings.city}}', settingsCity).replace('{{settings.province}}', settingsProvince).replace('{{settings.country}}', settingsCountry).replace('{{settings.postal}}', settingsPostal).replace('{{settings.plant_number}}', settingsPlantNumber).replace('{{settings.prefix}}', settingsPrefix).replace('{{dateFull createdAt}}', productionDate).replace('{{showWeight item_weight}}', grossWeight).replace('{{netWeight item_weight}}', netWeight).replace('{{itemName}}', itemName).replace('{{item_code}}', itemCode).replace('{{lotNumber1 createdAt}}', lotNumber).replace('{{custName}}', custName).replace('{{cust_code}}', custCode).replace('{{shelfLife createdAt}}', shelfLife).replace('{{ingredients}}', ingredientsList).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ {2}/g, '')
    return zpl
  }
})
