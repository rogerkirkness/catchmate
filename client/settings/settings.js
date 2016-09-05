import { Company } from '/imports/collections'

Template.settings.onCreated(function () {
  this.subscribe('company')
  this.subscribe('users')
})

Template.settings.events({
  'change .companyLogo' (event) {
    let file = event.target.files[0]
    let xhr = new XMLHttpRequest()
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    xhr.open('POST', '/?companyId=' + companyId + '&request=uploadCompanyLogo', true)
    xhr.onload = function (event) {
      window.alert('Upload successful')
    }
    xhr.onerror = function (error) {
      window.alert(error)
    }
    xhr.send(file)
  },
  'change .plantLogo' (event) {
    let file = event.target.files[0]
    let xhr = new XMLHttpRequest()
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    xhr.open('POST', '/files?companyId=' + companyId + '&request=uploadPlantLogo', true)
    xhr.onload = function (event) {
      window.alert('Upload successful')
    }
    xhr.onerror = function (error) {
      window.alert(error)
    }
    xhr.send(file)
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
    return window.location.href + 'files/cl' + companyId + '.jpg?request=clogo&companyId=' + companyId 
  },
  plantlogo() {
    let companyId = Meteor.users.findOne(Meteor.userId()).companyId
    return window.location.href + 'files/pl' + companyId + '.jpg?request=plogo&companyId=' + companyId
  }
})