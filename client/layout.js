import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.layout.onCreated(function () {
  this.layoutDict = new ReactiveDict()
  this.layoutDict.set('activePage', 'signIn')
})

Template.layout.events({
  'click .signOut': function () {
    Meteor.logout(function (error) {
      if (error) {
        console.log(error)
      }
    })
  },
  'click .signIn': function () {
    var user = document.getElementById('user').value
    var password = document.getElementById('password').value
    Meteor.loginWithPassword(user, password, function (error) {
      if (error) {
        console.log(error)
      }
    })
    Template.instance().layoutDict.set('activePage', 'weigh')
  },
  'click .signUp': function () {
    var email = document.getElementById('user_signup').value
    var password = document.getElementById('password_signup').value
    var userObject = {
      email: email,
      password: password
    }
    Accounts.createUser(userObject, function (error) {
      if (error) {
        console.log(error)
      } else {
        var user = email
        Meteor.loginWithPassword(user, password, function (error) {
          if (error) {
            console.log(error)
          }
        })
        Template.instance().layoutDict.set('activePage', 'weigh')
      }
    })
  },
  'click .weighTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'weigh')
  },
  'click .customerMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'customerMaster')
  },
  'click .ingredientMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'ingredientMaster')
  },
  'click .itemMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'itemMaster')
  },
  'click .labelMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'labelMaster')
  },
  'click .printerMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'printerMaster')
  },
  'click .scaleMasterTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'scaleMaster')
  },
  'click .customerVolumeReportTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'customerVolumeReport')
  },
  'click .itemVolumeReportTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'itemVolumeReport')
  },
  'click .traceReportTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'traceReport')
  },
  'click .settingsTemplate': function () {
    Template.instance().layoutDict.set('activePage', 'settings')
  }
})

Template.layout.helpers({
  activePage: function () {
    var activePage = Template.instance().layoutDict.get('activePage')
    return activePage
  }
})
