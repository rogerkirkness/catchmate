import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Scales } from '/imports/collections'

Template.scaleMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('scale', null)
  this.subscribe('scales')
})

Template.scaleMaster.events({
  'click .edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('scale', this._id)
  }
})

Template.scaleMaster.helpers({
  scales() {
    return Scales.find({})
  },
  scaleActive() {
    var scale = Template.instance().templateDict.get('scale')
    if (scale != null) {
      return Scales.findOne(scale)
    }
  },
  collection() {
    return Scales
  }
})
