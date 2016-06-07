import _ from 'underscore'
import { Batches } from '/imports/collections'

Template.traceReport.onCreated(function () {
  this.templateDict = new ReactiveDict()
  this.templateDict.set('batchCode', null)
  this.subscribe('batches')
})

Template.traceReport.events({
  'click .updateReport' (event) {
    let batchCode = document.getElementById('batchCode').value
    Template.instance().templateDict.set('batchCode', batchCode)
  }
})

Template.traceReport.helpers({
  traceBatch () {
    let batchCode = Number(Template.instance().templateDict.get('batchCode'))
    if (batchCode != null) {
      let input = []
      let searchResults = Batches.find({batch_code: batchCode})
      _.forEach(searchResults.fetch(), function (r) {
        if (input[r.cust_code] == null) {
          input[r.cust_code] = 0
        }
        input[r.cust_code] += r.item_weight * r.num_units
      })
      let output = []
      input.forEach(function (key, value) {
        let amountSold = (key / 1000).toFixed(3)
        let batchCode = Number(Template.instance().templateDict.get('batchCode'))
        let custCode = value
        output.push({batch_code: batchCode, cust_code: custCode, amount_sold: amountSold})
      })
      if (output != null) {
        return output
      }
    }
  }
})
