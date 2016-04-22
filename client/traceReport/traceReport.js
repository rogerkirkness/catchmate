import moment from 'moment';

Template.traceReport.onCreated(function () {
  this.batchCode = new ReactiveVar(null);
  this.serialCode = new ReactiveVar(null);
  this.subscribe('batches');
  this.subscribe('customers');
});

Template.traceReport.events({
  'blur .batchCode': function(event){
    var batchCode = $('.batchCode').val();
    Template.instance().batchCode.set(batchCode);
  }
});

Template.traceReport.helpers({
  traceBatch: function() {
    var batchCode = Number(Template.instance().batchCode.get());
    if(batchCode != null){
      var input = {};
      var searchResults = Batches.find({batch_code: batchCode});
      _.forEach(searchResults.fetch(), function(r){
        if(input[r.cust_code] == null)
        input[r.cust_code] = 0;
        input[r.cust_code] += r.item_weight * r.num_units;
      });
      var output = [];
      _.forEach(input, function(key, value){
        var batchCode = Number(Template.instance().batchCode.get());
        var custCode = value;
        var amountSold = key;
        var adjAmountSold = amountSold / Math.pow(10, 3);
        output.push({batch_code: batchCode, cust_code: custCode, amount_sold: adjAmountSold});
      });
      return output;
    }
  }
});