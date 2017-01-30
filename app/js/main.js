/*
  * Кнопка подготовки и запуска просчетов
  */
  let preparator = document.getElementById('preparator'),
  runner = document.getElementById('runner');

  preparator.onclick = prepare; 

  runner.onclick = run;

/* Шаблон для ограничений */
let template = 
  '<div class="constraints-item"><input class="input" required> <span>x1<span> + <input class="input" required> <span>x2<span> \
  <select class="select"><option value="<=">≤</option> \
  <option value="=">=</option><option value=">=">≥</option></select> <input type="text" class="input input_wide" required><div>';

// контейнер html
let mainHTML = document.querySelector('main');

/* Объект со всеми данными для решения задачи 
  * С данными по умолчанию
  */
  let main = {
    constraints: 2
  };

/**
  * Создает заданное количество элементов для ограничений
  */
  function prepare(e) {
  // e.preventDefault();

  // количество ограничений
  let amount = +(con_amount.options[con_amount.selectedIndex].value);

  // устанавливаем количество ограничений (нужно будет для извлечения данных из них)
  main.constraints = amount;

  for (let i = 0; i < amount; i++) {
    constraints.innerHTML += template; 
  }
  preparation.remove();
  runner.style.display = 'block';
}

/* Initialization */

/**
  * Запускает выполнение программы
  */
  function run(e) {
    /* перед инициализацией проверка на заполненность всех нужных input */
    let inputs = checkData();

  // если input не пустые, то выполняем заполнение главный объект задачи
  // проходимся по всем input и выбираем нужные по атрибутам
  if (inputs) {
    // добавляем прелоадер на время выполнения просчетов
    // preloader.style.display = 'block';

    // инициализируем целевую функцию
    // получаем экстремум (max или min)
    let extr = ex.options[ex.selectedIndex].value;

    targetFunction.init(+inputs[0].value, +inputs[1].value, extr);

    // runner.disabled = true;

    // показываем скрытый canvas 
    container.style.visibility = 'visible';

    /** 
     * Заполняем массив equation (ограничений)
     * Для этого получим все элементы содеражащие данные ограничений
     * ! подумать над тем, чтобы вынести это в отдельную функцию
     */

     let cons = document.getElementsByClassName('constraints-item');

     for (let i = 0; i < cons.length; i++) {
      // все input данной строки
      let inputs = cons[i].getElementsByTagName('input'),
      sign = cons[i].querySelector('.select');

      // получаем знак ограничения 
      sign = sign.options[sign.selectedIndex].value;

      // данные ограничения
      let [x1, x2, value] = inputs;

      equations.push(
        new Equation(+x1.value, +x2.value, sign, +value.value)
        );

    }

    equations.push(new Equation(1, 0, ">=", 0));
    equations.push(new Equation(0, 1, ">=", 0));
    console.log(equations);

    /* Продолжаем вакханалию */
    
    //получаем Map линий и их пересечений для подсчёта экстремума  
    let bounds = fillBounds(equations);

    //последовательные точки пересечений для подсчёта экстремума
    let points = getPoints(bounds), extreme;

    //линий для построения графика, будут пересчитаны
    let graphs = getStarterGraphs(equations);

    //находим экстремум, если возможно, изменяем коопдинаты для отрисовки
    if (!checkInfinite(bounds)) {
      extreme = getExtreme(points, targetFunction.extreme);
      extreme ? showAnswer(extreme) : null;


      // нормализация точек пересечения 
      normaliseGraph(bounds, graphs);
      console.log(bounds);
      points = getPoints(bounds);
    } else {  
      points = getPoints(bounds); 
      //Если ОДР бесконечна, что добавляем 2 фиктивных ограничения, для её отрисовки
      equations.push(new Equation(1, 0, "<=", 500)); 
      equations.push(new Equation(0, 1, "<=", 500));
      bounds = fillBounds(equations);
      console.log(bounds);

      if (targetFunction.extreme === "max") {
        // нормализация точек пересечения 
        normaliseGraph(bounds, graphs);
        //точки для построения ОДР
        points = getPoints(bounds); 
        console.log(bounds);

        alert("Максимальное значение ОДР не существует, ввиду её неограниченности");  
      } else {
        extreme = getExtreme(points, targetFunction.extreme);
        extreme ? showAnswer(extreme) : null;
        console.log(extreme);  

        // нормализация точек пересечения 
        normaliseGraph(bounds, graphs);
        //точки для построения ОДР
        points = getPoints(bounds); 
      }
    }
    console.log(graphs);

    // рисуем прямые, используя массив объектов Graph
    for (let i = 0; i < graphs.length; i++) {
      drawLine(graphs[i]);
    }

    // закрашиваем ОДР
    fillArea(points);

    // линия уровня
    drawLevelLine();

    // вектор нормали
    drawVector(targetFunction.x1, targetFunction.x2);

  } else {
    alert('Заполните все поля');
  }

  // чтобы не обновлялась страница
  // e.preventDefault();
}

/**
  * Проверяет введены ли все input
  */
  function checkData() {
    let inputs = document.querySelectorAll('input:not([type="submit"])');
    for (let i = 0; i < inputs.length; i++) {
      if (!inputs[i].value)
        return false;
    }

    return inputs;
  }

  /* массив решения */
  function showAnswer(solution) {
    let x1 = document.querySelector('.x1'),
    x2 = document.querySelector('.x2'),
    target = document.querySelector('.target-value');

    x1.innerHTML = solution[0].x1;
    x2.innerHTML = solution[0].x2;
    target.innerHTML = solution[1];
  }

