var keystone = require('keystone');

exports = module.exports = function(req, res){
    var view = new keystone.View(req, res);
    var locals = res.locals; //global variables


    // Set locals
    locals.section = 'store';


    // Load Products
    view.query('products', keystone.list('Product').model.find()); //finds all of the products

    //Render View
    view.render('products')

} //We want this to be available outside the file as a function, takes req and response