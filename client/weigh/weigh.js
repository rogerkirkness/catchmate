Template.weigh.onCreated(function(){
  this.item = new ReactiveVar(null);
  this.batch = new ReactiveVar(null);
  this.numUnits = new ReactiveVar(null);
  this.cust = new ReactiveVar(null);
  this.validItem = new ReactiveVar(null);
  this.ready = new ReactiveVar(true);
  this.port = new ReactiveVar(null);
  this.host = new ReactiveVar(null);
  this.scale = new ReactiveVar(null);
  this.subscribe('batch');
  this.subscribe('items');
  this.subscribe('customers');
  this.subscribe('ingredients');
  this.subscribe('scales');
  this.subscribe('company');
  this.subscribe('images');
  this.subscribe('plogo');
  this.subscribe('printers');
  this.subscribe('labels');
  this.autorun(function(){
    var port = Template.instance().port.get();
    var host = Template.instance().host.get();
    Meteor.subscribe('update', port, host);
  });
});

var indicatorVar = new ReactiveDict("indicator", 250);
Scale = new Meteor.Collection("scale");
Scale.find({}).observe({
  changed: function(item){
    if (item._id == "weight")
      indicatorVar.set("indicator", item.weight);
  }
});

Template.weigh.events({
  'blur .item_code': function(event) {
    var item = $('.item_code').val();
    Template.instance().validItem.set(item);
  },
  'click .weigh': function (event) {
    var indicator = indicatorVar.get("indicator");
    var item = Template.instance().validItem.get();
    var minWeight = Items.findOne({item_gtin: item}).item_minWeight;
    var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight;
    if (maxWeight < indicator) {
      console.log("Product weighs too much");
    } else if (minWeight > indicator) {
      console.log("Product is underweight");
    } else {
      event.preventDefault();
      Template.instance().ready.set(false);
      Template.instance().item.set($('.item_code').val());
      Template.instance().numUnits.set($('.num_units').val());
      Template.instance().cust.set($('.cust_code').val());
      var created = moment().toDate();
      Template.instance().batch.set(created);
      var item_code = $('.item_code').val();
      var cust_code = $('.cust_code').val();
      var item_weight = $('.item_weight').val();
      var num_units = $('.num_units').val();
      Meteor.call('insertBatch', created, item_code, cust_code, item_weight, num_units);
    }
  },
  'click .print': function(event) {
    var copies = Template.instance().numUnits.get();
    var port = Meteor.user().profile.printerport;
    var host = Meteor.user().profile.printerhost;
    if(port != null){
      var zpl = $('.zpl').val();
      var ip_address = host + ":" + port;
      var url = "http://"+ip_address+"/pstprnt";
      var method = "POST";
      var request = new XMLHttpRequest();
      request.open(method, url, true);
      request.send(zpl);
    }else{
      while (copies > 0) {
        window.print();
        copies = copies - 1;
      };
    }
  },
  'click .undo': function(event) {
    event.preventDefault();
    confirm("Are you sure you want to undo that label?");
    var lastBatch = Template.instance().batch.get();
    Meteor.call('deleteBatch', lastBatch);
  },
  'keyup .profileTare': function (event) {
    event.preventDefault();
    var Tare = $('.profileTare').val();
    Meteor.call('updateTareProfile', Tare);
  },
  'change #selectscale': function (event) {
    event.preventDefault();
    var Scale = $('.scale_name').val();
    var port = Scales.findOne({scale_name: Scale}).scale_port;
    var host = Scales.findOne({scale_name: Scale}).scale_host;
    Template.instance().port.set(port);
    Template.instance().host.set(host);
    Template.instance().scale.set(Scale);
    Meteor.call('updateScaleProfile', Scale, port, host);
  },
  'change #selectprinter': function (event) {
    event.preventDefault();
    var Printer = $('.printer_name').val();
    var port = Printers.findOne({printer_name: Printer}).printer_port;
    var host = Printers.findOne({printer_name: Printer}).printer_host;
    Meteor.call('updatePrinterProfile', Printer, port, host);
  },
  'change #selectlabel': function (event) {
    event.preventDefault();
    var label = $('.label_code').val();
    Meteor.call('updateLabelProfile', label);
  }
});

