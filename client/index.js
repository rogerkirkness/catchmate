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
    let user = document.getElementById('user').value
    let password = document.getElementById('password').value
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
    let email = document.getElementById('user_signup').value
    let password = document.getElementById('password_signup').value
    let userObject = {
      email: email,
      password: password
    }
    Accounts.createUser(userObject, function (error) {
      if (error) {
        window.alert(error)
      } else {
        let user = email
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
    let activePage = event.target.id
    Template.instance().layoutDict.set('activePage', activePage)
  }
})

Template.body.helpers({
  activePage () {
    let activePage = Template.instance().layoutDict.get('activePage')
    return activePage
  }
})

window.addEventListener('error', function (e) {
  console.log(e.error)
})
