/** 
 * Массив значений целевой функции 
 */
let valuesOfTargetFunction = [];

/** Массив ограничений (уравнений системы ограничения)
 *
 */
let equations = [];

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
 * Функция проверки принадлежности точки к ОДР конекретного ограничения
 *
 * @param {object} con ограничение(выражение).
 * @param {number} x1 значение х1 для ограничения.
 * @param {number} х2 значение х2 для ограничение.
 * @return {boolean} возращается результат проверки на принадлежность к одр для ограниченния.
 */
function checkBelongingTo(con, x1, x2) {
  let computedValue = con.x1 * x1 + con.x2 * x2;

  let signs = {
    "<=" : function(con, x1, x2) {
      return computedValue <= con.value ? true : false;
    },

    ">=" : function(con, x1, x2) {
      return computedValue >= con.value ? true : false;
    },

    "=" : function(con, x1, x2) {
      return computedValue = con.value ? true : false;
    },
  }

  return signs[con.sign](con, x1, x2);
}

/**
 * Функция вычисления х1 и х2, решает какой тип системы уравнений(пряма и ось х1, прямая и прямая, ось х2) и выполняет соответсвующие дествие
 * 
 * Первый условный оператор - ось х1, т.е. х1 = 0 и ограничение
 * Второй условный оператор - ось х2, т.е. х2 = 0 и ограничение
 * Третий условный оператор - ограничение и ограничение
 * Четвёртый условный оператор - ось и ось
 *
 * @param {object} con1 ограничение 1.
 * @param {object} con2 ограничение 2.
 * @return {array} значения х1 и х2 при заданных ограничениях.
 */
function getX1AndX2(con1, con2) {
  let values = [];
  let x1, x2;

  if (con1.x1 == 1 && con1.value == 0 || con1.x2 == 1 && con1.value == 0) {
    let temp = con1;
    con1 = con2;
    con2 = temp;
  }

  if (con2.x1 == 1 && con2.value == 0 && con2.x2 == 1 && con2.value == 0) {
    x1 = 0;
    x2 = 0;

  } else if (con2.x1 == 1 && con2.value == 0) {
    x1 = con2.value;
    x2 = computeX2ByX1(con1, x1);

  } else if (con2.x2 == 1 && con2.value == 0) {
    x2 = con2.value;
    x1 = computeX1(con1, x2);

  } else {
    x2 = computeX2(con1, con2);
    x1 = computeX1(con1, x2);
  }

  values.push(x1);
  values.push(x2);

return values;
}

/**
 * Заполняет Map точками, подходящими под наш ОДР
 *
 * @param {object} eqs массив ограничений нашей задачи.
 * @return {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 */
function fillBounds(eqs) {
  /* 
    * Объект, хранящий выражения и точки пересечения с другими объектами графика
  */
  let bounds = new Map();
  let zeroPoint = [0, 0];

  for (let i = 0, l = eqs.length; i < l; i++) {

    bounds.set(eqs[i], new Map());

    outer:
    for (let j = 0; j < eqs.length; j++) {
      if (j == i) continue;

      let [x1, x2] = getX1AndX2(eqs[i], eqs[j]);

      for (let h = 0; h < eqs.length; h++) {
        if (j == h || i == h) continue;

        if (!checkBelongingTo(eqs[h], x1, x2)) continue outer;
      }
      
      bounds.get(eqs[i]).set(eqs[j], {x1: x1, x2: x2});      
    }

  }

  return bounds;
}

/**
 * Функция проверки ОДР на ограниченность
 *
 * @param {Map} все точки пересечения, на ОДР.
 */
function checkInfinite(bounds) {
  for (let eq of bounds.values()) {
    let counter = 0;

    for (let point of eq.values()) {
      counter++;      
    }

    if (counter != 2) throw new Error("ОДР не ограничена");
  }
}

/**
 * Функция подготавливает точки для построения графика
 *
 * @param {} .
 * @param {} .
 * @param {} .
 * @return {number} .
 */
function getPoints(bounds) {
  let points = [];
  let maps = [];

  for (let eq of bounds) {
    maps.push(eq);
  }
  console.log(maps[0]);
  chainPoints(points, maps[0], bounds);

  return points;
}

/**
 * Рекурсивная функция, создающая правильную последовательнось точек для отрисовки
 *
 * @param {} .
 * @param {} .
 * @param {} .
 * @return {number} .
 */

function chainPoints(chain, eq, bounds) {
  let point = eq[1];

  
  for (let coords of point) {

    if (!(~chain.indexOf(coords[1]))) {
      let trigger = false;

      chain.forEach((point) => {
        if (point.x1 == coords[1].x1 && point.x2 == coords[1].x2) {
          trigger = true;
        }
      });

      if (!trigger) {
        chain.push(coords[1]);
        console.log(bounds.get(coords[0]));

        for (let bound of bounds) {
          if (bound[0] == coords[0]) {
            chainPoints(chain, bound, bounds)          
          }
        }

      }    

    }   
  }  
}

/**
 * Функция поиска максимального значения
 *
 * @param {} .
 * @param {} .
 * @param {} .
 * @return {number} .
 */

/*  Тестовая инициализация  */




equations.push(new Equation(3, 4, "<=", 1700));
equations.push(new Equation(12, 30, "<=", 9600));
// equations.push(new Equation(0.2, 0.3, "<=", 1.8));
// equations.push(new Equation(0.2, 0.1, "<=", 1.2));
// equations.push(new Equation(0.3, 0.3, "<=", 2.4));
equations.push(new Equation(1, 0, ">=", 0));
equations.push(new Equation(0, 1, ">=", 0));

targetFunction.init(2, 4);

let bounds = fillBounds(equations);
console.log(bounds);

let points = getPoints(bounds); 
console.log(points);






