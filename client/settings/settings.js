Template.settings.onCreated(function () {
  this.subscribe('company')
  this.subscribe('users')
  this.subscribe('images')
})

Template.settings.events({
  'change .companyLogo' (event) {
    var clogo = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertClogo', e.target.result)
    }
    reader.readAsDataURL(clogo)
  },
  'change .plantLogo' (event) {
    var plogo = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertPlogo', e.target.result)
    }
    reader.readAsDataURL(plogo)
  },
  'click .save_settings' (event) {
    event.preventDefault()
    var companyName = document.getElementById('companyName').value
    var plantNumber = document.getElementById('plantNumber').value
    var Street1 = document.getElementById('profile_street1').value
    var Street2 = document.getElementById('profile_street2').value
    var City = document.getElementById('profile_city').value
    var Province = document.getElementById('profile_province').value
    var Country = document.getElementById('profile_country').value
    var Postal = document.getElementById('profile_postal').value
    var Prefix = document.getElementById('profile_prefix').value
    Meteor.call('upsertSettings', companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click .delete_clogo' (event) {
    event.preventDefault()
    Meteor.call('deleteClogo', function(error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click .delete_plogo' (event) {
    event.preventDefault()
    Meteor.call('deletePlogo', function(error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.settings.helpers({
  settings() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId})
  },
  companyId() {
    return Meteor.users.findOne(Meteor.userId()).companyId
  },
  companylogo() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).clogo
  },
  plantlogo() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).plogo
  }
})