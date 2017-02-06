/*
  * Кнопка подготовки и запуска просчетов
  */
const preparator = document.getElementById('preparator'),
    runner = document.getElementById('runner'),
    controlButtonsContainer = document.querySelector('.actions'),
    resetBtn = controlButtonsContainer.lastElementChild;

preparator.onclick = prepare; 

runner.onclick = run;

resetBtn.onclick = () => {
  location.reload();
}

/* Шаблон для ограничений */
const template = 
  '<div class="constraints-item"><input class="input" required> <span>x1<span> + <input class="input" required> <span>x2<span> \
  <select class="select"><option value="<=">≤</option> \
  <option value="=">=</option><option value=">=">≥</option></select> <input type="text" class="input input_wide" required><div>';

// контейнер html
const mainHTML = document.querySelector('main');

/* Объект со всеми данными для решения задачи 
  * С данными по умолчанию
  */
const main = {
  constraints: 2,
  ratio: null,
  solution: [{x1: null, x2: null}, null]
};

/**
 * Создает заданное количество элементов для ограничений
 * ! функция, которая делает больше одного действия
 */
function prepare() {

  const constraintsAmount = +(con_amount.options[con_amount.selectedIndex].value);

  // устанавливаем количество ограничений (нужно будет для извлечения данных из них)
  main.constraints = constraintsAmount;

  for (let i = 0; i < constraintsAmount; i++) {
    constraints.innerHTML += template; 
  }

  preparation.remove();
  controlButtonsContainer.style.display = 'block';
}

/* Initialization */

/**
 * Запускает выполнение программы
 */
function run() {  
  /* перед инициализацией проверка на заполненность всех нужных input */
  const inputs = checkData();

  if (inputs) {
    let extremeSign = ex.options[ex.selectedIndex].value;

    targetFunction.init(+inputs[0].value, +inputs[1].value, extremeSign);
    runner.disabled = true;

    // показываем скрытый canvas 
    container.style.visibility = 'visible';

    /** 
    * Заполняем массив equation (ограничений)
    * Для этого получим все элементы содеражащие данные ограничений
    * ! подумать над тем, чтобы вынести это в отдельную функцию
    */
    const cons = document.getElementsByClassName('constraints-item');

    /** Массив ограничений (уравнений системы ограничения)
    *
    */
    const equations = [];

    for (let i = 0; i < cons.length; i++) {
      // все input данной строки
      const inputs = cons[i].getElementsByTagName('input');
      let sign = cons[i].querySelector('.select');

      // получаем знак ограничения  
      sign = sign.options[sign.selectedIndex].value;

      // данные ограничения
      const [x1, x2, value] = inputs;

      equations.push(new Equation(+x1.value, +x2.value, sign, +value.value));
    }

    // ограничения осей
    equations.push(new Equation(1, 0, ">=", 0));
    equations.push(new Equation(0, 1, ">=", 0));

    //получаем Map линий и их пересечений для подсчёта экстремума  
    let bounds = fillBounds(equations);
    let points = getPoints(bounds);

    //получаем координаты линий, будем пересчитывать для того, чтобы уместились в область
    //канваса (500;500)
    let graphs = getStarterGraphs(equations);

    if (points.length == 0) {    
      normaliseGraphs(graphs);
      alert("Ограничения не имеют общих точек");
    } else if (points.length == 1) {
      showExtrem(points, targetFunction.extreme);

      normaliseBounds(bounds, graphs);     
      normaliseGraphs(graphs);
      alert("ОДР представляет собой единственную точку");
    } else if (points.length == 2) {
      showExtrem(points, targetFunction.extreme);

      normaliseBounds(bounds, graphs);     
      normaliseGraphs(graphs);
      alert("ОДР представляет собой линию(2 точки на графике)");
    } else if (!checkInfinite(equations)) {
      showExtrem(points, targetFunction.extreme); 

      normaliseBounds(bounds, graphs);     
      normaliseGraphs(graphs);
      const newPoints = getPoints(bounds);

      fillArea(newPoints);

      // рисуем все точки пересечений
      drawPoints(newPoints);
    } else {  
      if (targetFunction.extreme === "max") {   
        normaliseGraphs(graphs);

        const newEquations = getNewEquations(graphs),
        newBounds = getNewBounds(newEquations);        

        //точки для построения ОДР
        const newPoints = getPoints(newBounds);
        fillArea(newPoints);       
        // alert("Максимальное значение ОДР не существует, ввиду её неограниченности"); 

        // выводим ответ
        showAnswer();

        // рисуем все точки пересечений
        drawPoints(newPoints); 
      } else {
        showExtrem(points, targetFunction.extreme);
        normaliseGraphs(graphs);

        const newEquations = getNewEquations(graphs),
        newBounds = getNewBounds(newEquations);        

        //точки для построения ОДР
        const newPoints = getPoints(newBounds);
        fillArea(newPoints);

        // рисуем все точки пересечений
        drawPoints(newPoints);              
      }
    }

    // рисуем прямые, используя массив объектов Graph
    for (let i = 0; i < graphs.length; i++) {
      drawLine(graphs[i]);
    }

    drawSupportLine(main.solution, targetFunction);

    drawVector(targetFunction.x1, targetFunction.x2);
  } else {
    alert('Заполните все поля');
  }
} 

/**
 * Проверяет введены ли все input
 */
function checkData() {
  const inputs = document.querySelectorAll('input:not([type="submit"])');

  for (let i = 0; i < inputs.length; i++) {
    if (!inputs[i].value)
      return false;
  }

  return inputs;
}

/**
 * Принимает массив с объектом, содержащим x1, x2 и значением целевой функции 
 * решенной задачи 
 */
function showAnswer(solution) {
  const answerEl = document.querySelector('.answer');

  if (solution) {
    const answer = `Ответ: X*(${solution[0].x1}, ${solution[0].x2}) = ${solution[1]}`;
    
    answerEl.innerHTML = answer;
  } else {
    answerEl.innerHTML = 'Ответ: \u221e';
  }
}

