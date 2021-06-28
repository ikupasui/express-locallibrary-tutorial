var BookInstance = require('../models/bookinstance');
const { body, validationResult } = require('express-validator');
var Book = require('../models/book');
var async = require('async');

// Display list of all BookInstances.
exports.bookinstance_list = function (req, res, next) {

  BookInstance.find()
    .populate('book')
    .exec(function (err, list_bookinstances) {
      if (err) { return next(err); }
      // Successful, so render
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });

};

// Display detail page for a specific BookInstance.
exports.bookinstance_detail = function (req, res, next) {

  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      if (bookinstance == null) { // No results.
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
    })

};

// Display BookInstance create form on GET.
exports.bookinstance_create_get = function (req, res, next) {

  Book.find({}, 'title')
    .exec(function (err, books) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
    });

};

// Handle BookInstance create on POST.
exports.bookinstance_create_post = [
// res.send('NOT IMPLEMENTED: BookInstance create POST');
//validate body
 body('book','Book must be specified').trim().isLength({min:1}).escape(),
 body('imprint','Imprint must be specified').trim().isLength({min:1}).escape(),
 body('due_back','Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(), //date
 body('status').trim().isLength({min:1}).escape(),
 //Process request after validation and sanitization.
 (req,res,next)=>{
  // Extract the validation errors from a request.
  const errors = validationResult(req);

  // Create a BookInstance object with escaped and trimmed data.
  var bookinstace= new BookInstance(
    {
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

  if (!errors.isEmpty()){
  //if errors ,Render form again with sanitized values/errors messages.
  　Book.find({},'title')
    .exec(function(err,books){
      if (err) { return next(err); }
      res.render('bookinstance_form',{ title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance })
    });
    return;
  }
  else{

    bookinstace.save(function(err){
      if(err){return next(err);}
      res.redirect(bookinstace.url);
    });
  }
  }
 
];

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = function (req, res) {
  //res.send('NOT IMPLEMENTED: BookInstance delete GET');

  //以下、課題やったもの
  BookInstance.findById(req.params.id)
    .populate('book')　　//bookモデルのtitleを表示させるのでpopulate()　
    .exec(function (err, bookinstance) {
      if (err) { return next(err); }
      // Successful, so render.
      res.render('bookinstance_delete', { title: 'Delete BookInstance:', bookinstance: bookinstance }); //bookinstace_deleteにtitleとbookinstaceをそのままかえす。中身はpugの中で分割して表示する。

    });
};


// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res) {
  //res.send('NOT IMPLEMENTED: BookInstance delete POST');
  //ここに書いていく。
  BookInstance.findByIdAndRemove(req.body.bookinstanceid) //bookinstanceidってなんだろう？とおもったがformにでくるnameのあたいだ。これがキーになり、実際入っているのはbookinstance._idだ
    .exec(function (err, bookinstance_list) {
      if (err) { return next(err); }
      //res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
      res.redirect('/catalog/bookinstances');
    }
    );
};

// Display BookInstance update form on GET.
exports.bookinstance_update_get = function (req, res, next) {
 // res.send('NOT IMPLEMENTED: BookInstance update GET');
  async.parallel({
    bookinstance:function(callback){BookInstance.findById(req.params.id).populate('book').exec(callback);},
    book:function(callback){Book.find({},'title').exec(callback);}
},function(err,results){
    console.log(results.bookinstance);
    res.render('bookinstance_form',{title: 'Update Book Insntace',bookinstance: results.bookinstance,book_list:results.book,selected_book : results.bookinstance.book._id}); 
});
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = [
  // res.send('NOT IMPLEMENTED: BookInstance create POST');
  //validate body
   body('book','Book must be specified').trim().isLength({min:1}).escape(),
   body('imprint','Imprint must be specified').trim().isLength({min:1}).escape(),
   body('due_back','Invalid date').optional({ checkFalsy: true }).isISO8601().toDate(), //date
   body('status').trim().isLength({min:1}).escape(),
   //Process request after validation and sanitization.
   (req,res,next)=>{
    // Extract the validation errors from a request.
    const errors = validationResult(req);
  
    // Create a BookInstance object with escaped and trimmed data.
    var bookinstance= new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id:req.params.id
      });
  
    if (!errors.isEmpty()){
    //if errors ,Render form again with sanitized values/errors messages.
    　Book.find({},'title')
      .exec(function(err,books){
        if (err) { return next(err); }
        res.render('bookinstance_form',{ title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id , errors: errors.array(), bookinstance: bookinstance })
      });
      return;
    }
    else{
  　　 
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err,bookinstance) {
        if (err) { return next(err); }
           // Successful - redirect to book detail page.
           res.redirect(bookinstance.url);
        });
    }
    }
   
  ];
