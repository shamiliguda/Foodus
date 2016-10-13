
function drawChart(data, element, gChart, options) {

	var _options = {};

	if (options instanceof Object) {
		for (var i in options) {
			_options[i] = options[i];
		}
	}

	var data = google.visualization.arrayToDataTable(data);


	var chart = new gChart(document.getElementById(element));

	chart.draw(data, _options);
}

function drawRegionsMap() {
	$.ajax({
		url: '/restaurants',
		success: function (data) {
			var chartData = [
				[/*'id','State',*/'County', 'Fast-food restaurants, 2007'/*,'Fast-food restaurants, 2012','Fast-food restaurants (% change), 2007-12','Fast-food restaurants/1,000 pop, 2007','Fast-food restaurants/1,000 pop, 2012','Fast-food restaurants/1,000 pop (% change), 2007-12','Full-service restaurants, 2007','Full-service restaurants, 2012','Full-service restaurants (% change), 2007-12','Full-service restaurants/1,000 pop, 2007','Full-service restaurants/1,000 pop, 2012','Full-service restaurants/1,000 pop (% change), 2007-12','Expenditures per capita, fast food, 2002*','Expenditures per capita, fast food, 2007*','Expenditures per capita, restaurants, 2002*','Expenditures per capita, restaurants, 2007*'*/]];
			chartData = chartData.concat(data);
			console.log(chartData);
			//drawChart(chartData,'regions_div',google.visualization.GeoChart);
		},
		error: function () {
			document.getElementById('chart1').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart1').appendChild(nodata);
			document.getElementById('chart2').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart2').appendChild(nodata);
		}
	});
}

function onStateChange() {
	$.ajax({
		url: '/counties',
		data: {
			state: document.getElementById('state').value
		},
		success: function (data) {
			if (data instanceof Array) {
				document.getElementById('county').innerHTML = '';
				for (var i = 0; i < data.length; i++) {
					var option = document.createElement('option');
					option.textContent = data[i];
					document.getElementById('county').appendChild(option);
					delete option;
				}
				document.getElementById('county').value = data[0];
				$('#county').trigger('change');
			} else {

			}
		},
		error: function () {
			document.getElementById('chart1').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart1').appendChild(nodata);
			document.getElementById('chart2').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart2').appendChild(nodata);
		}
	});
}


function onCountyChange() {
	$.ajax({
		url: '/getpopulationbycounty',
		data: {
			county: document.getElementById('county').value
		},
		success: function (data) {
			document.getElementById('chart1').innerHTML = '';
			if (data.length == 0) {
				var nodata = document.createElement('div');
				nodata.className = 'alert alert-warning';
				nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> No data to display';
				document.getElementById('chart1').appendChild(nodata);
				return;
			}
			var chartData = [['County', 'Population By Year for ' + document.getElementById('county').value]];
			chartData = chartData.concat(data);
			drawChart(chartData, 'chart1', google.visualization.ColumnChart, {
				legend: {
					position: 'bottom'
				}, colors: ['#FFFF00', '#ff231f'],
				chartArea: {left: '10%', top: '5%', width: '80%', height: '80%'}
			});
		},
		error: function () {
			//alert('an error occurred while retreiving data from server');
			document.getElementById('chart1').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart1').appendChild(nodata);
		}
	});
	$.ajax({
		url: '/gethealthbycounty',
		data: {
			county: document.getElementById('county').value
		},
		success: function (data) {
			document.getElementById('chart2').innerHTML = '';
			if (data.length == 0) {
				var nodata = document.createElement('div');
				nodata.className = 'alert alert-warning';
				nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> No data to display';
				document.getElementById('chart2').appendChild(nodata);
				return;
			}
			var chartData = [['Year', 'Adult Diabetes Percentage', 'Adult Obesity Percentage', 'Child Obesity Percentage']];
			chartData = chartData.concat(data);
			drawChart(chartData, 'chart2', google.visualization.ColumnChart, {
				legend: {
					position: 'bottom'
				}, isStacked: true,
				chartArea: {left: '10%', top: '5%', width: '80%', height: '80%'},
				colors: ['#86FF33', '#3368F5FF', '#DD33FF']
			});
		},
		error: function () {
			//alert('an error occurred while retreiving data from server');

			document.getElementById('chart2').innerHTML = '';
			var nodata = document.createElement('div');
			nodata.className = 'alert alert-warning';
			nodata.innerHTML = '<span class="glyphicon glyphicon-alert" style="font-size: 20px;"></span> An error occurred while contacting server...';
			document.getElementById('chart2').appendChild(nodata);
		}
	});
}


function loadDefaultValues() {
	$.ajax({
		url: '/states',
		success: function (data) {
			if (data instanceof Array) {
				document.getElementById('state').innerHTML = '';
				for (var i = 0; i < data.length; i++) {
					var option = document.createElement('option');
					option.textContent = data[i];
					document.getElementById('state').appendChild(option);
					delete option;
				}
				document.getElementById('state').value = data[0];
				$('#state').trigger('change');
			} else {

			}
		},
		error: function () {
			alert('an error occurred while retreiving data from server');
		}
	});
}
function onLoad() {
	var apiKey = 'AIzaSyAkahkGQdgAkynR6f9x_UqXCHLHwQi00YE';
	google.charts.load('upcoming', {mapsApiKey: apiKey, 'packages': ['corechart', 'geochart']});
	google.charts.setOnLoadCallback(loadDefaultValues);
	$('#state').on('change', onStateChange);
	$('#county').on('change', onCountyChange);
}
window.addEventListener('load', onLoad);