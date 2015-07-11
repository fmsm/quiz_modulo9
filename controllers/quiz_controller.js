
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req,res,next,quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else { next(new Error('No existe quizId=' + quizId));}
     }
   ).catch(function(error) { next(error);});
};

// GET /quizes
exports.index = function(req,res) {
  //pregunto si hay un query llamado search en el request
  if (req.query.search !== undefined) {
    //preparar el string que vamos a buscar
    var cadenaAbuscar = '%' + req.query.search + '%';  //poner un % al principio y al final
    cadenaAbuscar = cadenaAbuscar.replace(' ','%');    //substituir espacios en blanco por %
    //buscar en la DB las preguntas contengan req.query.search
    models.Quiz.findAll({where: ["pregunta like ?", cadenaAbuscar]}).then(
      function(resultados) {
        if (resultados.length !== 0) {
          //mostrar la vista busqueda.ejs, mostrando la lista de resultados
          res.render('quizes/busqueda', {resultados: resultados, errors: []});
        } else {
          //mostrar la vista busqueda_vacia.ejs, mostrando una cadena de texto, informando de que no hay resultados
          res.render('quizes/busqueda_vacia', {resultados: 'No se encontro ninguna pregunta.', errors: []});  
        }//if..else
      }//function
    ).catch(function(error) { next(error);});    
  } else {
    //si no lo hay, se muestra la vista index.ejs
    models.Quiz.findAll().then(
      function(quizes) {
        res.render('quizes/index', { quizes: quizes, errors: []});
      }//function
    ).catch(function(error) { next(error);});
  }//if..else
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', {quiz: req.quiz, errors: []});
};

//GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto';
  if (req.query.respuesta === req.quiz.respuesta){
    resultado = 'Correcto';
  }
  res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
};

//GET /quizes/new
exports.new = function(req,res) {
  var quiz = models.Quiz.build(  //crea objeto quiz
    {pregunta: 'Pregunta', respuesta: 'Respuesta'}
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

//POST /quizes/create
exports.create = function(req,res) {
  var quiz = models.Quiz.build(req.body.quiz);
  quiz.validate().then(
     function(err) {
       if (err) {
         res.render('quizes/new', {quiz: quiz, errors: err.errors});
       } else {       
        quiz
        .save({fields: ['pregunta','respuesta']})  //guarda en la base de datos los campos pregunta y respuesta de quiz
        .then(function(){ res.redirect('/quizes')}) //redireccion http a lista de preguntas
       }
     } 
   );
};

//GET /quizes/:quizId/edit
exports.edit = function(req,res) {
  var quiz = req.quiz;  //autoload de instancia de quiz
  
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req,res) {
  req.quiz.pregunta = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;  

  req.quiz.validate().then(
     function(err) {
       if (err) {
         res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
       } else {       
        req.quiz
        .save({fields: ['pregunta','respuesta']})  //guarda en la base de datos los campos pregunta y respuesta de quiz
        .then(function(){ res.redirect('/quizes')}) //redireccion http a lista de preguntas
       }
     } 
   );
};

//DELETE /quizes/:id
exports.destroy = function(req,res) {
  req.quiz.destroy()
  .then( function() {
    res.redirect('/quizes');
  }).catch(function(error) { next(error)});
};

