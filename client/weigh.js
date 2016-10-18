//
// Weigh Template
//

import moment from 'moment'

var pad = function (n, width, z) {
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
  this.templateDict.set('items', [])
  this.templateDict.set('caseWeight', 0)

  this.subscribe('batch')
  this.subscribe('items')
  this.subscribe('customers')
  this.subscribe('ingredients')
  this.subscribe('scales')
  this.subscribe('company')
  this.subscribe('printers')
  this.subscribe('labels')
  this.subscribe('users')
  this.subscribe('prices')
  this.subscribe('nutrition')

  this.autorun(function () {
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

  'click #addItem'(event) {
    var itemList = Template.instance().templateDict.get('items')
    var itemWeight = WeightData.findOne("weight").data / 1000
    var caseWeight = Template.instance().templateDict.get('caseWeight')
    if (caseWeight === 0) {
      caseWeight = Meteor.user().tare
    }
    var itemObject = {}
    itemObject['itemCode'] = document.getElementById('item_code').value
    itemObject['itemWeight'] = itemWeight - caseWeight
    itemList.push(itemObject)
    Template.instance().templateDict.set('items', itemList)
    Template.instance().templateDict.set('caseWeight', itemWeight)
  },

  'click .weigh'(event) {
    event.preventDefault()
    var cust_code = document.getElementById('cust_code').value
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    var settingsPrefix = Company.findOne({ settings: companyId }).prefix
    var created = moment().toDate()

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

    Template.instance().templateDict.set('ready', false)
    Template.instance().templateDict.set('cust', cust_code)
    Template.instance().templateDict.set('batch', created)

    var items = Template.instance().templateDict.get('items')
    if (items.length > 0) {
      for (var i = 0; i < items.length; i++) {
        var item_code = items[i].itemCode
        var item_weight = items[i].itemWeight
        Meteor.call('insertBatch', created, item_code, cust_code, item_weight, num_units, batch_code, function (error) {
          if (error) {
            window.alert(error)
          }
        })
      }
    } else {
      var item = Template.instance().templateDict.get('validItem')
      var indicator = WeightData.findOne("weight").data
      var minWeight = Items.findOne({ item_code: item }).item_minWeight
      var maxWeight = Items.findOne({ item_code: item }).item_maxWeight
      if (maxWeight > indicator && minWeight < indicator) {
        var item_code = document.getElementById('item_code').value
        var itemGTIN = Items.findOne({ item_code: item_code }).item_gtin
        var bcProdDate = moment(created).format('YYMMDD')
        var bcLotNumber = moment(created).format('YYMMDDHHmmss')
        var item_weight = document.getElementById('item_weight').value
        var bcItemWeight = pad(item_weight, 6)
        var barcode = '(01)' + settingsPrefix + itemGTIN + '(11)' + bcProdDate + '(3102)' + bcItemWeight + '(21)' + bcLotNumber

        Template.instance().templateDict.set('barcode', barcode)
        Template.instance().templateDict.set('item', item_code)
        Template.instance().templateDict.set('weight', item_weight)
        Meteor.call('insertBatch', created, item_code, cust_code, item_weight, num_units, batch_code, function (error) {
          if (error) {
            window.alert(error)
          }
        })
      }
    }
  },

  'click .print'(event) {
    event.preventDefault()
    var copies = Template.instance().templateDict.get('numUnits')
    var port = Meteor.user().printerport
    var host = Meteor.user().printerhost
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
    window.confirm('Are you sure you want to undo that label?')
    var lastBatch = Template.instance().templateDict.get('batch')
    Meteor.call('deleteBatch', lastBatch, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'input .profileTare'(event) {
    Meteor.call('updateTareProfile', event.target.value, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #selectscale'(event) {
    Meteor.call('updateScaleProfile', event.target.value, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #selectprinter'(event) {
    Meteor.call('updatePrinterProfile', event.target.value, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #selectlabel'(event) {
    Meteor.call('updateLabelProfile', event.target.value, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #custCodeCheckbox'(event) {
    Meteor.call('updateCustomerField', event.target.checked, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #numUnitsCheckbox'(event) {
    Meteor.call('updateNumUnitsField', event.target.checked, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #batchCodeCheckbox'(event) {
    Meteor.call('updateBatchCodeField', event.target.checked, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },

  'change #multiItemCheckbox'(event) {
    Meteor.call('updateMultiItemField', event.target.checked, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }

})

Template.weigh.helpers({

  indicator() {
    if (typeof WeightData.findOne("weight") != 'undefined') {
      var indicator = {}
      var weight = WeightData.findOne("weight").data
      if (weight != null) {
        var item = Template.instance().templateDict.get('validItem')
        if (item != null) {
          var stdWeight = Items.findOne({ item_code: item }).item_stdWeight
          var maxWeight = Items.findOne({ item_code: item }).item_maxWeight
          var minWeight = Items.findOne({ item_code: item }).item_minWeight
          if (stdWeight != null && stdWeight != 0 && stdWeight != '') {
            indicator.weight = stdWeight
            indicator.display = (stdWeight / 1000).toFixed(3) + ' kg'
            indicator.status = 'green'
            indicator.message = 'Standard Weight'
            return indicator
          } else {
            indicator.weight = weight
            indicator.display = (indicator.weight / 1000).toFixed(3) + ' kg'
            if (maxWeight < weight) {
              indicator.status = 'blue'
              indicator.message = 'Over Max Weight'
            } else if (minWeight > weight) {
              indicator.status = 'red'
              indicator.message = 'Under Min Weight'
            } else {
              indicator.status = 'green'
              indicator.message = 'In Range'
            }
            return indicator
          }
        } else {
          indicator.weight = weight
          indicator.display = (weight / 1000).toFixed(3) + ' kg'
          indicator.status = 'black'
          indicator.message = 'No Item Selected'
          return indicator
        }
      }
    }
  },

  itemList() {
    return Template.instance().templateDict.get('items')
  },

  caseWeight() {
    return Template.instance().templateDict.get('caseWeight') + " kg"
  },

  hideLabel() {
    return Template.instance().templateDict.get('ready')
  },

  batches(createdAt) {
    return Batches.find({}, { sort: { createdAt: -1 }, limit: 1 })
  },

  settings() {
    return Company.findOne({ settings: Meteor.users.findOne(Meteor.userId()).companyId })
  },

  item() {
    return Items.findOne({ item_code: Template.instance().templateDict.get('item') })
  },

  itemNutrition() {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      var nutrition = Items.findOne({ item_code: item }).item_nutrition
      if (nutrition != null) {
        return Nutrition.findOne({ nutrition_code: nutrition })
      }
    }
  },

  customer() {
    var customer = Customers.findOne({ customer_code: Template.instance().templateDict.get('cust') })
    if (customer != null) {
      return customer
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
    var tare = Meteor.user().tare
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

  price() {
    var item = Template.instance().templateDict.get('item')
    var customer = Template.instance().templateDict.get('cust')
    var weight = Template.instance().templateDict.get('weight')
    var tare = Meteor.user().tare
    if (item != null && customer != '') {
      var priceList = Customers.findOne({ 'customer_code': customer }).customer_priceList
      if (priceList != null) {
        var prices = Prices.findOne({ 'price_code': priceList }).price_list
        var lookup = {};
        for (var i = 0, len = prices.length; i < len; i++) {
          lookup[prices[i].price_item] = prices[i];
        }
        return "$" + (lookup[item].price_value * (weight / 1000 - tare)).toFixed(2)
      }
    } else {
      var companyId = Meteor.users.findOne(Meteor.userId()).companyId
      var priceList = Company.findOne({ settings: companyId }).priceList
      if (priceList != null) {
        var prices = Prices.findOne({ 'price_code': priceList }).price_list
        var lookup = {};
        for (var i = 0, len = prices.length; i < len; i++) {
          lookup[prices[i].price_item] = prices[i];
        }
        return "$" + (lookup[item].price_value * (weight / 1000 - tare)).toFixed(2)
      }
    }
  },

  codeDate(createdAt) {
    return moment(createdAt).format('YYMMDD')
  },

  codeWeight(item_weight) {
    return pad(item_weight, 6)
  },

  codeLot(createdAt) {
    return moment(createdAt).format('YYMMDDHHmmss')
  },

  tare() {
    return Meteor.user().tare
  },

  scales() {
    return Scales.find({})
  },

  printers() {
    return Printers.find({})
  },

  labels() {
    return Labels.find({})
  },

  printerSelected() {
    if (this.printer_name === Meteor.user().printer) {
      return 'selected'
    }
  },

  scaleSelected() {
    var scale = function () {
      if (typeof Meteor.user().scale != undefined) {
        return Meteor.user().scale
      }
    }
    if (this.scale_name === Meteor.user().scale) {
      return 'selected'
    }
  },

  labelSelected() {
    if (this.label_code === Meteor.user().label) {
      return 'selected'
    }
  },

  cu() {
    var status = Meteor.user().customerChecked
    if (status === true) {
      var cu = {}
      cu.checked = 'checked'
      cu.true = 'true'
      return cu
    }
  },

  nu() {
    var status = Meteor.user().numUnitsChecked
    if (status === true) {
      var nu = {}
      nu.checked = 'checked'
      nu.true = 'true'
      return nu
    }
  },

  bc() {
    var status = Meteor.user().batchCodeChecked
    if (status === true) {
      var bc = {}
      bc.checked = 'checked'
      bc.true = 'true'
      return bc
    }
  },

  mi() {
    var status = Meteor.user().multiItemChecked
    if (status === true) {
      var mi = {}
      mi.checked = 'checked'
      mi.true = 'true'
      return mi
    }
  },

  itemSettings() {
    return {
      position: 'bottom',
      limit: 3,
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
      limit: 3,
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
    if (typeof BarcodeData.findOne("bcID") != 'undefined') {
      return BarcodeData.findOne("bcID").data
    }
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
      var tare = Meteor.user().tare
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
    var layout = Labels.findOne({ label_code: Meteor.user().label }).label_layout
    var zpl = layout.replace('{{settings.company_name}}', settingsCompanyName).replace('{{settings.street1}}', settingsStreetOne).replace('{{settings.street2}}', settingsStreetTwo).replace('{{settings.city}}', settingsCity).replace('{{settings.province}}', settingsProvince).replace('{{settings.country}}', settingsCountry).replace('{{settings.postal}}', settingsPostal).replace('{{settings.plant_number}}', settingsPlantNumber).replace('{{settings.prefix}}', settingsPrefix).replace('{{dateFull createdAt}}', productionDate).replace('{{showWeight item_weight}}', grossWeight).replace('{{netWeight item_weight}}', netWeight).replace('{{itemName}}', itemName).replace('{{item_code}}', itemCode).replace('{{lotNumber1 createdAt}}', lotNumber).replace('{{custName}}', custName).replace('{{cust_code}}', custCode).replace('{{shelfLife createdAt}}', shelfLife).replace('{{ingredients}}', ingredientsList).replace('{{item_code}}', itemCode).replace('{{codeDate createdAt}}', bcProdDate).replace('{{codeWeight item_weight}}', bcItemWeight).replace('{{codeLot createdAt}}', bcLotNumber).replace(/ {2}/g, '')
    return zpl
  },

  dv_totalFat(nutrition_totalFat) {
    if (nutrition_totalFat) {
      return Math.round((nutrition_totalFat / 80) * 100)
    }
  },
  dv_saturatedFat(nutrition_saturatedFat) {
    if (nutrition_saturatedFat) {
      return Math.round((nutrition_saturatedFat / 20) * 100)
    }
  },
  dv_cholesterol(nutrition_cholesterol) {
    if (nutrition_cholesterol) {
      return Math.round((nutrition_cholesterol / 300) * 100)
    }
  },
  dv_sodium(nutrition_sodium) {
    if (nutrition_sodium) {
      return Math.round((nutrition_sodium / 2400) * 100)
    }
  },
  dv_carbohydrates(nutrition_carbohydrates) {
    if (nutrition_carbohydrates) {
      return Math.round((nutrition_carbohydrates / 280) * 100)
    }
  },
  dv_fiber(nutrition_fiber) {
    if (nutrition_fiber) {
      return Math.round((nutrition_fiber / 30) * 100)
    }
  },
  dv_addedSugar(nutrition_addedSugar) {
    if (nutrition_addedSugar) {
      return Math.round((nutrition_addedSugar / 50) * 100)
    }
  },
  dv_vitaminD(nutrition_vitaminD) {
    if (nutrition_vitaminD) {
      return Math.round((nutrition_vitaminD / 20) * 100)
    }
  },
  dv_calcium(nutrition_calcium) {
    if (nutrition_calcium) {
      return Math.round((nutrition_calcium / 1300) * 100)
    }
  },
  dv_iron(nutrition_iron) {
    if (nutrition_iron) {
      return Math.round((nutrition_iron / 18) * 100)
    }
  },
  dv_potassium(nutrition_potassium) {
    if (nutrition_potassium) {
      return Math.round((nutrition_potassium / 3500) * 100)
    }
  },
  dv_totalFatCA(nutrition_totalFat) {
    if (nutrition_totalFat) {
      return Math.round((nutrition_totalFat / 65) * 100)
    }
  },
  dv_saturatedFatCA(nutrition_saturatedFat, nutrition_transFat) {
    if (nutrition_saturatedFat || nutrition_transFat) {
      var totalSatTrans = Number(nutrition_saturatedFat) + Number(nutrition_transFat)
      return Math.round((totalSatTrans / 20) * 100)
    }
  },
  dv_cholesterolCA(nutrition_cholesterol) {
    if (nutrition_cholesterol) {
      return Math.round((nutrition_cholesterol / 300) * 100)
    }
  },
  dv_sodiumCA(nutrition_sodium) {
    if (nutrition_sodium) {
      return Math.round((nutrition_sodium / 2400) * 100)
    }
  },
  dv_carbohydratesCA(nutrition_carbohydrates) {
    if (nutrition_carbohydrates) {
      return Math.round((nutrition_carbohydrates / 300) * 100)
    }
  },
  dv_fiberCA(nutrition_fiber) {
    if (nutrition_fiber) {
      return Math.round((nutrition_fiber / 25) * 100)
    }
  },
  dv_vitaminACA(nutrition_vitaminA) {
    if (nutrition_vitaminA) {
      return Math.round((nutrition_vitaminA / 1000) * 100)
    }
  },
  dv_vitaminCCA(nutrition_vitaminC) {
    if (nutrition_vitaminC) {
      return Math.round((nutrition_vitaminC / 60) * 100)
    }
  },
  dv_calciumCA(nutrition_calcium) {
    if (nutrition_calcium) {
      return Math.round((nutrition_calcium / 1100) * 100)
    }
  },
  dv_ironCA(nutrition_iron) {
    if (nutrition_iron) {
      return Math.round((nutrition_iron / 14) * 100)
    }
  }
})
