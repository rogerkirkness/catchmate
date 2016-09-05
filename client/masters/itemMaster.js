import { Items } from '/imports/collections'
import { Ingredients } from '/imports/collections'

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
    let item_code = document.getElementById('item_code').value
    let item_gtin = document.getElementById('item_gtin').value
    let item_name = document.getElementById('item_name').value
    let item_unit = document.getElementById('item_unit').value
    let item_brand = document.getElementById('item_brand').value
    let item_shelfLife = document.getElementById('item_shelfLife').value
    let item_stdWeight = document.getElementById('item_stdWeight').value
    let item_minWeight = document.getElementById('item_minWeight').value
    let item_maxWeight = document.getElementById('item_maxWeight').value
    let item_ingredients = document.getElementById('selectIngredients').value
    Meteor.call('insertItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editItem' (event) {
    event.preventDefault()
    let item_code = document.getElementById('item_code_edit').value
    let item_gtin = document.getElementById('item_gtin_edit').value
    let item_name = document.getElementById('item_name_edit').value
    let item_unit = document.getElementById('item_unit_edit').value
    let item_brand = document.getElementById('item_brand_edit').value
    let item_shelfLife = document.getElementById('item_shelfLife_edit').value
    let item_stdWeight = document.getElementById('item_stdWeight_edit').value
    let item_minWeight = document.getElementById('item_minWeight_edit').value
    let item_maxWeight = document.getElementById('item_maxWeight_edit').value
    let item_ingredients = document.getElementById('selectIngredients_edit').value
    Meteor.call('updateItem', item_code, item_gtin, item_name, item_unit, item_brand, item_shelfLife, item_stdWeight, item_minWeight, item_maxWeight, item_ingredients, (error) => {
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
    let item = Template.instance().templateDict.get('item')
    if (item != null) {
      return Items.findOne(item)
    }
  },
  ingredients () {
    return Ingredients.find({})
  },
  selectedIngredient () {
    let item = Template.instance().templateDict.get('item')
    if (item != null) {
      let ingredient = Items.findOne(item).item_ingredients
      if (this.ingredients_code === ingredient) {
        return 'selected'
      }
    }
  }
})
