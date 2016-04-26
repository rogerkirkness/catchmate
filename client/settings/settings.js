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
    var companyName = document.getElementById("companyName").value;
    var plantNumber = document.getElementById("plantNumber").value;
    var Street1 = document.getElementById("profile_street1").value;
    var Street2 = document.getElementById("profile_street2").value;
    var City = document.getElementById("profile_city").value;
    var Province = document.getElementById("profile_province").value;
    var Country = document.getElementById("profile_country").value;
    var Postal = document.getElementById("profile_postal").value;
    var Prefix = document.getElementById("profile_prefix").value;
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