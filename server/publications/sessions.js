
this.ServerSessions = new Mongo.Collection("Sessions");

/**
* @function Meteor.publish("Sessions")
* @summary Si no se le pesa un id, entonces se crea una nueva session.
* Se carga la session.
* Si ninguna session es cargada, se crea una nueva
* @params {String} sessionId - id de una sessión a cargar
* @return {Boolean}
* @todo Documentar y Entender (Antes tuvo el parametro "shopId")
*/
Meteor.publish("Sessions", function (sessionId) {
	check(sessionId, Match.OneOf(String, null));
	let created = new Date().getTime();
	let newSessionId;

	//Si no se tiene un sessionId, se crea una nueva session
	// Realmente - siempre deberiamos tener un sessionId de cliente
	if (!sessionId) {
		newSessionId = ServerSessions.insert({
			created: created
		});
	}
	else {
		newSessionId = sessionId;
	}
	// Se obtiene la session desde una sessionId existente
	let serverSession = ServerSessions.find(newSessionId);

	// Si de todas maneras no se encuentra una session. Se crea una
	// Por ejemplo si llamamos a este mètodo con un sessionId no valido.
	if (serverSession.count() === 0) {
		ServerSessions.insert({
			_id: newSessionId,
			created: created
		});
	}

	/* @global */
	EFrameworkCore.sessionId = newSessionId;

	// Se retorna un cursor.
	return ServerSessions.find(newSessionId);
});
