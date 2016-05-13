import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Printers } from '/imports/collections'

Template.printerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('printer', null)
  this.subscribe('printers')
})

Template.printerMaster.events({
  'click .edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('printer', this._id)
  }
})

Template.printerMaster.helpers({
  printers() {
    return Printers.find({})
  },
  printerActive() {
    var printer = Template.instance().templateDict.get('printer')
    if (printer != null) {
      return Printers.findOne(printer)
    }
  },
  collection() {
    return Printers
  }
})
