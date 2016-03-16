Template.scaleMaster.onCreated(function () {
  this.scale = new ReactiveVar(null);
  this.subscribe('scales');
});

Template.scaleMaster.events({
  'click .edit': function (event) {
    event.preventDefault();
    Template.instance().scale.set(this._id);
  }
});

Template.scaleMaster.helpers({
  scales: function() {
    return Scales.find({});
  },
  scaleActive: function() {
    var scale = Template.instance().scale.get();
    if (scale != null)
    return Scales.findOne(scale);
  }
});