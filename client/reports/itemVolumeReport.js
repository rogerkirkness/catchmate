import _ from 'underscore'
import moment from 'moment'
import { Items } from '/imports/collections'
import { Batches } from '/imports/collections'

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
