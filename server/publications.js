Meteor.publish('batch', function(){
  if(this.userId){
    return Batches.find({}, {sort: {createdAt: -1}, limit: 1});
  }
})

Meteor.publish('customers', function(){
  if(this.userId){
    return Customers.find();
  }
});

Meteor.publish('items', function(){
  if(this.userId){
    return Items.find();
  }
});

Meteor.publish('ingredients', function(){
  if(this.userId){
    return Ingredients.find();
  }
});

Meteor.publish('labels', function(){
  if(this.userId){
    return Labels.find();
  }
});

Meteor.publish('scales', function(){
  if(this.userId){
    return Scales.find();
  }
});

Meteor.publish('printers', function(){
  if(this.userId){
    return Printers.find();
  }
});

Meteor.publish('batches', function(){
  if(this.userId){
    return Batches.find();
  }
});

Meteor.publish('company', function(){
  if(this.userId){
    return Company.find();
  }
});

Meteor.publish('images', function(){
  if(this.userId){
    return Images.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
  }
});

Meteor.publish('plogo', function(){
  if(this.userId){
    return Plogo.find({}, { sort: { uploadedAt: -1 }, limit: 1 });
  }
});