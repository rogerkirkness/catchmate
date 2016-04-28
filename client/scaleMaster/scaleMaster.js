Template.scaleMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('scale', null)
  this.subscribe('scales')
})

Template.scaleMaster.events({
  'click .edit': function (event) {
    event.preventDefault()
    Template.instance().templateDict.set('scale', this._id)
  }
})

Template.scaleMaster.helpers({
  scales: function () {
    return Scales.find({})
  },
  scaleActive: function () {
    var scale = Template.instance().templateDict.get('scale')
    if (scale != null) {
      return Scales.findOne(scale)
    }
  }
})
