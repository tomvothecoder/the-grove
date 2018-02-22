var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals; //global variables


    // Set locals
    locals.section = 'store';

    //set to an object, request the parameters of the product
    locals.filters = {
        product:req.params.product
    }

    //An empty array that sets to an object whichis the empty array
    locals.data = {
        products:[]
    }

    // Load Products
  view.on('init', function(next){
      //QUERY
      var q = keystone.list('Product').model.findOne({
      slug: locals.filters.product
      });

      //Execute the query, the product would equal the result of the query
  q.exec(function (err, result){
      locals.data.product = result;
      next(err);
  });

});
    //Render View
    view.render('product')

} //We want this to be available outside the file as a function, takes req and response