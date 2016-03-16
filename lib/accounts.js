// Logout hook
var myPostLogout = function(){
  FlowRouter.go('/sign-in');
};

// Accounts settings
AccountsTemplates.configure({
  defaultLayout: 'layout',
  defaultLayoutRegions: {
      header: 'header',
      footer: 'footer'
  },
  defaultContentRegion: 'content',
  onLogoutHook: myPostLogout
});

// Accounts routes
AccountsTemplates.configureRoute('signIn');
AccountsTemplates.configureRoute('signUp');