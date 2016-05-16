import { Meteor } from 'meteor/meteor'
import { Template } from 'meteor/templating'
import { Accounts } from 'meteor/accounts-base'
import { ReactiveDict } from 'meteor/reactive-dict'

Template.body.onCreated(function () {
  this.layoutDict = new ReactiveDict()
  this.layoutDict.set('activePage', 'weigh')
})

Template.body.events({
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
  'click .link' (event) {
    var activePage = event.target.id
    Template.instance().layoutDict.set('activePage', activePage)
  }
})

Template.body.helpers({
  activePage() {
    var activePage = Template.instance().layoutDict.get('activePage')
    return activePage
  }
})

window.addEventListener('error', function (e) {
  console.log(e.error)
})
