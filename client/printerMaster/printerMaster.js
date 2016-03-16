Template.printerMaster.onCreated(function () {
  this.printer = new ReactiveVar(null);
  this.subscribe('printers');
});

Template.printerMaster.events({
  'click .edit': function (event) {
    event.preventDefault();
    Template.instance().printer.set(this._id);
  }
});

Template.printerMaster.helpers({
  printers: function() {
    return Printers.find({});
  },
  printerActive: function() {
    var printer= Template.instance().printer.get();
    if (printer != null)
    return Printers.findOne(printer);
  }
});