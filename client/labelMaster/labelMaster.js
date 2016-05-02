import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.labelMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('label', null)
  this.subscribe('labels')
})

Template.labelMaster.events({
  'click .edit': function (event) {
    event.preventDefault()
    Template.instance().templateDict.set('label', this._id)
  }
})

Template.labelMaster.helpers({
  labels: function () {
    return Labels.find({})
  },
  labelActive: function () {
    var label = Template.instance().templateDict.get('label')
    if (label != null) {
      return Labels.findOne(label)
    }
  }
})
