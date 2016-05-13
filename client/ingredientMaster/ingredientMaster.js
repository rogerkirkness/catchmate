import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Ingredients } from '/imports/collections'

Template.ingredientMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('ingredient', null)
  this.subscribe('ingredients')
})

Template.ingredientMaster.events({
  'click .edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('ingredient', this._id)
  }
})

Template.ingredientMaster.helpers({
  ingredients() {
    return Ingredients.find({})
  },
  ingredientActive() {
    var ingredient = Template.instance().templateDict.get('ingredient')
    if (ingredient != null) {
      return Ingredients.findOne(ingredient)
    }
  },
  collection() {
    return Ingredients
  }
})
