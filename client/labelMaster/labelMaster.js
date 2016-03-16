Template.labelMaster.onCreated(function () {
  this.label = new ReactiveVar(null);
  this.subscribe('labels');
});

Template.labelMaster.events({
  'click .edit': function (event) {
    event.preventDefault();
    Template.instance().label.set(this._id);
  },
});

Template.labelMaster.helpers({
  labels: function() {
    return Labels.find({});
  },
  labelActive: function () {
    var label = Template.instance().label.get();
    if (label != null)
    return Labels.findOne(label);
  }
});
