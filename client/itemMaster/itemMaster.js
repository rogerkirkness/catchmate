import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
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
  'click .edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('item', this._id)
  }
})

Template.itemMaster.helpers({
  items() {
    return Items.find({})
  },
  ingredients() {
    return Ingredients.find({})
  },
  ingredientOptions() {
    return Ingredients.find().map(function (ingredients) {
      return {label: ingredients.ingredients_code, value: ingredients.ingredients_code}
    })
  },
  itemActive() {
    var item = Template.instance().templateDict.get('item')
    if (item != null) {
      return Items.findOne(item)
    }
  },
  collection() {
    return Items
  }
})
