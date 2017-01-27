"use strict";

let mostImportantExpression = {
      x1: 2,
      x2: 4,
      to: "max"
    },
    constraints = [ 
      {
        id: 1,
        x1: 3,
        x2: 4,
        sign: "<=",
        valune: 1700       
      },
      {
        id: 1,
        x1: 12,
        x2: 30,
        sign: "<=",
        value: 9600 
      }
    ];

///////////////////////////////
////////Initialization
///////////////////////////////

// let targetFunction = {};
// let equations = [];

// something.onlick = () => {

// };


///////////////////////////////
////////graphic part
///////////////////////////////

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


function adaptCoords(lines) {
  for (let i = 0; i < lines.)
}

///////////////////////////////
////////true mathematics part
///////////////////////////////

//решение уравнения
function substituteVariable(argument) {
  let substituted
}

function calcBetweenLines(argument) {
  // body...
}

function calcBounds(constraints) {

}

///////////////////////////////
////////test data
///////////////////////////////
