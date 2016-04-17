// Define routes
FlowRouter.route('/', {
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "weigh",
      footer: "footer"
    });
  }
});

FlowRouter.route('/weigh', {
  name: 'weigh',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "weigh",
      footer: "footer"
    });
  }
});

FlowRouter.route('/itemMaster', {
  name: 'itemMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "itemMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/customerMaster', {
  name: 'customerMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "customerMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/ingredientMaster', {
  name: 'ingredientMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "ingredientMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/labelMaster', {
  name: 'labelMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "labelMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/scaleMaster', {
  name: 'scaleMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "scaleMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/printerMaster', {
  name: 'printerMaster',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "printerMaster",
      footer: "footer"
    });
  }
});

FlowRouter.route('/report', {
  name: 'report',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "report",
      footer: "footer"
    });
  }
});

FlowRouter.route('/cvReport', {
  name: 'cvReport',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "cvReport",
      footer: "footer"
    });
  }
});

FlowRouter.route('/traceReport', {
  name: 'traceReport',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "traceReport",
      footer: "footer"
    });
  }
});

FlowRouter.route('/settings', {
  name: 'settings',
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "settings",
      footer: "footer"
    });
  }
});

FlowRouter.notFound = {
  action: function() {
    BlazeLayout.render("layout", {
      header: "header",
      content: "notFound",
      footer: "footer"
    });
  }
};

// Route security
FlowRouter.triggers.enter([AccountsTemplates.ensureSignedIn]);