import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'

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
  },
  'click .signUp': function () {
    var email = document.getElementById('user_signup').value
    var password = document.getElementById('password_signup').value
    var userObject = {
      email: email,
      password: password
    };
    Accounts.createUser(userObject, function(error) {
      if (error) {
        console.log(error)
      } else {
        var user = email
        Meteor.loginWithPassword(user, password, function (error) {
          if (error) {
            console.log(error)
          }
        })
      }
    })
  }
})
