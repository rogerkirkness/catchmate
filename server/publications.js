//Label publication
Meteor.publish('batch', function(){
  if(this.userId){
    return Batches.find({}, {sort: {createdAt: -1}, limit: 1});
  }
})

//Customer Master publication
Meteor.publish('customers', function(){
  if(this.userId){
    return Customers.find();
  }
});

//Item Master publication
Meteor.publish('items', function(){
  if(this.userId){
    return Items.find();
  }
});

//Ingredients Master publication
Meteor.publish('ingredients', function(){
  if(this.userId){
    return Ingredients.find();
  }
});

//Labels Master publication
Meteor.publish('labels', function(){
  if(this.userId){
    return Labels.find();
  }
});

//Scales Master publication
Meteor.publish('scales', function(){
  if(this.userId){
    return Scales.find();
  }
});

//Printers Master publication
Meteor.publish('printers', function(){
  if(this.userId){
    return Printers.find();
  }
});

//Batch reports publication
Meteor.publish('batches', function(){
  if(this.userId){
    return Batches.find();
  }
});

//Settings publication
Meteor.publish('company', function(){
  if(this.userId){
    return Company.find();
  }
});

//Images publication
Meteor.publish('images', function(){
  if(this.userId){
    return Images.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
  }
});

// Plogo publication
Meteor.publish('plogo', function(){
  if(this.userId){
    return Plogo.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
  }
});