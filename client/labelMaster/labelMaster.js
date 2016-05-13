import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Labels } from '/imports/collections'

Template.labelMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('label', null)
  this.subscribe('labels')
})

Template.labelMaster.events({
  'click .edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('label', this._id)
  }
})

Template.labelMaster.helpers({
  labels() {
    return Labels.find({})
  },
  labelActive() {
    var label = Template.instance().templateDict.get('label')
    if (label != null) {
      return Labels.findOne(label)
    }
  },
  collection() {
    return Labels
  }
})
