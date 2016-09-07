import { Company } from '/imports/collections'

Template.settings.onCreated(function () {
  this.subscribe('company')
  this.subscribe('users')
  this.subscribe('images')
})

Template.settings.events({
  'change .companyLogo' (event) {
    let clogo = event.target.files[0]
    let reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertClogo', e.target.result)
    }
    reader.readAsDataURL(clogo)
  },
  'change .plantLogo' (event) {
    let plogo = event.target.files[0]
    let reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertPlogo', e.target.result)
    }
    reader.readAsDataURL(plogo)
  },
  'click .save_settings' (event) {
    event.preventDefault()
    let companyName = document.getElementById('companyName').value
    let plantNumber = document.getElementById('plantNumber').value
    let Street1 = document.getElementById('profile_street1').value
    let Street2 = document.getElementById('profile_street2').value
    let City = document.getElementById('profile_city').value
    let Province = document.getElementById('profile_province').value
    let Country = document.getElementById('profile_country').value
    let Postal = document.getElementById('profile_postal').value
    let Prefix = document.getElementById('profile_prefix').value
    Meteor.call('upsertSettings', companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix, function (error) {
      if (error) {
        window.alert(error)
      }
    })
  }
})

Template.settings.helpers({
  settings() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId})
  },
  companyId() {
    return Meteor.users.findOne(Meteor.userId()).companyId
  },
  companylogo() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).clogo
  },
  plantlogo() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return Company.findOne({settings: companyId}).plogo
  }
})