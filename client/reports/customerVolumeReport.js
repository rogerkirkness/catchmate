import _ from 'underscore'
import moment from 'moment'
import { Customers } from '/imports/collections'
import { Batches } from '/imports/collections'

Template.customerVolumeReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('fromDate', null)
  this.templateDict.set('toDate', null)
  this.subscribe('customers')
  this.subscribe('batches')
})

Template.customerVolumeReport.events({
  'click .updateReport' (event) {
    let fromDateRaw = document.getElementById('fromDate').value
    let toDateRaw = document.getElementById('toDate').value
    let from = moment(fromDateRaw, 'YYYY-MM-DD').toDate()
    let to = moment(toDateRaw, 'YYYY-MM-DD').endOf('day').toDate()
    Template.instance().templateDict.set('fromDate', from)
    Template.instance().templateDict.set('toDate', to)
  }
})

Template.customerVolumeReport.helpers({
  custBatches () {
    let items = {}
    let fDate = Template.instance().templateDict.get('fromDate')
    let tDate = Template.instance().templateDict.get('toDate')
    Batches.find({ $and: [ { createdAt: { $gte: fDate } }, { createdAt: { $lte: tDate } } ] }).forEach(function (e) {
      if (items[e.cust_code] == null) {
        items[e.cust_code] = 0
      }
      items[e.cust_code] += e.item_weight * e.num_units
    })
    let results = []
    _.forEach(items, function (value, key) {
      let displayValue = (value / 1000).toFixed(3)
      let name = Customers.findOne({customer_code: key}).customer_name
      results.push({cust_code: key, customer_name: name, item_weight: displayValue})
    })
    if (results != null) {
      return results
    }
  }
})
