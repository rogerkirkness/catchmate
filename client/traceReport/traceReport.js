import moment from 'moment';

Template.traceReport.onCreated(function () {
  this.batchCode = new ReactiveVar(null);
  this.subscribe('customers');
  this.subscribe('batches');
});

Template.traceReport.events({
  'blur .batchCode': function(event){
    var batchCode = $('.batchCode').val();
    var cBatchCode = moment(batchCode, 'YYYYMMDDHHmmss').toDate();
    Template.instance().batchCode.set(cBatchCode);
  }
});

Template.traceReport.helpers({
  traceBatch: function() {
    var lots = {};
    var batchCode = Template.instance().batchCode.get();
    Batches.find({ createdAt: {$gte: batchCode }}).forEach(function(e) {
      lots[e.createdAt] = e.cust_code;
    });
    var array = [];
    _.each(lots, function(value, key) {
      var rawBatchCode = key;
      var batchCode = moment(rawBatchCode).format('YYYYMMDDHHmmss');
      var rawCustCode = value;
      if(isNaN(rawCustCode)){
      } else {
        var custCode = Customers.findOne({customer_code: rawCustCode}).customer_name;
        array.push({batch_code: batchCode, cust_code: custCode});
      }
    });
    return array;
  }
});