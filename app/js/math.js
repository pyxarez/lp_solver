/* 
  * Целевая функция
  */
  let targetFunction = {
    x1: null,
    x2: null,
    extreme: "max",

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

  init: function(x1, x2, extreme) {
    this.x1 = x1;
    this.x2 = x2;
    this.extreme = extreme;
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
      return computedValue == con.value ? true : false;
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

  // Если первый аргумент ограничение оси, то меняем его со вторым аргументом,
  // удобно для для того, чтобы не менять
  // логику счёта х1 и х2 
  if (con1.x1 == 1 && con1.value == 0 ||
    con1.x2 == 1 && con1.value == 0 ||
    con1.x1 == 1 && con1.value == 500 ||
    con1.x2 == 1 && con1.value == 500) 
  {
    let temp = con1;
    con1 = con2;
    con2 = temp;
  }

  // Если второе ограничение уравнение оси х2 
  if (con2.x1 == 1 && con2.value == 0 || con2.x1 == 1 && con2.value == 500) {
    x1 = con2.value;
    x2 = computeX2ByX1(con1, x1);

    // Если второе ограничение уравнение оси х1
  } else if (con2.x2 == 1 && con2.value == 0 || con2.x2 == 1 && con2.value == 500) {
    x2 = con2.value;
    x1 = computeX1(con1, x2);

    // Если оба ограничения уравнения прямых
  } else {
    x2 = computeX2(con1, con2);
    x1 = computeX1(con1, x2);
  }

  values.push(x1);
  values.push(x2);
// 
return values;
}

/**
 * Заполняет Map точками пересечений, подходящими под наш ОДР
 *
 * @param {object} eqs массив ограничений нашей задачи.
 * @return {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 */
function fillBounds(eqs) {
  /* 
   * Объект, хранящий выражения и точки пересечения с другими объектами графика
   */
  let bounds = new Map();

  for (let i = 0, l = eqs.length; i < l; i++) {    

    outer:
    for (let j = 0; j < eqs.length; j++) {
      if (j == i) continue;

      let [x1, x2] = getX1AndX2(eqs[i], eqs[j]);

      for (let h = 0; h < eqs.length; h++) {
        if (j == h || i == h) continue;

        //Если точка не отвечает требованиям хоть одного ограничения, не записываем её, продолжаем перебирать другие точки
        if (!checkBelongingTo(eqs[h], x1, x2)) continue outer;
      }

      // Условие при котором ограничение(+точки в которых оно пересекается с другими)
      // создаётся записывается в bounds(Map ограничение) только если у него есть 
      // хоть одно пересечение с другими линиями
      if (!bounds.has(eqs[i])) {
        bounds.set(eqs[i], new Map());
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
function checkInfinite(bounds, points) {
  let firstPoint = points[0],
      lastPoint = points[points.length - 1],
      line = [];

  for (let eq of bounds.values()) {    
    
    for (let point of eq.values()) {
      line.push(point) 
    }

    if ((line[0].x1 == firstPoint.x1 && line[0].x2 == firstPoint.x2)
     && (line[1].x1 == lastPoint.x1 && line[1].x2 == lastPoint.x2)) {
        return false;
    }  

    line = [];  

  }

  return true;
}

/**
 * Функция подготавливает точки для построения графика
 *
 * @param {Map} все точки пересечения, на ОДР.
 * @return {array} все точки для закрашивания ОДР(некое подобие отсортированного массива).
 */
function getPoints(bounds) {
  let points = [];
  let maps = [];

  for (let eq of bounds) {
    maps.push(eq);
  }

  chainPoints(points, maps[0], bounds);

  return points;
}

/**
 * Рекурсивное заполнение массива объектами, содержащими точки для закрашивания ОДР, каждая из которых расположена в правильном порядке
 *
 * @param {array} chain массив объектов, содержащих координатами точек.
 * @param {Map} eq объект типа Map, содержащий выражение(ограничение, линию) и точки пересечения с другими линиями, подходящими под ОДР.
 * @param {Map} объект со всеми Выражениями и соответсвующими им пересечениями.
 */
 function chainPoints(chain, eq, bounds) {
  let point = eq[1];

  for (let coords of point) {

    if (!(~chain.indexOf(coords[1]))) {
      let isSame = false;

      chain.forEach((point) => {
        if (point.x1 == coords[1].x1 && point.x2 == coords[1].x2) {
          isSame = true;
        }
      });

      if (!isSame) {
        chain.push(coords[1]);

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
 * Функция получения массива значений целевой функции
 *
 * @param {array} points точки пересечения, подходящие под ОДР.
 * @return {array} значения целевой функции при заданных х1 и х2.
 */
 function getValues(points) {
  let valuesForPoint = new Map();

  points.forEach((point) => {
    let value = targetFunction.calculate(point.x1, point.x2);

    valuesForPoint.set(point, value);
  });

  return valuesForPoint;
}

/**
 * Функция вычисления экстремума целевой функции
 *
 * @param {array} points все наши точки пересечения для закрашивания ОДР.
 * @param {string} extremeSign знак целевой функции.
 * @return {Iterator} value содержит экстремум целевой функции и х1 и х2 при нём.
 */
 function getExtreme(points, extremeSign) {
  let vForP = getValues(points);

  let values = [],
  extreme;

  for (let value of vForP.values()) {
    values.push(value);
  }

  if (extremeSign === "max") {    
    extreme = Math.max(...values);
  } else {
    extreme = Math.min(...values);
  }

  for (let value of vForP) {
    if (value[1] === extreme) {
      return value;     
    }
  }
}

/**
 * Функция создаёт стартовые координаты для линий на графике
 *
 * @param {array} equations массив ограничений.
 * @return {array} массив линий для отрисовки(будут пересчитаны, в случаевыхода за границы canvas.
 */
 function getStarterGraphs(equations) {
  let graphs = [];

  for (var i = 0; i < equations.length - 2; i++) {    
    graphs.push(new Graph(equations[i]));
  }

  return graphs;
}

/**
  * Находим максимальное значения координат на графике по точкам линий
  *
  * @param {array} graphs массив линий, содержащих точки для отрисовки на графике.
  * @return {number} max максимальное значение координат на графике.
  */
  function getMaxCoord(graphs) {
    let max = 0;

    for (var i = 0; i < graphs.length; i++) {    

      for (let key in graphs[i]) {
        let line = graphs[i][key];
        let largerCoord = line.x1 > line.x2 ? line.x1 : line.x2;

        if (largerCoord > max) {
          max = largerCoord;
        }
      }
    }

    return max;    
  }

/**
 * Вычисляет коэффицент на который будут помножены координаты каждой из точек пересечения
 *
 * @param {Map} graphs Map ограничений и их пересечений, удовлетворящих ОДР.
 * @return {number} ratio коэффицент умножения.
 */
 function getRatio(graphs) {
  let maxCoord = getMaxCoord(graphs),
  ratio = 1;

  switch (true) {
    case (maxCoord > 0 && maxCoord <= 0.5):
    ratio = 600;
    break;
    case (maxCoord > 0.5 && maxCoord <= 1):
    ratio = 400;
    break;
    case (maxCoord > 1 && maxCoord <= 4.5):
    ratio = 100;
    break;
    case (maxCoord > 4.5 && maxCoord <= 10):
    ratio = 45;
    break;
    case (maxCoord > 10 && maxCoord <= 33):
    ratio = 15;
    break;
    case (maxCoord > 33 && maxCoord <= 99):
    ratio = 5;
    break;
    case (maxCoord > 500 && maxCoord <= 1000):
    ratio = 0.4;
    break;
    case (maxCoord > 1000 && maxCoord <= 2400):
    ratio = 0.2;
    break;
  }

  return ratio;
}


/**
 * Нормализует точки пересечения линий для построения графика
 *
 * @param {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 */
 function normaliseGraph(bounds, graphs) {
  let ratio = getRatio(graphs);

  for (let point of bounds.values()) {

    for (let coord of point.values()) {
      coord.x1 *= ratio;
      coord.x2 *= ratio;
    }
  }

  for (var i = 0; i < graphs.length; i++) {    

    for (let key in graphs[i]) {
      let line = graphs[i][key];
      let largerCoord = line.x1 > line.x2 ? line.x1 : line.x2;

      line.x1 *= ratio;
      line.x2 *= ratio;
    }
  }
}

/**
 * Функция упрощает повторный пересчёт точек пересечения линий(ограничений), удовлетворяющих
 * ОДР при добавлении двух фиктивных осей(верхней и правой)
 * Используется только при неограниченной ОДР
 *
 * @param {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 */
function getNewBounds(bounds, equations) {
  equations.push(new Equation(1, 0, "<=", 500)); 
  equations.push(new Equation(0, 1, "<=", 500));
  bounds = fillBounds(equations);
}

/**
 * Функция подсчитывает extreme целевой функции при заданных ограничениях
 * и выводит на экран
 *
 * @param {array} points точки, ограничивающие ОДР.
 * @param {string} direction направление целевой функции(max или min).
 */
function showExtrem(points, direction) {
  let extreme = getExtreme(points, direction);
  showAnswer(extreme);
}

/**
 * Проверяет пуст ли Map
 *
 * @param {Map} map любой объект типа Map.
 * @return {boolen} пусть ли Map.
 */
function isEmptyMap(map) {
  let counter = 0;
  
  for (let iterable of map) {
    counter++;
  }
  
  return counter == 0;
}