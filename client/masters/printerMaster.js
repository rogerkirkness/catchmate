import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Printers } from '/imports/collections'

Template.printerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('printer', null)
  this.subscribe('printers')
})

Template.printerMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('printer', this._id)
  },
  'click #addPrinter' (event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code').value
    var printer_name = document.getElementById('printer_name').value
    var printer_port = document.getElementById('printer_port').value
    var printer_host = document.getElementById('printer_host').value
    Meteor.call('insertPrinter', printer_code, printer_name, printer_port, printer_host, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editPrinter' (event) {
    event.preventDefault()
    var printer_code = document.getElementById('printer_code_edit').value
    var printer_name = document.getElementById('printer_name_edit').value
    var printer_port = document.getElementById('printer_port_edit').value
    var printer_host = document.getElementById('printer_host_edit').value
    Meteor.call('updatePrinter', printer_code, printer_name, printer_port, printer_host, (error) => {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.printerMaster.helpers({
  printers() {
    return Printers.find({})
  },
  printer() {
    var printer = Template.instance().templateDict.get('printer')
    if (printer != null) {
      return Printers.findOne(printer)
    }
  }
})
