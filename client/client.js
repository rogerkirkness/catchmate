import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.layout.onCreated(function () {
  this.layoutDict = new ReactiveDict()
  this.layoutDict.set('activePage', 'weigh')
})

Template.layout.events({
  'click .signOut' () {
    Meteor.logout(function (error) {
      if (error) {
        window.alert(error)
      }
    })
  },
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
    var email = document.getElementById('user_signup').value
    var password = document.getElementById('password_signup').value
    var userObject = {
      email: email,
      password: password
    }
    Accounts.createUser(userObject, function (error) {
      if (error) {
        window.alert(error)
      } else {
        var user = email
        Meteor.loginWithPassword(user, password, function (error) {
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
  'click .weighTemplate' () {
    Template.instance().layoutDict.set('activePage', 'weigh')
  },
  'click .customerMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'customerMaster')
  },
  'click .ingredientMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'ingredientMaster')
  },
  'click .itemMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'itemMaster')
  },
  'click .labelMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'labelMaster')
  },
  'click .printerMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'printerMaster')
  },
  'click .scaleMasterTemplate' () {
    Template.instance().layoutDict.set('activePage', 'scaleMaster')
  },
  'click .customerVolumeReportTemplate' () {
    Template.instance().layoutDict.set('activePage', 'customerVolumeReport')
  },
  'click .itemVolumeReportTemplate' () {
    Template.instance().layoutDict.set('activePage', 'itemVolumeReport')
  },
  'click .traceReportTemplate' () {
    Template.instance().layoutDict.set('activePage', 'traceReport')
  },
  'click .settingsTemplate' () {
    Template.instance().layoutDict.set('activePage', 'settings')
  }
})

Template.layout.helpers({
  activePage() {
    var activePage = Template.instance().layoutDict.get('activePage')
    return activePage
  }
})

window.addEventListener('error', function (e) {
  console.log(e.error)
})
