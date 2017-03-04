//
// Body 
//

Template.body.onCreated(function () {
  this.layoutDict = new ReactiveDict()
  this.layoutDict.set('activePage', 'weigh')
})

Template.body.events({
  'click .signIn' () {
    var user = document.getElementById('user').value
    var password = document.getElementById('password').value
    Meteor.loginWithPassword(user, password, function (error) {
      if (error) {
        window.alert(error)
      }
    })
    if (Meteor.user() != null) {
      Template.instance().layoutDict.set('activePage', 'weigh')
    }
  },
  'click .signUp' () {
    var userObject = {
      email: document.getElementById('user_signup').value,
      password: document.getElementById('password_signup').value,
      companyId: document.getElementById('companyId').value
    }
    Accounts.createUser(userObject, function (error) {
      if (error) {
        window.alert(error)
      } else {
        Meteor.loginWithPassword(email, password, function (error) {
          if (error) {
            window.alert(error)
          }
        })
        if (Meteor.user() != null) {
          Template.instance().layoutDict.set('activePage', 'weigh')
        }
      }
    })
  },
  'click .link' (event) {
    Template.instance().layoutDict.set('activePage', event.target.id)
  }
})

Template.body.helpers({
  activePage () {
    return Template.instance().layoutDict.get('activePage')
  }
})


//
// Settings 
//

Template.settings.onCreated(function () {
  this.subscribe('company')
  this.subscribe('users')
  this.subscribe('images')
  this.subscribe('prices')
})

Template.settings.events({
  'change .companyLogo' (event) {
    var clogo = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertClogo', e.target.result, function(error) {
        if (error) {
          window.alert(error)
        }
      })
    }
    reader.readAsDataURL(clogo)
  },
  'change .plantLogo' (event) {
    var plogo = event.target.files[0]
    var reader = new FileReader()
    reader.onload = function(e){
      Meteor.call('upsertPlogo', e.target.result, function(error) {
        if (error) {
          window.alert(error)
        }
      })
    }
    reader.readAsDataURL(plogo)
  },
  'input .form-control' (event) {
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
    var priceList = document.getElementById('selectPriceList').value
    Meteor.call('upsertSettings', companyName, plantNumber, Street1, Street2, City, Province, Country, Postal, Prefix, priceList, function (error) {
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
  },
  'click .signOut' () {
    Meteor.logout(function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
  'click .importSQL' () {
    event.preventDefault()
    Meteor.call('importSQL', function(error){
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
  },
  priceLists() {
    return Prices.find({})
  },
  selectedPriceList() {
    var companyId = Meteor.users.findOne(Meteor.userId()).companyId
    var priceList = Company.findOne({settings: companyId}).priceList
    if (this.price_code === priceList) {
      return 'selected'
    }
  }
})