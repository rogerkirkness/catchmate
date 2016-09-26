Template.customerMaster.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('customer', null)
  this.subscribe('customers')
})

Template.customerMaster.events({
  'click #edit' (event) {
    event.preventDefault()
    Template.instance().templateDict.set('customer', this._id)
  },
  'click #addCustomer' (event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code').value
    var customer_name = document.getElementById('customer_name').value
    var customer_street1 = document.getElementById('customer_street1').value
    var customer_street2 = document.getElementById('customer_street2').value
    var customer_city = document.getElementById('customer_city').value
    var customer_province = document.getElementById('customer_province').value
    var customer_country = document.getElementById('customer_country').value
    var customer_postal = document.getElementById('customer_postal').value
    Meteor.call('insertCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click #editCustomer' (event) {
    event.preventDefault()
    var customer_code = document.getElementById('customer_code_edit').value
    var customer_name = document.getElementById('customer_name_edit').value
    var customer_street1 = document.getElementById('customer_street1_edit').value
    var customer_street2 = document.getElementById('customer_street2_edit').value
    var customer_city = document.getElementById('customer_city_edit').value
    var customer_province = document.getElementById('customer_province_edit').value
    var customer_country = document.getElementById('customer_country_edit').value
    var customer_postal = document.getElementById('customer_postal_edit').value
    Meteor.call('updateCustomer', customer_code, customer_name, customer_street1, customer_street2, customer_city, customer_province, customer_country, customer_postal, function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.customerMaster.helpers({
  customers() {
    return Customers.find({})
  },
  customer() {
    var customer = Template.instance().templateDict.get('customer')
    if (customer != null) {
      return Customers.findOne(customer)
    }
  }
})
