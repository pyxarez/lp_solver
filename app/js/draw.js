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
	* @param {array} line Массив объектов линий
	* объект линии представляет две точки с двумя координатами
	*/
function drawLine(line) {
	let line1 = line[0];
	let line2 = line[1];
	ctx.beginPath();
	ctx.moveTo(line1.x1, getReverse(line1.x2));
	ctx.lineTo(line2.x1, getReverse(line2.x2));
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