/* Шаблон	для уравнений */
let template = 
'<input class="input"><span>x1<span> + <input class="input"><span>x2<span> \
<select><option value="">≤</option> \
<option value="">=</option><option value="">≥</option></select><input type="text" class="input input_wide"/><br/>';

let 

function insertTemplate(times) {
	for (let i = 0; i < times; i++) {
		equations.innerHTML += template; 
	}
}

/* Initialization */

let targetFunction = {
	x1: null,
	x2: null,

	/**
   * Метод для подсчёта значения целевой функции
   *
   * @param {number} х1 значение х1.
   * @param {number} х2 значение х2.
   * @return {number} значение целевой функции при данных х1 и х2.
   */

  calculate: function(x1, x2) {
    return this.x1 * x1 + this.x2 * x2; 
  },

  init: function(x1, x2) {
  	this.x1 = x1;
  	this.x2 = x2;
  }
};

// тестовая отрисовка

drawLine([{x1:0, x2: 1700/4}, {x1: 1700/3, x2: 0}]);

drawLine([{x1:0, x2: 9600/30}, {x1: 9600/12, x2: 0}]);

// level line
drawLine([{x1:0, x2: 200}, {x1: 400, x2: 0}]);

fillArea([{x1: 0, x2: 0}, {x1: 0, x2: 320}, {x1: 300, x2: 200}, {x1: 1700/3, x2: 0}]);

drawVector(20, 40);