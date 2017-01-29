/* Шаблон	для уравнений */
let template = 
'<input class="input"><span>x1<span> + <input class="input"><span>x2<span> \
<select><option value="">≤</option> \
<option value="">=</option><option value="">≥</option></select><input type="text" class="input input_wide"/><br/>';

function insertTemplate(times) {
	for (let i = 0; i < times; i++) {
		equations.innerHTML += template; 
	}
}

/* Initialization */

//...........................

// тестовая отрисовка

drawLine([{x1:0, x2: 1700/4}, {x1: 1700/4, x2: 0}]);

drawLine([{x1:0, x2: 9600/30}, {x1: 9600/20, x2: 0}]);

// level line
drawLine([{x1:0, x2: 200}, {x1: 400, x2: 0}]);

fillArea(points);

drawVector(20, 40);