import { Company } from '/imports/collections'

Template.settings.onCreated(function () {
  this.subscribe('company')
})

Template.settings.events({
  'change .companyLogo' (event) {
    let file = event.target.files[0]
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/uploadCompanyLogo', true)
    xhr.onload = function (event) {
      window.alert('Upload successful')
      window.location.reload()
    }
    xhr.onerror = function (error) {
      window.alert(error)
    }
    xhr.send(file)
  },
  'change .plantLogo' (event) {
    let file = event.target.files[0]
    let xhr = new XMLHttpRequest()
    xhr.open('POST', '/uploadPlantLogo', true)
    xhr.onload = function (event) {
      window.alert('Upload successful')
      window.location.reload()
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
  settings () {
    return Company.findOne({settings: 'company'})
  },
  companylogo () {
    return 'http://localhost:8083/files/companylogo.jpg'
  },
  plantlogo () {
    return 'http://localhost:8084/files/plantlogo.jpg'
  }
})
