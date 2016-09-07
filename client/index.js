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
    let userObject = {
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

window.addEventListener('error', function (e) {
  console.log(e.error)
})