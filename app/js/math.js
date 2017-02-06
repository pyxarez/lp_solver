/* 
 * Целевая функция
 */
const targetFunction = {
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
  computeValue(x1, x2) {
    return this.x1 * x1 + this.x2 * x2; 
  },

  init(x1, x2, extreme) {
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

  computeValue(x1, x2) {
    return this.x1 * x1 + this.x2 * x2;
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
    this.meta = {
      sign: eq.sign,
      value: eq.value
    }  
  }
}

class ReversedEquation {
  constructor(graph) {
    this.x1 = graph.meta.value / graph.point1.x1;
    this.x2 = graph.meta.value / graph.point2.x2;
    this.sign = graph.meta.sign;
    this.value = graph.meta.value;
  }
}

/*  Вычисляем систему уравнений */

/**
 * Вычисляет значение х2 для системы уравнений
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {object} con2 второе уравнение(ограничение).
 * @return {number} x2 значение переменной х2.
 */
function computeX2(con1, con2) {
  const number = con1.value - (con2.value * con1.x1 / con2.x1);
  const x2 = number * con2.x1 / (-con2.x2 * con1.x1 + con2.x1 * con1.x2); 

  return x2; 
}

/**
 * Вычисляет значение х1 для системы уравнений на основе х2
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {number} x2 значение переменной х2 для системы уравнений.
 * @return {number} x1 значение переменной х1.
 */
function computeX1(con1, x2) {
  const x1 = (con1.value - con1.x2 * x2) / con1.x1; 

  return x1; 
}

/**
 * Вычилсяет х2 при известном х1, нужно для просчёта пересечений с осью х1 = 0(вертикальной) 
 * или с правой фиктивной осью x1 = 500. 
 * Удобно, так как х1 в первом случае всегда 0, а во втором 500
 * и его не нужно просчитывать
 *
 * @param {object} con1 первое уравнение(ограничение).
 * @param {number} x1 значение переменной х1 для системы уравнений.
 * @return {number} x2 значение переменной х2.
 */
function computeX2ByX1(con1, x1) {
  const x2 =  (con1.value - con1.x1 * x1) / con1.x2;

  return x2;
}

/**
 * Свапаем два аргумента
 *
 * @param {anytype} Любой аргумент.
 * @param {anytype} Любой аргумент.
 * @return {array} .
 */
function swapArguments(first, second) {
    let temp = first;
    first = second;
    second = temp;

    return [first, second];
}

/**
 * Проверяем, является ли первый аргумент осью
 *
 * @param {object} con1 ограничение 1.
 * @param {object} con2 ограничение 2.
 * @return {boolean}.
 */
function isAxis(con) {
  if (con.x1 == 1 && con.value == 0 ||
      con.x2 == 1 && con.value == 0 ||
      con.x1 == 1 && con.value == 500 ||
      con.x2 == 1 && con.value == 500) 
  {
    return true;
  } 
  return false;
}

/**
 * Функция вычисления х1 и х2, решает какой тип системы уравнений(пряма и ось, прямая и прямая) и выполняет соответсвующие дествие
 * 
 * Первый условный оператор - если второй аргумент ось(х1 == 0 или х1 == 500).
 * Второй условный оператор - если второй аргумент ось(х2 == 0 или х2 == 500).
 * Третий условный оператор - ограничение и ограничение
 *
 * @param {object} con1 ограничение 1.
 * @param {object} con2 ограничение 2.
 * @return {array} значения х1 и х2 при заданных ограничениях.
 */
function getX1AndX2(con1, con2) {
  let x1, x2;
  
  // удобно для для того, чтобы не менять
  // логику счёта х1 и х2(i.e. второй аргумент всегда ось теперь, кроме случаев, когда
  // пришло 2 ограничения обычных(не осей)) 
  if (isAxis(con1)) {
    [con1, con2] = swapArguments(con1, con2);    
  }

  if (con2.x1 == 1 && con2.value == 0 || con2.x1 == 1 && con2.value == 500) {
    x1 = con2.value;
    x2 = computeX2ByX1(con1, x1);
  } else if (con2.x2 == 1 && con2.value == 0 || con2.x2 == 1 && con2.value == 500) {
    x2 = con2.value;
    x1 = computeX1(con1, x2);
  } else {
    x2 = computeX2(con1, con2);
    x1 = computeX1(con1, x2);
  }

  return [x1, x2];
}

/**
 * Сравнивает значение, полученное при подстановке х1 и х2 в уравнение и 
 * ограничение уравнения(число после знака равно)
 *
 * @param {number} computedValue значение при подстановке х1 и х2 в уравнение.
 * @param {Equation} equation ограничение задачи.
 * @return {bolean} резуальтат сравнения.
 */
function compareValues(computedValue, equation) {
  const sign = equation.sign,
    value = equation.value;

  return eval(`${computedValue} ${sign} ${value}`);
}

/**
 * Функция проверки принадлежности точки к ОДР конекретного ограничения
 * Подставляет х1 и х2 в уравнение ограничения и смотрить удовлетворяется
 * ли условие ограничения
 *
 * @param {object} eq ограничение(выражение).
 * @param {number} x1 значение х1 для ограничения.
 * @param {number} х2 значение х2 для ограничение.
 * @return {bool} возращается результат проверки на принадлежность к ОДР для ограниченния.
 */
function isBelongToEquation(eq, x1, x2) {
  const computedValue = +(eq.computeValue(x1, x2)).toFixed(2);

  return compareValues(computedValue, eq);
}

/**
 * Проверяет соответствие точки с координатами (х1, х2) всем ограничениям
 *
 * @param {array} eqs(equations) массив ограничений для нашей задачи.
 * @param {number} x1 координата проверяемой точки.
 * @param {number} x2 координата проверяемой точки.
 * @return {bool} .
 */
function isBellongingToAllEquations(eqs, x1, x2) {
  for (let i = 0; i < eqs.length; i++) {

    if ( !isBelongToEquation(eqs[i], x1, x2) ) {
      return false;
    }
  }

  return true;
}

/**
 * Заполняет Map точками пересечений, подходящими под наш ОДР.
 * Находит точку пересечения, проверяет принадлежность, если принадлежит
 * всем ограничениям, записывает в Map
 *
 * @param {object} eqs массив ограничений нашей задачи.
 * @return {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 */
function fillBounds(eqs) {
  /* 
   * Объект, хранящий выражения и точки пересечения с другими объектами графика
   */
  const bounds = new Map();

  for (let i = 0, l = eqs.length; i < l; i++) {    

    for (let j = 0; j < eqs.length; j++) {
      if (j == i) continue;

      const [x1, x2] = getX1AndX2(eqs[i], eqs[j]);

      if ( !isBellongingToAllEquations(eqs, x1, x2) ) continue;

      if ( !bounds.has(eqs[i]) ) {
        bounds.set(eqs[i], new Map());
      }
      bounds
        .get(eqs[i])
        .set(eqs[j], {x1: x1, x2: x2});      
    }
  }

  return bounds;
}

/**
 * Функция проверки ОДР на ограниченность
 * будет работать, пока кто-нибудь не введёт уравнение
 * задающее прямую, параллельную оси 
 *
 * @param {array} equations уравнения ограничений(всех).
 * @return {boolean}
 */
function checkInfinite(equations) {
  for (var i = 0; i < equations.length; i++) {
    if (equations[i].sign === "<=" || equations[i].sign === "=") {
      return false;
    }
  }

  return true;
}

/**
 * Функция подготавливает точки для построения(закрашивания) ОДР
 *
 * @param {Map} bounds все точки пересечения, на ОДР.
 * @return {array} points все точки для закрашивания ОДР, выстроеннных в правильном порядке.
 */
function getPoints(bounds) {
  if (isEmptyMap(bounds)) {
    return [];     
  }

  let points = [],
    maps = [];

  for (let eq of bounds) {
    maps.push(eq);
  }

  chainPoints(points, maps[0], bounds);

  return points;
}

/**
 * Рекурсивное заполнение массива объектами, содержащими точки для закрашивания ОДР,
 * каждая из которых расположена в правильном порядке.
 *
 * @param {array} chain массив объектов, содержащих координатами точек.
 * @param {Map} eq объект типа Map, содержащий выражение(ограничение, линию) и точки пересечения с другими линиями, подходящими под ОДР.
 * @param {Map} объект со всеми Выражениями и соответсвующими им пересечениями.
 */
 function chainPoints(points, eq, bounds) {
  const eqBit = eq[1];

  for (let coords of eqBit) {
    let isSame = false;

    points.forEach((point) => {
      if (point.x1 == coords[1].x1 && point.x2 == coords[1].x2) {
        isSame = true;
      }
    });

    if (!isSame) {
      points.push(coords[1]);

      for (let bound of bounds) {
        if (bound[0] == coords[0]) {
          chainPoints(points, bound, bounds)          
        }
      }       
    }   
  }  
}


/**
 * Создание Map-а в котором будут храниться значения целевой 
 * функции при заданных х1 и х2
 *
 * @param {array} points точки пересечения, подходящие под ОДР.
 * @return {array} значения целевой функции при заданных х1 и х2.
 */
 function getValues(points) {
  let valuesForPoint = new Map();

  points.forEach((point) => {
    let value = targetFunction.computeValue(point.x1, point.x2);

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
 *
 * @param {array} equations массив ограничений.
 * @return {array} массив линий для отрисовки(будут пересчитаны, в случаевыхода за границы canvas.
 */
 function getStarterGraphs(equations) {
  let graphs = [];

  for (let i = 0; i < equations.length - 2; i++) {    
    let graph = new Graph(equations[i]);
    graphs.push(graph);
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

    for (let i = 0; i < graphs.length; i++) {    

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
 * @param {array} graphs массив линий, содержащих точки для отрисовки на графике.
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
    case (maxCoord >= 500 && maxCoord <= 1000):
      // >= 500, чтобы можно было удобно отсеить фиктивные 
      // без угрозы того, что отсеится точка прямой
      ratio = 0.49;
     break;
    case (maxCoord > 1000 && maxCoord <= 2400):
      ratio = 0.2;
      break;
  }

  return ratio;
}

/**
 * Нормализуем линии ограничений
 *
 * @param {array} graphs линий для отрисовки.
 */
function normaliseGraphs(graphs) {
  main.ratio = getRatio(graphs);

  for (var i = 0; i < graphs.length; i++) {    

    for (let key in graphs[i]) {
      if (key == "meta") {
        graphs[i][key].value *= main.ratio;
      } else {
        let line = graphs[i][key];
        let largerCoord = line.x1 > line.x2 ? line.x1 : line.x2;

        line.x1 *= main.ratio;
        line.x2 *= main.ratio;        
      }
    }
  }
}


/**
 * Нормализует точки bounds(map точек пересечений и линий,
 * которые в этих точках пересекаются) и graphs, просто перемнажая каждую координату 
 * на какой-то коэффицент
 *
 * @param {Map} bounds Map ограничений и их пересечений, удовлетворящих ОДР.
 * @param {array} graphs массив линий, содержащих точки для отрисовки на графике.
 */
function normaliseBounds(bounds, graphs) {
  const ratio = getRatio(graphs);

  for (let point of bounds.values()) {

    for (let coord of point.values()) {
      coord.x1 *= ratio;
      coord.x2 *= ratio;
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
 function getNewBounds(equations) {  
  equations.push(new Equation(1, 0, ">=", 0));
  equations.push(new Equation(0, 1, ">=", 0));
  equations.push(new Equation(1, 0, "<=", 500)); 
  equations.push(new Equation(0, 1, "<=", 500));

  const newBounds = fillBounds(equations); 
  return newBounds;
}

/**
 * Функция подсчитывает extreme целевой функции при заданных ограничениях
 * и выводит на экран
 *
 * @param {array} points точки, ограничивающие ОДР.
 * @param {string} direction направление целевой функции(max или min).
 */
 function showExtrem(points, direction) {
  main.solution = getExtreme(points, direction);
  showAnswer(main.solution);
}

/**
 * Проверяет пуст ли Map
 *
 * @param {Map} map любой объект типа Map.
 * @return {bool} пусть ли Map.
 */
 function isEmptyMap(map) {
  let counter = 0;

  for (let iterable of map) {
    counter++;
  }
  
  return counter == 0;
}

/**
 * Функция получения новых уравнений для построения правильной неограниченной ОДР
 *
 * @param {array} graphs массив объектов типа Graph, содержащий координаты прямых.
 * @return {array} equations уравнения построенные на основе координат прямых.
 */
function getNewEquations(graphs) {
  let equations = [];

  for (var i = 0; i < graphs.length; i++) {
    equations.push(new ReversedEquation(graphs[i]));
  }

  return equations;
}