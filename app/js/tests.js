/**
 * Передаём 1 и программа запускается с Мишкиными данными, 2 с Сашкиными
 *
 */
const tester = (function() {
  const button = document.getElementById('preparator'),
    select = document.getElementsByClassName('select'),
    inputs = document.getElementsByClassName('input');

  const configs = {
    1: [2, 4, 3, 4, 1700, 12, 30, 9600],
    2: [5, 6, 0.2, 0.3, 1.8, 0.2, 0.1, 1.2, 0.3, 0.3, 2.4]
  }

  return {
    test(number) {
      if (number === 2) {
        select.value = 3;      
      }

      button.click();

      const currentConfig = configs[number];
      for (i = 0; i < inputs.length; i++) {
        inputs[i].value = currentConfig[i];
      }

      const computeButton = document.getElementById('runner');
      computeButton.click();
    }
  }
})();