Template.weigh.helpers({
  indicator: function() {
    var scale = indicatorVar.get("indicator");
    if (scale != null) {
      return scale;
    }
  },
  displayIndicator: function() {
    var indicator = indicatorVar.get("indicator");
    if (indicator != null) {
      var powIndicator = indicator / Math.pow(10, 3);
      var cleanIndicator = numeral(powIndicator).format('0.000');
      return cleanIndicator + " kg";
    } else {
      return "0.000 kg (Disconnected)";
    }
  },
  getStatus: function() {
    var indicator = indicatorVar.get("indicator");
    var item = Template.instance().validItem.get();
    if (item != null && indicator != null) {
      var minWeight = Items.findOne({item_gtin: item}).item_minWeight;
      var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight;
      if (maxWeight < indicator) {
        return 'blue';
      } else if (minWeight > indicator) {
        return 'red';
      } else {
        return 'green';
      }
    }
  },
  statusMessage: function() {
    var indicator = indicatorVar.get("indicator");
    var item = Template.instance().validItem.get();
    if (item != null && indicator != null) {
      var minWeight = Items.findOne({item_gtin: item}).item_minWeight;
      var maxWeight = Items.findOne({item_gtin: item}).item_maxWeight;
      if (maxWeight < indicator) {
        return 'Overweight';
      } else if (minWeight > indicator) {
        return 'Underweight';
      } else {
        return 'In Range';
      }
    }
  },
  hideLabel: function() {
    return Template.instance().ready.get();
  },
  batches: function() {
    return Batches.find({}, {sort: {createdAt: -1}, limit: 1});
  },
  settings: function() {
    return Company.findOne({settings: "company"});
  },
  images: function () {
    return Images.find({});
  },
  plogo: function () {
    return Plogo.find({});
  },
  itemName: function() {
    return Items.findOne({item_gtin: Template.instance().item.get()}).item_name;
  },
  custName: function() {
    var custName = Customers.findOne({customer_code: Template.instance().cust.get()}).customer_name
    if(custName != null){
      return custName;
    }
  },
  shelfLife: function (createdAt) {
    var shelfLife = Items.findOne({item_gtin: Template.instance().item.get()}).item_shelfLife;
    return moment(createdAt).add(shelfLife, 'days').format('DD/MM/YYYY');
  },
  showWeight: function(item_weight) {
    var weight = item_weight / Math.pow(10, 3);
    var cleanWeight = numeral(weight).format('0.000');
    return cleanWeight + " kg";
  },
  netWeight: function(item_weight) {
    var weight = item_weight / Math.pow(10, 3);
    var cleanWeight = numeral(weight).format('0.000');
    var tare = Meteor.user().profile.tare;
    var netWeight = cleanWeight - tare;
    var cleanNetWeight = numeral(netWeight).format('0.000');
    return cleanNetWeight + " kg";
  },
  dateFull: function (createdAt) {
    return moment(createdAt).format('DD/MM/YYYY');
  },
  lotNumber1: function (createdAt) {
    return moment(createdAt).format('YYYYMMDDHHmmss')
  },
  ingredients: function() {
    var itemCode = Template.instance().item.get();
    if (itemCode != null) {
      var ingredientCode = Items.findOne({item_gtin: itemCode}).item_ingredients;
      if (ingredientCode != null) {
        return Ingredients.findOne({ingredients_code: ingredientCode}).ingredients_list;
      }
    }
  },
  codeDate: function (createdAt) {
    return moment(createdAt).format('YYMMDD');
  },
  codeWeight: function(item_weight) {
    var formatWeight = pad(item_weight, 6);
    return formatWeight;
  },
  codeLot: function (createdAt) {
    return moment(createdAt).format('YYYYMMDDHHmmss')
  },
  scales: function() {
    return Scales.find({});
  },
  printers: function() {
    return Printers.find({});
  },
  printerSelected: function() {
    if(this.printer_name === Meteor.user().profile.printer){
      return "selected";
    }
  },
  scaleSelected: function() {
    if(this.scale_name === Template.instance().scale.get()){
      return "selected";
    }
  },
  labelSelected: function() {
    if(this.label_code === Meteor.user().profile.label){
      return "selected";
    }
  },
  labels: function() {
    return Labels.find({});
  },
  itemSettings: function(){
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        token: '',
        collection: Items,
        field: "item_gtin",
        sort: true,
        template: Template.itemDropdown
      }]
    };
  },
  custSettings: function () {
    return {
      position: "bottom",
      limit: 5,
      rules: [{
        token: '',
        collection: Customers,
        field: "customer_code",
        sort: true,
        template: Template.custDropdown
      }]
    };
  },
  url: function(){
    // Prepare various data for barcode
    var settingsPrefix = Company.findOne({settings: "company"}).prefix;
    var itemCode = $('.item_code').val();
    var bcProdDate = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('YYMMDD');
    };
    var bcLotNumber = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('YYYYMMDDHHmmss');
    };
    var bcItemWeight = function(){
      var itemWeight = $('.item_weight').val();
      var formatWeight = pad(itemWeight, 6);
      return formatWeight;
    };

    // If URL contains Catchmate generate barcode using Bwipjs API, otherwise generate it using HTTP API
    if(window.location.href.indexOf("catchmate") > -1){
      var urlapi = "http://api-bwipjs.rhcloud.com/?bcid=gs1-128&text=(01){{settings.prefix}}{{item_code}}(11){{codeDate createdAt}}(3102){{codeWeight item_weight}}(21){{codeLot createdAt}}&parsefnc"
      var url = urlapi.replace("{{settings.prefix}}", settingsPrefix).replace("{{item_code}}", itemCode).replace("{{codeDate createdAt}}", bcProdDate).replace("{{codeWeight item_weight}}", bcItemWeight).replace("{{codeLot createdAt}}", bcLotNumber).replace(/ /g,'');
      return url;
    }else{
      var urlhttp = "http://localhost:8082/?bcid=gs1-128&text=(01){{settings.prefix}}{{item_code}}(11){{codeDate createdAt}}(3102){{codeWeight item_weight}}(21){{codeLot createdAt}}&parsefnc"
      var url = urlhttp.replace("{{settings.prefix}}", settingsPrefix).replace("{{item_code}}", itemCode).replace("{{codeDate createdAt}}", bcProdDate).replace("{{codeWeight item_weight}}", bcItemWeight).replace("{{codeLot createdAt}}", bcLotNumber).replace(/ /g,'');
      return url;
    }
  },
  // Generates ZPL code for Zebra printers on the weigh.html screen into {{zpl}}
  zpl: function(){
    var settingsCompanyName = Company.findOne({settings: "company"}).company_name;
    var settingsStreetOne = Company.findOne({settings: "company"}).street1;
    var settingsStreetTwo = Company.findOne({settings: "company"}).street2;
    var settingsCity = Company.findOne({settings: "company"}).city;
    var settingsProvince = Company.findOne({settings: "company"}).province;
    var settingsCountry = Company.findOne({settings: "company"}).country;
    var settingsPostal = Company.findOne({settings: "company"}).postal;
    var settingsPlantNumber = Company.findOne({settings: "company"}).plant_number;
    var settingsPrefix = Company.findOne({settings: "company"}).prefix;
    var productionDate = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('DD/MM/YYYY');
    };
    var lotNumber = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('YYYYMMDDHHmmss');
    };
    var shelfLife = function(){
      var date = Batches.findOne({}).createdAt;
      var shelfLife = Items.findOne({item_gtin: Template.instance().item.get()}).item_shelfLife;
      return moment(date).add(shelfLife, 'days').format('DD/MM/YYYY');
    };
    var bcProdDate = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('YYMMDD');
    };
    var bcLotNumber = function(){
      var date = Batches.findOne({}).createdAt;
      return moment(date).format('YYYYMMDDHHmmss');
    };
    var grossWeight = function(){
      var itemWeight = $('.item_weight').val();
      var weight = itemWeight / Math.pow(10, 3);
      var cleanWeight = numeral(weight).format('0.00');
      return cleanWeight + " kg";
    };
    var netWeight = function(){
      var itemWeight = $('.item_weight').val();
      var weight = itemWeight / Math.pow(10, 3);
      var cleanWeight = numeral(weight).format('0.00');
      var tare = Meteor.user().profile.tare;
      var netWeight = cleanWeight - tare;
      var cleanNetWeight = numeral(netWeight).format('0.00');
      return cleanNetWeight + " kg";
    };
    var bcItemWeight = function(){
      var itemWeight = $('.item_weight').val();
      var formatWeight = pad(itemWeight, 6);
      return formatWeight;
    };
    var itemName = Items.findOne({item_gtin: Template.instance().item.get()}).item_name;
    var itemCode = $('.item_code').val();
    var custName = Customers.findOne({customer_code: Template.instance().cust.get()}).customer_name;
    var custCode = $('.cust_code').val();
    var ingredientsList = function() {
      var ingredientCode = Items.findOne({item_gtin: Template.instance().item.get()}).item_ingredients;
      return Ingredients.findOne({ingredients_code: ingredientCode}).ingredients_list;
    };
    var layout = Labels.findOne({label_code: Meteor.user().profile.label}).label_layout;
    var zpl = layout.replace("{{settings.company_name}}", settingsCompanyName).replace("{{settings.street1}}", settingsStreetOne).replace("{{settings.street2}}", settingsStreetTwo).replace("{{settings.city}}", settingsCity).replace("{{settings.province}}", settingsProvince).replace("{{settings.country}}", settingsCountry).replace("{{settings.postal}}", settingsPostal).replace("{{settings.plant_number}}", settingsPlantNumber).replace("{{settings.prefix}}", settingsPrefix).replace("{{dateFull createdAt}}", productionDate).replace("{{showWeight item_weight}}", grossWeight).replace("{{netWeight item_weight}}", netWeight).replace("{{itemName}}", itemName).replace("{{item_code}}", itemCode).replace("{{lotNumber1 createdAt}}", lotNumber).replace("{{custName}}", custName).replace("{{cust_code}}", custCode).replace("{{shelfLife createdAt}}", shelfLife).replace("{{ingredients}}", ingredientsList).replace("{{item_code}}", itemCode).replace("{{codeDate createdAt}}", bcProdDate).replace("{{codeWeight item_weight}}", bcItemWeight).replace("{{codeLot createdAt}}", bcLotNumber).replace(/  /g,'');
    return zpl;
  }
});