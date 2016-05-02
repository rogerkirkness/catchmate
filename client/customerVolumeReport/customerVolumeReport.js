import moment from 'moment'
import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.customerVolumeReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('fromDate', null)
  this.templateDict.set('toDate', null)
  this.subscribe('customers')
  this.subscribe('batches')
})

Template.customerVolumeReport.events({
  'blur .fromDate': function (event) {
    event.preventDefault()
    var fromDateRaw = event.target.value
    var from = moment(fromDateRaw, 'YYYY-MM-DD').toDate()
    Template.instance().templateDict.set('fromDate', from)
  },
  'blur .toDate': function (event) {
    event.preventDefault()
    var toDateRaw = event.target.value
    var to = moment(toDateRaw, 'YYYY-MM-DD').endOf('day').toDate()
    Template.instance().templateDict.set('toDate', to)
  }
})

Template.customerVolumeReport.helpers({
  custBatches: function () {
    var items = {}
    var fDate = Template.instance().templateDict.get('fromDate')
    var tDate = Template.instance().templateDict.get('toDate')
    Batches.find({ $and: [ { createdAt: { $gte: fDate } }, { createdAt: { $lte: tDate } } ] }).forEach(function (e) {
      if (items[e.cust_code] == null) {
        items[e.cust_code] = 0
      }
      items[e.cust_code] += e.item_weight * e.num_units
    })
    var results = []
    _.each(items, function (value, key) {
      var displayValue = (value / 1000).toFixed(3)
      var name = Customers.findOne({customer_code: key}).customer_name
      results.push({cust_code: key, customer_name: name, item_weight: displayValue})
    })
    return results
  }
})
