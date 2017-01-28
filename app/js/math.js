// Массив ограничений (уравнений системы ограничения)
let equations = [];

/* 
	* Массив значений целевой функции 
*/
let valuesOfTargetFunction = [];

/* 
  * Массив пересечений, для отрисовки
*/
let bounds = [];

/* 
  * Целевая функция
*/
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


class Equation {
  constructor(x1, x2, sign, value) {
    this.x1 = x1;
    this.x2 = x2;
    this.sign = sign;
    this.value = value;
  }
}

class Graph {
  constructor(eq) {
    this.point1 = {
      x1: eq.value / eq.x1,
      x2: 0
    };
    this.point2 = {
      x1: 0,
      x2: eq.value / eq.x2
    };
  }
}


/*  Вычисляем систему уравнений */

/**
 * Вычисляет значение х2 для состемы уравнений
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {object} con2 второе уравнение(ограничение).
 * @return {number} x2 значение переменной х2.
 */
 function computeX2(con1, con2) {
 	let number = con1.value - (con2.value * con1.x1 / con2.x1);
 	let x2 = number * con2.x1 / (-con2.x2 * con1.x1 + con2.x1 * con1.x2); 

 	return x2; 
 }

/**
 * Вычисляет значение х1 для состемы уравнений на основе х2
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {number} x1 значение переменной х2 для системы уравнений.
 * @return {number} x1 значение переменной х1.
 */
 function computeX1(con1, x2) {
 	let x1 = (con1.value - con1.x2 * x2) / con1.x1; 

 	return x1; 
 }

/**
 * Вычилсяет х2 при известном х1, нужно для просчёта пересечений с осью х2(вертикальной) 
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {number} x1 значение переменной х1 для системы уравнений.
 * @return {number} x2 значение переменной х2.
 */

function computeX2ByX1(con1, x1) {
  let x2 =  (con1.value - con1.x1 * x1) / con1.x2;

  return x2;
}

/**
 * Функция проверки принадлежности точки к ОДР
 *
 * @param {object} con ограничение(выражение).
 * @param {number} x1 значение х1 для ограничения.
 * @param {number} х2 значение х2 для ограничение.
 * @return {boolean} возращается результат проверки на принадлежность к одр для ограниченния.
 */

function checkAccessory(con, x1, x2) {
  let computedValue = con.x1 * x1 + con.x2 * x2;

  if (computedValue <= con.value) return true;

  return false;
}


/*  Тестовая инициализация  */

equations.push(new Equation(3, 4, "<=", 1700));
equations.push(new Equation(12, 30, "<=", 9600));

targetFunction.init(2, 4);



