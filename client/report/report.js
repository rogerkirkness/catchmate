Template.report.onCreated(function () {
  this.fromDate = new ReactiveVar(0);
  this.toDate = new ReactiveVar(0);
  this.subscribe('items');
  this.subscribe('batches');
});

Template.report.events({
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

Template.report.helpers({
  itemBatches: function() {
    var items = {};
    var fDate = Template.instance().fromDate.get();
    var tDate = Template.instance().toDate.get();
    Batches.find({ $and: [{ createdAt: {$gte: fDate }}, { createdAt: {$lte: tDate }}]}).forEach(function(e) {
      if (items[e.item_code] == null)
      items[e.item_code] = 0;
      items[e.item_code] += e.item_weight * e.num_units;
    });
    var results = [];
    _.each(items, function(value, key) {
      var pValue = value / Math.pow(10, 3);
      var fValue = numeral(pValue).format('0.000');
      var rValue = Math.round(fValue);
      var name = Items.findOne({item_gtin: key}).item_name;
      results.push({item_code: key, item_name: name, item_weight: rValue});
    });
    return results;
  }
});