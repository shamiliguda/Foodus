var express = require('express');
var router = express.Router();
var path = require('path');
var mysql = require('mysql');
var db = mysql.createPool({
	connectionLimit: 10,
	host: 'localhost',
	user: 'root',
	password: 'tiger',
	database: 'food_environment_atlas'
});

function executeQuery(query, params, cb) {
	if(params instanceof Function){
		cb = params;
		params = [];
	}
	db.getConnection(function (err, connection) {
		// Use the connection
		connection.query(query,params, function (err, rows) {
			// And done with the connection.
			connection.release();
			cb.call(connection, err, rows);
			// Don't use the connection here, it has been returned to the pool.
		});
	});
}


/* GET home page. */
/*router.get('/', function (req, res, next) {
	//res.render('index', { title: 'Express' });
	res.sendFile('public/index.html', {root: path.resolve(__dirname, '../')});
});*/
router.get('/restaurants', function (req, res) {
	executeQuery('SELECT CONCAT_WS (\' \', state,county) as county, ffr07 FROM `restaurants`',function(err, rows){
		if(err){
			console.log(err);
			res.send([]);
			return;
		}
		//res.send(rows);
		if(rows.length > 0){
			var rowsArray = [];
			for(var i = 0, len = rows.length;i < len ; i++){
				var arr = [];
				for(var key in rows[i]){
					arr.push(isNaN(parseFloat(rows[i][key])) ? rows[i][key] : parseFloat(rows[i][key]));
				}
				rowsArray.push(arr);
				delete arr;
			}
			res.send(rowsArray);
		}else{
			res.send(rows);
		}
	})
});

router.get('/states', function(req, res){
	executeQuery('SELECT state_name FROM states', function (err, rows) {
		if (err) {
			console.log(err);
			res.send([]);
			return;
		}
		//res.send(rows);
		if (rows.length > 0) {
			var rowsArray = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				for (var key in rows[i]) {
					rowsArray.push(isNaN(parseFloat(rows[i][key])) ? rows[i][key] : parseFloat(rows[i][key]));
				}
			}
			res.send(rowsArray);
		} else {
			res.send(rows);
		}
	})
});
router.get('/counties', function(req, res){
	var state = req.query.state;
	console.log('Provided state is : ', state);
	executeQuery('select county_name from countys where state_id in (select state_id from states where state_name in (?))', state,function (err, rows) {
		if (err) {
			console.log(err);
			res.send([]);
			return;
		}
		//res.send(rows);
		if (rows.length > 0) {
			var rowsArray = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				for (var key in rows[i]) {
					rowsArray.push(isNaN(parseFloat(rows[i][key])) ? rows[i][key] : parseFloat(rows[i][key]));
				}
			}
			res.send(rowsArray);
		} else {
			res.send(rows);
		}
	})
});
router.get('/getpopulationbycounty', function(req, res){
	var county = req.query.county;
	console.log('Provided county is : ', county);
	executeQuery('\
	select\
	year, sum(population) as population\
	from\
	population_county\
	JOIN\
	countys\
	using(county_id)\
	where\
	county_name in (?)\
	group\
	by\
	year\
	order\
	by\
	year', county,function (err, rows) {
		if (err) {
			console.log(err);
			res.send([]);
			return;
		}
		//res.send(rows);
		if (rows.length > 0) {
			var rowsArray = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				var arr = [];
				for (var key in rows[i]) {
					if(key == 'year'){
						arr.push(rows[i][key].toString());
					}else{
						arr.push(isNaN(parseFloat(rows[i][key])) ? rows[i][key] : parseFloat(rows[i][key]));
					}
				}
				rowsArray.push(arr);
				delete arr;
			}
			res.send(rowsArray);
		} else {
			res.send(rows);
		}
	})
});
router.get('/gethealthbycounty', function(req, res){
	var county = req.query.county;
	console.log('Provided county is : ', county);
	executeQuery('SELECT \
			year,\
			max(PCT_DIABETES_ADULTS) adult_diabetes,\
			max(PCT_OBESE_ADULTS) adult_obesity,\
			max(PCT_OBESE_CHILD) child_obesity\
	FROM\
	health\
	JOIN\
	countys\
	USING(county_id)\
	where\
	county_name in (?)\
	Group\
	by\
	county_name, year\
	', county,function (err, rows) {
		if (err) {
			console.log(err);
			res.send([]);
			return;
		}
		//res.send(rows);
		if (rows.length > 0) {
			var rowsArray = [];
			for (var i = 0, len = rows.length; i < len; i++) {
				var arr = [];
				for (var key in rows[i]) {
					if(key == 'year'){
						arr.push(rows[i][key].toString());
					}else{
						arr.push(isNaN(parseFloat(rows[i][key])) ? rows[i][key] : parseFloat(rows[i][key]));
					}
				}
				rowsArray.push(arr);
				delete arr;
			}
			res.send(rowsArray);
		} else {
			res.send(rows);
		}
	})
});



module.exports = router;

/*
 select * from states;

 select * from countys where state_id in (select state_id from states where state_name in ('Alabama'));


 select year, sum(population) from population_county JOIN countys using (county_id)
 where county_name in ('Bethel', 'Anchorage')
 group by year
 order by year;

 select county_name, year, sum(population) from population_county JOIN countys using (county_id)
 group by year, county_name
 order by county_name, year;
 */