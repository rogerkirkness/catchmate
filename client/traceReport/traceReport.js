import { Template } from 'meteor/templating'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.traceReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('batchCode', null)
  this.subscribe('batches')
  this.subscribe('customers')
})

Template.traceReport.events({
  'blur .batchCode': function (event) {
    var batchCode = event.target.value
    Template.instance().templateDict.set('batchCode', batchCode)
  }
})

Template.traceReport.helpers({
  traceBatch: function () {
    var batchCode = Number(Template.instance().templateDict.get('batchCode'))
    if (batchCode != null) {
      var input = []
      var searchResults = Batches.find({batch_code: batchCode})
      _.forEach(searchResults.fetch(), function (r) {
        if (input[r.cust_code] == null) {
          input[r.cust_code] = 0
        }
        input[r.cust_code] += r.item_weight * r.num_units
      })
      var output = []
      input.forEach(function (key, value) {
        var amountSold = (key / 1000).toFixed(3)
        var batchCode = Number(Template.instance().templateDict.get('batchCode'))
        var custCode = value
        output.push({batch_code: batchCode, cust_code: custCode, amount_sold: amountSold})
      })
      return output
    }
  }
})
