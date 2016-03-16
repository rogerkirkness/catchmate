Template.customerMaster.onCreated(function () {
  this.customer = new ReactiveVar(null);
  this.subscribe('customers');
});

Template.customerMaster.events({
  'click .edit': function (event) {
    event.preventDefault();
    Template.instance().customer.set(this._id);
  }
});

Template.customerMaster.helpers({
  customers: function() {
    return Customers.find({});
  },
  customerActive: function () {
    var customer = Template.instance().customer.get();
    if(customer != null)
    return Customers.findOne(customer);
  }
});
