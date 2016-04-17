Template.cvReport.onCreated(function () {
  this.fromDate = new ReactiveVar(0);
  this.toDate = new ReactiveVar(0);
  this.subscribe('customers');
  this.subscribe('batches');
});

Template.cvReport.events({
  'blur .fromDate': function(event) {
    var fromDateRaw = $('.fromDate').val();
    var from = moment(fromDateRaw, 'YYYY-MM-DD').toDate();
    Template.instance().fromDate.set(from);
  },
  'blur .toDate': function(event) {
    var toDateRaw = $('.toDate').val()
    var to = moment(toDateRaw, 'YYYY-MM-DD').endOf("day").toDate();
    Template.instance().toDate.set(to);
  }
});

Template.cvReport.helpers({
  custBatches: function() {
    var items = {};
    var fDate = Template.instance().fromDate.get();
    var tDate = Template.instance().toDate.get();
    Batches.find({ $and: [{ createdAt: {$gte: fDate }}, { createdAt: {$lte: tDate }}]}).forEach(function(e) {
      if (items[e.cust_code] == null)
      items[e.cust_code] = 0;
      items[e.cust_code] += e.item_weight * e.num_units;
    });
    var results = [];
    _.each(items, function(value, key) {
      var pValue = value / Math.pow(10, 3);
      var fValue = numeral(pValue).format('0.000');
      var rValue = Math.round(fValue);
      var name = Customers.findOne({customer_code: key}).customer_name;
      results.push({cust_code: key, customer_name: name, item_weight: rValue});
    });
    return results;
  }
});