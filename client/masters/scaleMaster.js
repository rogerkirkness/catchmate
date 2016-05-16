import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Scales } from '/imports/collections'

Template.scaleMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('scale', null)
  this.subscribe('scales')
})

Template.scaleMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('scale', this._id)
  },
  'click #addScale' (event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code').value
    var scale_name = document.getElementById('scale_name').value
    var scale_port = document.getElementById('scale_port').value
    var scale_host = document.getElementById('scale_host').value
    Meteor.call('insertScale', scale_code, scale_name, scale_port, scale_host, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editScale' (event) {
    event.preventDefault()
    var scale_code = document.getElementById('scale_code_edit').value
    var scale_name = document.getElementById('scale_name_edit').value
    var scale_port = document.getElementById('scale_port_edit').value
    var scale_host = document.getElementById('scale_host_edit').value
    Meteor.call('updateScale', scale_code, scale_name, scale_port, scale_host, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.scaleMaster.helpers({
  scales() {
    return Scales.find({})
  },
  scale() {
    var scale = Template.instance().templateDict.get('scale')
    if (scale != null) {
      return Scales.findOne(scale)
    }
  }
})
