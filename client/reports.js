import _ from 'underscore'
import moment from 'moment'

//
// Customer Volume Report
//

Template.customerVolumeReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('fromDate', null)
  this.templateDict.set('toDate', null)
  this.subscribe('customers')
  this.subscribe('batches')
})

Template.customerVolumeReport.events({
  'click .updateReport' (event) {
    var fromDateRaw = document.getElementById('fromDate').value
    var toDateRaw = document.getElementById('toDate').value
    var from = moment(fromDateRaw, 'YYYY-MM-DD').toDate()
    var to = moment(toDateRaw, 'YYYY-MM-DD').endOf('day').toDate()
    Template.instance().templateDict.set('fromDate', from)
    Template.instance().templateDict.set('toDate', to)
  }
})

Template.customerVolumeReport.helpers({
  custBatches () {
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
    _.forEach(items, function (value, key) {
      var displayValue = (value / 1000).toFixed(3)
      var name = Customers.findOne({customer_code: key}).customer_name
      results.push({cust_code: key, customer_name: name, item_weight: displayValue})
    })
    if (results != null) {
      return results
    }
  }
})

//
// Item Volume Report
//

Template.itemVolumeReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('fromDate', null)
  this.templateDict.set('toDate', null)
  this.subscribe('items')
  this.subscribe('batches')
})

Template.itemVolumeReport.events({
  'click .updateReport' (event) {
    var fromDateRaw = document.getElementById('fromDate').value
    var toDateRaw = document.getElementById('toDate').value
    var from = moment(fromDateRaw, 'YYYY-MM-DD').toDate()
    var to = moment(toDateRaw, 'YYYY-MM-DD').endOf('day').toDate()
    Template.instance().templateDict.set('fromDate', from)
    Template.instance().templateDict.set('toDate', to)
  }
})

Template.itemVolumeReport.helpers({
  itemBatches () {
    var items = {}
    var fDate = Template.instance().templateDict.get('fromDate')
    var tDate = Template.instance().templateDict.get('toDate')
    Batches.find({ $and: [ { createdAt: { $gte: fDate } }, { createdAt: { $lte: tDate } } ] }).forEach(function (e) {
      if (items[e.item_code] == null) {
        items[e.item_code] = 0
      }
      items[e.item_code] += e.item_weight * e.num_units
    })
    var results = []
    _.forEach(items, function (value, key) {
      var displayValue = (value / 1000).toFixed(3)
      var name = Items.findOne({item_code: key}).item_name
      results.push({item_code: key, item_name: name, item_weight: displayValue})
    })
    if (results != null) {
      return results
    }
  }
})

// 
// Trace Report
//

Template.traceReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('batchCode', null)
  this.subscribe('batches')
})

Template.traceReport.events({
  'click .updateReport'(event) {
    var batchCode = document.getElementById('batchCode').value
    Template.instance().templateDict.set('batchCode', batchCode)
  }
})

Template.traceReport.helpers({
  traceBatch() {
    var batchCode = Template.instance().templateDict.get('batchCode')
    if (batchCode != null) {
      var input = {}
      var searchResults = Batches.find({ batch_code: batchCode })
      _.forEach(searchResults.fetch(), function (result) {
        if (input[result.cust_code] == null) {
          input[result.cust_code] = 0
        }
        input[result.cust_code] += result.item_weight * result.num_units
      })
      var output = []
      _.forEach(input, function (key, value) {
        var amountSold = (key / 1000).toFixed(3)
        var batchCode = Template.instance().templateDict.get('batchCode')
        var custCode = value
        output.push({ batch_code: batchCode, cust_code: custCode, amount_sold: amountSold })
      })
      if (output != null) {
        return output
      }
    }
  }
})
