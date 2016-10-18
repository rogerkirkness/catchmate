import _ from 'underscore'

//
// Customer Master
//

Template.customerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('customer', null)
  this.subscribe('customers')
  this.subscribe('prices')
  window.Prices = Prices
})

Template.customerMaster.events({
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('customer', this._id)
  },
  'click #addCustomer'(event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code').value
    var customer_name = document.getElementById('customer_name').value
    var customer_street1 = document.getElementById('customer_street1').value
    var customer_street2 = document.getElementById('customer_street2').value
    var customer_city = document.getElementById('customer_city').value
    var customer_province = document.getElementById('customer_province').value
    var customer_country = document.getElementById('customer_country').value
    var customer_postal = document.getElementById('customer_postal').value
    var customer_priceList = document.getElementById('selectPriceList').value
    Meteor.call('insertCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editCustomer'(event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code_edit').value
    var customer_name = document.getElementById('customer_name_edit').value
    var customer_street1 = document.getElementById('customer_street1_edit').value
    var customer_street2 = document.getElementById('customer_street2_edit').value
    var customer_city = document.getElementById('customer_city_edit').value
    var customer_province = document.getElementById('customer_province_edit').value
    var customer_country = document.getElementById('customer_country_edit').value
    var customer_postal = document.getElementById('customer_postal_edit').value
    var customer_priceList = document.getElementById('selectPriceList_edit').value
    Meteor.call('updateCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, customer_priceList, function (error) {
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
  },
  priceList() {
    return Prices.find({})
  },
  selectedPriceList() {
    var customer = Template.instance().templateDict.get('customer')
    if (customer != null) {
      var priceList = Customers.findOne(customer).customer_priceList
      if (this.price_code === priceList) {
        return 'selected'
      }
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
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('ingredient', this._id)
  },
  'click #addIngredient'(event) {
    event.preventDefault()
    var ingredients_code = document.getElementById('ingredients_code').value
    var ingredients_list = document.getElementById('ingredients_list').value
    Meteor.call('insertIngredients', ingredients_code, ingredients_list, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editIngredient'(event) {
    event.preventDefault()
    var ingredients_code = document.getElementById('ingredients_code_edit').value
    var ingredients_list = document.getElementById('ingredients_list_edit').value
    Meteor.call('updateIngredients', ingredients_code, ingredients_list, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.ingredientMaster.helpers({
  ingredients() {
    return Ingredients.find({})
  },
  ingredient() {
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
  this.subscribe('nutrition')
  window.Ingredients = Ingredients
  window.Nutrition = Nutrition
})

Template.itemMaster.events({
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('item', this._id)
  },
  'click #addItem'(event) {
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
    var item_nutrition = document.getElementById('selectNutrition').value
    Meteor.call('insertItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, item_nutrition, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editItem'(event) {
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
    var item_nutrition = document.getElementById('selectNutrition_edit').value
    Meteor.call('updateItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, item_nutrition, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.itemMaster.helpers({
  items() {
    return Items.find({})
  },
  item() {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      return Items.findOne(item)
    }
  },
  ingredients() {
    return Ingredients.find({})
  },
  selectedIngredient() {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      var ingredient = Items.findOne(item).item_ingredients
      if (this.ingredients_code === ingredient) {
        return 'selected'
      }
    }
  },
  nutritions() {
    return Nutrition.find({})
  },
  selectedNutrition() {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      var nutrition = Items.findOne(item).item_nutrition
      if (this.nutrition_code === nutrition) {
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
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('label', this._id)
  },
  'click #addLabel'(event) {
    event.preventDefault()
    var label_code = document.getElementById('label_code').value
    var label_name = document.getElementById('label_name').value
    var label_layout = document.getElementById('label_layout').value
    Meteor.call('insertLabel', label_code, label_name, label_layout, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editLabel'(event) {
    event.preventDefault()
    var label_code = document.getElementById('label_code_edit').value
    var label_name = document.getElementById('label_name_edit').value
    var label_layout = document.getElementById('label_layout_edit').value
    Meteor.call('updateLabel', label_code, label_name, label_layout, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.labelMaster.helpers({
  labels() {
    return Labels.find({})
  },
  label() {
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
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('printer', this._id)
  },
  'click #addPrinter'(event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code').value
    var printer_name = document.getElementById('printer_name').value
    var printer_port = document.getElementById('printer_port').value
    var printer_host = document.getElementById('printer_host').value
    Meteor.call('insertPrinter', printer_code, printer_name, printer_port, printer_host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editPrinter'(event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code_edit').value
    var printer_name = document.getElementById('printer_name_edit').value
    var printer_port = document.getElementById('printer_port_edit').value
    var printer_host = document.getElementById('printer_host_edit').value
    Meteor.call('updatePrinter', printer_code, printer_name, printer_port, printer_host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.printerMaster.helpers({
  printers() {
    return Printers.find({})
  },
  printer() {
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
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('scale', this._id)
  },
  'click #addScale'(event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code').value
    var scale_name = document.getElementById('scale_name').value
    var scale_port = document.getElementById('scale_port').value
    var scale_host = document.getElementById('scale_host').value
    Meteor.call('insertScale', scale_code, scale_name, scale_port, scale_host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editScale'(event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code_edit').value
    var scale_name = document.getElementById('scale_name_edit').value
    var scale_port = document.getElementById('scale_port_edit').value
    var scale_host = document.getElementById('scale_host_edit').value
    Meteor.call('updateScale', scale_code, scale_name, scale_port, scale_host, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.scaleMaster.helpers({
  scales() {
    return Scales.find({})
  },
  scale() {
    var scale = Template.instance().templateDict.get('scale')
    if (scale != null) {
      return Scales.findOne(scale)
    }
  }
})

//
// Price List Master
//

Template.priceListMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('price', null)
  this.subscribe('prices')
  this.subscribe('items')
})

Template.priceListMaster.events({
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('price', this._id)
  },
  'click #addPrice'(event) {
    event.preventDefault()
    var price_code = document.getElementById('price_code').value
    var price_name = document.getElementById('price_name').value
    var prices = document.getElementsByClassName('prices')
    var price_list = []
    _.forEach(prices, function (result) {
      var sub_list = {}
      sub_list['price_item'] = result.id
      sub_list['price_value'] = result.value
      price_list.push(sub_list)
    })
    Meteor.call('insertPrice', price_code, price_name, price_list, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editPrice'(event) {
    event.preventDefault()
    var price_code = document.getElementById('price_code_edit').value
    var price_name = document.getElementById('price_name_edit').value
    var prices = document.getElementsByClassName('prices_edit')
    var price_list = []
    _.forEach(prices, function (result) {
      var sub_list = {}
      sub_list['price_item'] = result.id
      sub_list['price_value'] = result.value
      price_list.push(sub_list)
    })
    Meteor.call('updatePrice', price_code, price_name, price_list, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.priceListMaster.helpers({
  items() {
    return Items.find({})
  },
  prices() {
    return Prices.find({})
  },
  price() {
    var price = Template.instance().templateDict.get('price')
    if (price != null) {
      return Prices.findOne(price)
    }
  }
})

//
// Nutrition Facts Master
//

Template.nutritionFactsMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('nutrition', null)
  this.subscribe('nutrition')
})

Template.nutritionFactsMaster.events({
  'click #edit'(event) {
    event.preventDefault()
    Template.instance().templateDict.set('nutrition', this._id)
  },
  'click #addNutrition'(event) {
    event.preventDefault()
    var nutrition_code = document.getElementById('nutrition_code').value
    var nutrition_name = document.getElementById('nutrition_name').value
    var nutrition_servingsPerContainer = document.getElementById('nutrition_servingsPerContainer').value
    var nutrition_servingSize = document.getElementById('nutrition_servingSize').value
    var nutrition_servingSizeFR = document.getElementById('nutrition_servingSizeFR').value
    var nutrition_calories = document.getElementById('nutrition_calories').value
    var nutrition_totalFat = document.getElementById('nutrition_totalFat').value
    var nutrition_saturatedFat = document.getElementById('nutrition_saturatedFat').value
    var nutrition_transFat = document.getElementById('nutrition_transFat').value
    var nutrition_cholesterol = document.getElementById('nutrition_cholesterol').value
    var nutrition_sodium = document.getElementById('nutrition_sodium').value
    var nutrition_carbohydrates = document.getElementById('nutrition_carbohydrates').value
    var nutrition_fiber = document.getElementById('nutrition_fiber').value
    var nutrition_sugar = document.getElementById('nutrition_sugar').value
    var nutrition_addedSugar = document.getElementById('nutrition_addedSugar').value
    var nutrition_protein = document.getElementById('nutrition_protein').value
    var nutrition_vitaminA = document.getElementById('nutrition_vitaminA').value
    var nutrition_vitaminC = document.getElementById('nutrition_vitaminC').value
    var nutrition_vitaminD = document.getElementById('nutrition_vitaminD').value
    var nutrition_calcium = document.getElementById('nutrition_calcium').value
    var nutrition_iron = document.getElementById('nutrition_iron').value
    var nutrition_potassium = document.getElementById('nutrition_potassium').value
    Meteor.call('insertNutrition', nutrition_code, nutrition_name, nutrition_servingsPerContainer, nutrition_servingSize, nutrition_servingSizeFR, nutrition_calories, nutrition_totalFat, nutrition_saturatedFat, nutrition_transFat, nutrition_cholesterol, nutrition_sodium, nutrition_carbohydrates, nutrition_fiber, nutrition_sugar, nutrition_addedSugar, nutrition_protein, nutrition_vitaminA, nutrition_vitaminC, nutrition_vitaminD, nutrition_calcium, nutrition_iron, nutrition_potassium, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editNutrition'(event) {
    event.preventDefault()
    var nutrition_code = document.getElementById('nutrition_code_edit').value
    var nutrition_name = document.getElementById('nutrition_name_edit').value
    var nutrition_servingsPerContainer = document.getElementById('nutrition_servingsPerContainer_edit').value
    var nutrition_servingSize = document.getElementById('nutrition_servingSize_edit').value
    var nutrition_servingSizeFR = document.getElementById('nutrition_servingSizeFR_edit').value
    var nutrition_calories = document.getElementById('nutrition_calories_edit').value
    var nutrition_totalFat = document.getElementById('nutrition_totalFat_edit').value
    var nutrition_saturatedFat = document.getElementById('nutrition_saturatedFat_edit').value
    var nutrition_transFat = document.getElementById('nutrition_transFat_edit').value
    var nutrition_cholesterol = document.getElementById('nutrition_cholesterol_edit').value
    var nutrition_sodium = document.getElementById('nutrition_sodium_edit').value
    var nutrition_carbohydrates = document.getElementById('nutrition_carbohydrates_edit').value
    var nutrition_fiber = document.getElementById('nutrition_fiber_edit').value
    var nutrition_sugar = document.getElementById('nutrition_sugar_edit').value
    var nutrition_addedSugar = document.getElementById('nutrition_addedSugar_edit').value
    var nutrition_protein = document.getElementById('nutrition_protein_edit').value
    var nutrition_vitaminA = document.getElementById('nutrition_vitaminA_edit').value
    var nutrition_vitaminC = document.getElementById('nutrition_vitaminC_edit').value
    var nutrition_vitaminD = document.getElementById('nutrition_vitaminD_edit').value
    var nutrition_calcium = document.getElementById('nutrition_calcium_edit').value
    var nutrition_iron = document.getElementById('nutrition_iron_edit').value
    var nutrition_potassium = document.getElementById('nutrition_potassium_edit').value
    Meteor.call('updateNutrition', nutrition_code, nutrition_name, nutrition_servingsPerContainer, nutrition_servingSize, nutrition_servingSizeFR, nutrition_calories, nutrition_totalFat, nutrition_saturatedFat, nutrition_transFat, nutrition_cholesterol, nutrition_sodium, nutrition_carbohydrates, nutrition_fiber, nutrition_sugar, nutrition_addedSugar, nutrition_protein, nutrition_vitaminA, nutrition_vitaminC, nutrition_vitaminD, nutrition_calcium, nutrition_iron, nutrition_potassium, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.nutritionFactsMaster.helpers({
  nutritions() {
    return Nutrition.find({})
  },
  nutrition() {
    var nutrition = Template.instance().templateDict.get('nutrition')
    if (nutrition != null) {
      return Nutrition.findOne(nutrition)
    }
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