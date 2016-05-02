import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.printerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('printer', null)
  this.subscribe('printers')
})

Template.printerMaster.events({
  'click .edit': function (event) {
    event.preventDefault()
    Template.instance().templateDict.set('printer', this._id)
  }
})

Template.printerMaster.helpers({
  printers: function () {
    return Printers.find({})
  },
  printerActive: function () {
    var printer = Template.instance().templateDict.get('printer')
    if (printer != null) {
      return Printers.findOne(printer)
    }
  }
})
