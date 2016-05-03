import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'
import { Customers } from '/imports/collections'

Template.customerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('customer', null)
  this.subscribe('customers')

})

Template.customerMaster.events({
  'click .edit': function (event) {
    event.preventDefault()
    Template.instance().templateDict.set('customer', this._id)
  }
})

Template.customerMaster.helpers({
  customers: function () {
    return Customers.find({})
  },
  customerActive: function () {
    var customer = Template.instance().templateDict.get('customer')
    if (customer != null) {
      return Customers.findOne(customer)
    }
  },
  collection: function() {
    return Customers
  }
})
