
exports.allowed = function (match, player, action) {
	if (match.winner === match.p1 
			|| match.winner === match.p1 
			|| match.winner === "draw"){
		return false;
	}
	if (match.p1 === player){
		if (action != 'x'){
			return false;
		} else if (match.gamestate.grid[action.y][action.x] != ' '){
			return false;
		} else {
			return true;
		}
	} else if (match.p2 === player){
		if (action != 'o'){
			return false;
		} else if (match.gamestate.grid[action.y][action.x] != ' '){
			return false;
		} else {
			return true;
		}
	}
	return true;
}

exports.update = function (match, action){
	match.gamestate.grid[action.y][action.x] = action.token;
	if (inRow(match, action.token)){
		match.gamestate.winner = match.p1;
	}
	match.save(function (err) {
		if (err) 
			res.send("ERROR"); // TODO: Send back response
		else 
			res.send("A match was successfully created with id " + match._id ); // TODO: Send back response
	});
}

exports.inRow = function (match, token){
	var size = match.gamestate.grid.length;
	for(var y = 0; y < size; y++){
		var h = 0;
		for(var x = 0; x < size; x++){
			if (match.gamestate.grid[y][x] === token){
				h++;
			}
		}
		if (h === size){
			return true;
		}
	}
	for(var x = 0; x < size; x++){
		var v = 0;
		for(var y = 0; y < size; y++){
			if (match.gamestate.grid[y][x] === token){
				v++;
			}
		}
		if (v  === size){
			return true;
		}
	}
	for(var xy = 0; xy < size; xy++){
		var postive = 0;
		var negative = 0;
		if (match.gamestate.grid[xy][xy] === token){
			positive++;
		}
		if (match.gamestate.grid[size-xy-1][size-xy-1] === token){
			negative++;
		}
		if (positive  === size || positive  === size){
			return true;
		}
	}
	return false;
}