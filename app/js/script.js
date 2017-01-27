"use strict";

///////////////////////////////
////////Initialization
///////////////////////////////

/**
 * Объект целевой функции
 * 
 * this.x1, this.x2 -- коэффиценты при х.
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
  }
};

let equations = [];

// something.onlick = () => {

// };


///////////////////////////////
////////graphic part
///////////////////////////////

/**
 * Возвращает объект, программную реализацию уравнения
 *
 * @param {number} x1 переменная уравнения.
 * @param {number} х2 переменная уравнения.
 * @param {string} sign знак уравнения(<=, >=, =).
 * @param {number} value значение уравнения.
 */

class Equation {
  constructor(x1, x2, sign, value) {
    this.x1 = x1; 
    this.x2 = x2; 
    this.sign = sign;  
    this.value = value; 
  }
}

/**
 * Возвращает объект, содержит координаты линии для отрисовки
 *
 * @param {object} eq уравнение, на основе 
 * которого просчитываются точки для отрисовки линии
 */

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


// function adaptCoords(lines) {
  // for (let i = 0; i < lines.)
// }

///////////////////////////////
////////true mathematics part
///////////////////////////////

let valuesOfTargetFunction = [];

/*  Вычисляем систему уравнений */

/**
 * Функция, просчитывающая значение х2 для состемы уравнений
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
 * Функция, просчитывающая значение х1 для состемы уравнений
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {object} con2 второе уравнение(ограничение).
 * @param {number} значение переменной х2 для системы уравнений.
 * @return {number} x1 значение переменной х1.
 */

function computeX1(con1, con2, x2) {
  let x1 = (con1.value - con1.x2 * x2) / con1.x1; 

  return x1; 
}




/*  test  */

// (function test() {
//   let con1 = new Equation(3, 4, "<=", 1700);
//   let con2 = new Equation(12, 30, "<=", 9600);

//   targetFunction.x1 = 2;
//   targetFunction.x2 = 4;

//   let x2 = computeX2(con1, con2);
//   console.log(x2);
//   let x1 = computeX1(con1, con2, x2);
//   console.log(x1);

//   console.log(targetFunction.calculate(x1, x2));
// })();


///////////////////////////////
////////test data
///////////////////////////////
