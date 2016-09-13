import { Ingredients } from '/imports/collections'

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
