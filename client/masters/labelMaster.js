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
    var label_code = document.getElementById('label_code').value
    var label_layout = document.getElementById('label_layout').value
    Meteor.call('insertLabel', label_code, label_layout, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editLabel' (event) {
    event.preventDefault()
    var label_code = document.getElementById('label_code_edit').value
    var label_layout = document.getElementById('label_layout_edit').value
    Meteor.call('updateLabel', label_code, label_layout, function(error) {
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
    var label = Template.instance().templateDict.get('label')
    if (label != null) {
      return Labels.findOne(label)
    }
  }
})
