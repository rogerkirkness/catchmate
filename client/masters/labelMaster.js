import { Labels } from '/imports/collections'

Template.labelMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('label', null)
  this.subscribe('labels')
})

Template.labelMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('label', this._id)
  },
  'click #addLabel' (event) {
    event.preventDefault()
    let label_code = document.getElementById('label_code').value
    let label_layout = document.getElementById('label_layout').value
    Meteor.call('insertLabel', label_code, label_layout, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editLabel' (event) {
    event.preventDefault()
    let label_code = document.getElementById('label_code_edit').value
    let label_layout = document.getElementById('label_layout_edit').value
    Meteor.call('updateLabel', label_code, label_layout, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.labelMaster.helpers({
  labels () {
    return Labels.find({})
  },
  label () {
    let label = Template.instance().templateDict.get('label')
    if (label != null) {
      return Labels.findOne(label)
    }
  }
})
