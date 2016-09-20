import _ from 'underscore'
import { Batches } from '/imports/collections'

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
