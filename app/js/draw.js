/* Здесь будет модуль (скоро, но не сегодня) */
const graph = document.getElementById('graph');

// working area (canvas)
const ctx = graph.getContext('2d');

/**
	* Объект с размерами canvas
*/
const range = {
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
	* @param {string} color строка представляющая цвет линии (по умолчанию синий) 
	* каждая точка -- объект с двумя координатами 
	*/
function drawLine(line, color = 'darkblue') {
	ctx.strokeStyle = color;
	let point1 = line.point1;
	let point2 = line.point2;
	ctx.beginPath();
	ctx.moveTo(point1.x1, getReverse(point1.x2));
	ctx.lineTo(point2.x1, getReverse(point2.x2));
	ctx.stroke();
}

/**
	* Нормализует вектор нормали (приводит к шастабу графика)
	* @param {number} x координата точки по оси x 
	* @param {number} y координата точки по оси y 
	*/
function normaliseVector(x, y) {
	if (x < 20 && y < 20) {
		x *= 10;
		y *= 10; 
	}

	return [x, y];
}

/**
	* Отрисовывает вектор нормали (из точки 0, 0)
	* @param {number} x координата точки по оси x 
	* @param {number} y координата точки по оси y 
	* ! простыня кода
	*/
function drawVector(x, y) {
	const[nx, ny] = normaliseVector(x, y);

	const STROKE_COLOR = 'rgb(255, 60, 56)'; 

	ctx.strokeStyle = STROKE_COLOR;
	ctx.fillStyle = STROKE_COLOR;

	ctx.beginPath();
	ctx.moveTo(0, range.y);
	ctx.lineTo(nx, range.y - ny);
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(nx, getReverse(ny));
	ctx.lineTo(nx - 10, getReverse(ny - 10));
	ctx.stroke();
	ctx.moveTo(nx, getReverse(ny))
	ctx.lineTo(nx, getReverse(ny - 15));
	ctx.stroke();

}	

/**
	* Отрисовывает линию уровня после нахождения решения задачи
  * @param {array} solution массив с x1,x2 и значением целевой функции 
	* @param {object} targetFunction объект целевой функции 
	*/
function drawSupportLine(solution, targetFunction) {
	const value = solution[1];

	const equation = new Equation(targetFunction.x1, targetFunction.x2, '=', value);
	let graph = new Graph(equation);

	normaliseGraphs([graph]);

	drawLine(graph, 'red');
}

/**
	* Закрашивает область ОДР (если она не пустое множество)
	* @param {array} points -- массив объектов с двумя координатами точки
	*/
function fillArea(points) {
	ctx.fillStyle = 'rgb(254, 187, 22)';

	ctx.moveTo(points[0].x1, getReverse(points[0].x2));

	for (let i = 1; i < points.length; i++) {
		ctx.lineTo(points[i].x1, getReverse(points[i].x2));
	}

	ctx.fill();
}

/**
	* Рисует все точки пересечений удовлетворюящих ОДР
	* @param {array} points -- массив объектов с двумя координатами точки
	*/
function drawPoints(points) {
	ctx.fillStyle = 'rgb(251, 54, 64)';
	
	points
		.filter(siftPoints)
		.forEach((point) => {

		ctx.beginPath();
		ctx.arc(point.x1, getReverse(point.x2), 3, 0, Math.PI * 2); 
		ctx.fill();
	});
}

/**
	* Отсеивает точки пересечения с фиктивными осями
	* @param {object} point -- объект с двумя координатами точки
	* ! переместить в другой модуль (т.к. напрямую не касается отрисовки)
	*/
function siftPoints(point) {
	if (point.x1 == 0 && point.x2 == 500 ||
			point.x1 == 500 && point.x2 == 500 ||
			point.x1 == 500 && point.x2 == 0) {

		return false;
	}

	return true;
}