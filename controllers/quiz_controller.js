// GET /quizes/question
exports.question = function(req, res) {
	res.render('quizes/question', {pregunta: 'Capital del Reino Unido'});
};

//GET /quizes/answer
exports.answer = function(req, res) {
	if (req.query.respuesta === 'Londres' || req.query.respuesta === 'londres'){
	  res.render('quizes/answer', {respuesta: 'Correcto'});
	} else {
	  res.render('quizes/answer', {respuesta: 'Incorrecto'});
	}
};
