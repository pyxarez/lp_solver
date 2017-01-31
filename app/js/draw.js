/**
	* Графическая часть
*/

let graph = document.getElementById('graph');

// working area (canvas)
let ctx = graph.getContext('2d');

/**
	* Объект с размерами canvas
*/
let range = {
	x: graph.clientHeight,
	y: graph.clientWidth
};

/**
	* Получает координы для оси y системы координат canvas
	* @param {number} y координата по оси y графика
	*/
function getReverse(y) {
	return range.y - y;
}

/**
	* Отрисовывает линию
	* @param {object} line Объект с двумя точками
	* каждая точка -- объект с двумя координатами 
	*/
function drawLine(line) {
	ctx.strokeStyle = 'rgba(39, 31, 122, .75)';
	let point1 = line.point1;
	let point2 = line.point2;
	ctx.beginPath();
	ctx.moveTo(point1.x1, getReverse(point1.x2));
	ctx.lineTo(point2.x1, getReverse(point2.x2));
	ctx.stroke();
}

/**
	* Отрисовывает вектор нормали (из точки 0, 0)
	* @param {number} x координата точки по оси x 
	* @param {number} y координата точки по оси y 
	*/
function drawVector(x, y) {
	ctx.beginPath();
	ctx.moveTo(0, range.y);
	ctx.lineTo(x, range.y - y);
	ctx.stroke();
}	

function drawLevelLine() {
	let equation = new Equation(targetFunction.x1, targetFunction.x2, '=', targetFunction.x1 * targetFunction.x2);
	let graph = new Graph(equation);

	drawLine(graph);
}

/**
	* Закрашивает область ОДР (если она не пустое множество)
	* @param {array} x координата точки по оси x 
	*/
function fillArea(points) {
	ctx.fillStyle = 'rgba(225, 165, 0, .5)';

	ctx.moveTo(points[0].x1, getReverse(points[0].x2));

	for (let i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x1, getReverse(points[i].x2));
	}

	ctx.fill();
}