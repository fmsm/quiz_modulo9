
var models = require('../models/models.js');

// GET /quizes/statistics
exports.show = function(req,res) {
  models.Quiz.findAll({ include: [models.Comment]}).then(  //en el include hay que poner models.Comment
    function(quizzes) { 
      //console.log(JSON.stringify(quizzes));     
      res.render('statistics/show', { quizzes: quizzes, errors: []});
    }//function
  ).catch(function(error) { next(error);});
};
