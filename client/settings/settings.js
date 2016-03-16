Template.settings.onCreated(function () {
  var self = this;
  self.autorun(function(){
    self.subscribe('images');
  });
  self.autorun(function(){
    self.subscribe('plogo');
  });
  self.subscribe('company');
});

Template.settings.events({
  'change .companyLogo': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      Images.insert(file, function (err, fileObj) {
        if (error) {
          alert("Upload failed... please try again.");
        } else {
          alert('Upload succeeded!');
        }
      });
    });
  },
  'change .plantLogo': function (event, template) {
    FS.Utility.eachFile(event, function (file) {
      Plogo.insert(file, function (err, fileObj) {
        if (error) {
          alert("Upload failed... please try again.");
        } else {
          alert('Upload succeeded!');
        }
      });
    });
  },
  'click .save_settings': function (event) {
    event.preventDefault();
    var companyName = $('.companyName').val();
    var plantNumber = $('.plantNumber').val();
    var Street1 = $('.profile_street1').val();
    var Street2 = $('.profile_street2').val();
    var City = $('.profile_city').val();
    var Province = $('.profile_province').val();
    var Country = $('.profile_country').val();
    var Postal = $('.profile_postal').val();
    var Prefix = $('.profile_prefix').val();
    Meteor.call('upsertSettings', companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix);
  }
});

Template.settings.helpers({
  images: function () {
    return Images.find({}, {sort: {uploadedAt: -1}, limit: 1});
  },
  plogo: function() {
    return Plogo.find({}, {sort: {uploadedAt: -1}, limit: 1});
  },
  settings: function() {
    return Company.findOne({settings: "company"});
  }
});