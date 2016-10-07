//
// Customer Master
//

Template.customerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('customer', null)
  this.subscribe('customers')
})

Template.customerMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('customer', this._id)
  },
  'click #addCustomer' (event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code').value
    var customer_name = document.getElementById('customer_name').value
    var customer_street1 = document.getElementById('customer_street1').value
    var customer_street2 = document.getElementById('customer_street2').value
    var customer_city = document.getElementById('customer_city').value
    var customer_province = document.getElementById('customer_province').value
    var customer_country = document.getElementById('customer_country').value
    var customer_postal = document.getElementById('customer_postal').value
    Meteor.call('insertCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editCustomer' (event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code_edit').value
    var customer_name = document.getElementById('customer_name_edit').value
    var customer_street1 = document.getElementById('customer_street1_edit').value
    var customer_street2 = document.getElementById('customer_street2_edit').value
    var customer_city = document.getElementById('customer_city_edit').value
    var customer_province = document.getElementById('customer_province_edit').value
    var customer_country = document.getElementById('customer_country_edit').value
    var customer_postal = document.getElementById('customer_postal_edit').value
    Meteor.call('updateCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.customerMaster.helpers({
  customers() {
    return Customers.find({})
  },
  customer() {
    var customer = Template.instance().templateDict.get('customer')
    if (customer != null) {
      return Customers.findOne(customer)
    }
  }
})

//
// Ingredient Master
//

Template.ingredientMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('ingredient', null)
  this.subscribe('ingredients')
})

Template.ingredientMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('ingredient', this._id)
  },
  'click #addIngredient' (event) {
    event.preventDefault()
    var ingredients_code = document.getElementById('ingredients_code').value
    var ingredients_list = document.getElementById('ingredients_list').value
    Meteor.call('insertIngredients', ingredients_code, ingredients_list, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editIngredient' (event) {
    event.preventDefault()
    var ingredients_code = document.getElementById('ingredients_code_edit').value
    var ingredients_list = document.getElementById('ingredients_list_edit').value
    Meteor.call('updateIngredients', ingredients_code, ingredients_list, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.ingredientMaster.helpers({
  ingredients () {
    return Ingredients.find({})
  },
  ingredient () {
    var ingredient = Template.instance().templateDict.get('ingredient')
    if (ingredient != null) {
      return Ingredients.findOne(ingredient)
    }
  }
})

//
// Item Master
//

Template.itemMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('item', null)
  this.subscribe('items')
  this.subscribe('ingredients')
  window.Ingredients = Ingredients
})

Template.itemMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('item', this._id)
  },
  'click #addItem' (event) {
    event.preventDefault()
    var item_code = document.getElementById('item_code').value
    var item_gtin = document.getElementById('item_gtin').value
    var item_name = document.getElementById('item_name').value
    var item_unit = document.getElementById('item_unit').value
    var item_brand = document.getElementById('item_brand').value
    var item_shelfLife = document.getElementById('item_shelfLife').value
    var item_stdWeight = document.getElementById('item_stdWeight').value
    var item_minWeight = document.getElementById('item_minWeight').value
    var item_maxWeight = document.getElementById('item_maxWeight').value
    var item_ingredients = document.getElementById('selectIngredients').value
    Meteor.call('insertItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editItem' (event) {
    event.preventDefault()
    var item_code = document.getElementById('item_code_edit').value
    var item_gtin = document.getElementById('item_gtin_edit').value
    var item_name = document.getElementById('item_name_edit').value
    var item_unit = document.getElementById('item_unit_edit').value
    var item_brand = document.getElementById('item_brand_edit').value
    var item_shelfLife = document.getElementById('item_shelfLife_edit').value
    var item_stdWeight = document.getElementById('item_stdWeight_edit').value
    var item_minWeight = document.getElementById('item_minWeight_edit').value
    var item_maxWeight = document.getElementById('item_maxWeight_edit').value
    var item_ingredients = document.getElementById('selectIngredients_edit').value
    Meteor.call('updateItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.itemMaster.helpers({
  items () {
    return Items.find({})
  },
  item () {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      return Items.findOne(item)
    }
  },
  ingredients () {
    return Ingredients.find({})
  },
  selectedIngredient () {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      var ingredient = Items.findOne(item).item_ingredients
      if (this.ingredients_code === ingredient) {
        return 'selected'
      }
    }
  }
})

//
// Label Master
//

Template.labelMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('label', null)
  this.subscribe('labels')
})

Template.labelMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('label', this._id)
  },
  'click #addLabel' (event) {
    event.preventDefault()
    var label_code = document.getElementById('label_code').value
    var label_layout = document.getElementById('label_layout').value
    Meteor.call('insertLabel', label_code, label_layout, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editLabel' (event) {
    event.preventDefault()
    var label_code = document.getElementById('label_code_edit').value
    var label_layout = document.getElementById('label_layout_edit').value
    Meteor.call('updateLabel', label_code, label_layout, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.labelMaster.helpers({
  labels () {
    return Labels.find({})
  },
  label () {
    var label = Template.instance().templateDict.get('label')
    if (label != null) {
      return Labels.findOne(label)
    }
  }
})

//
// Printer Master
//

Template.printerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('printer', null)
  this.subscribe('printers')
})

Template.printerMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('printer', this._id)
  },
  'click #addPrinter' (event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code').value
    var printer_name = document.getElementById('printer_name').value
    var printer_port = document.getElementById('printer_port').value
    var printer_host = document.getElementById('printer_host').value
    Meteor.call('insertPrinter', printer_code, printer_name, printer_port, printer_host, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editPrinter' (event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code_edit').value
    var printer_name = document.getElementById('printer_name_edit').value
    var printer_port = document.getElementById('printer_port_edit').value
    var printer_host = document.getElementById('printer_host_edit').value
    Meteor.call('updatePrinter', printer_code, printer_name, printer_port, printer_host, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.printerMaster.helpers({
  printers () {
    return Printers.find({})
  },
  printer () {
    var printer = Template.instance().templateDict.get('printer')
    if (printer != null) {
      return Printers.findOne(printer)
    }
  }
})

//
// Scale Master
//

Template.scaleMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('scale', null)
  this.subscribe('scales')
})

Template.scaleMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('scale', this._id)
  },
  'click #addScale' (event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code').value
    var scale_name = document.getElementById('scale_name').value
    var scale_port = document.getElementById('scale_port').value
    var scale_host = document.getElementById('scale_host').value
    Meteor.call('insertScale', scale_code, scale_name, scale_port, scale_host, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editScale' (event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code_edit').value
    var scale_name = document.getElementById('scale_name_edit').value
    var scale_port = document.getElementById('scale_port_edit').value
    var scale_host = document.getElementById('scale_host_edit').value
    Meteor.call('updateScale', scale_code, scale_name, scale_port, scale_host, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.scaleMaster.helpers({
  scales () {
    return Scales.find({})
  },
  scale () {
    var scale = Template.instance().templateDict.get('scale')
    if (scale != null) {
      return Scales.findOne(scale)
    }
  }
})

//
// Price List Master
//

Template.priceListMaster.onCreated(function() {

})

Template.priceListMaster.events({

})

Template.priceListMaster.helpers({

})

//
// Nutrition Facts Master
//

Template.nutritionFactsMaster.onCreated(function() {

})

Template.nutritionFactsMaster.events({

})

Template.nutritionFactsMaster.helpers({
  
})