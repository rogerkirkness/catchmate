Template.ingredientMaster.onCreated(function () {
  this.ingredient = new ReactiveVar(null);
  this.subscribe('ingredients');
});

Template.ingredientMaster.events({
  'click .edit': function (event) {
    event.preventDefault();
    Template.instance().ingredient.set(this._id);
  },
});

Template.ingredientMaster.helpers({
  ingredients: function() {
    return Ingredients.find({});
  },
  ingredientActive: function () {
    var ingredient = Template.instance().ingredient.get();
    if (ingredient != null)
    return Ingredients.findOne(ingredient);
  }
});
