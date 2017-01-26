"use strict";
// import Chart from "Chart.bundle.min.js";
// import b from "app/js/export.js";

let ctx = "myChart";
let myChart = new Chart(ctx, {
    type: 'polarArea',
    data: {
        labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        }
    }
});

// var data = {
//     datasets: [
//         {
//             label: 'First Dataset',
//             data: [
//                 {
//                     x: 7,
//                     y: -7,
//                     r: 15
//                 },
//                 {
//                     x: -4,
//                     y: 4,
//                     r: 10
//                 },
//                 {
//                     x: 5,
//                     y: -5,
//                     r: 15
//                 },
//                 {
//                     x: 3,
//                     y: -3,
//                     r: 15
//                 },
//                 {
//                     x: 2,
//                     y: -2,
//                     r: 15
//                 },
//             ],
//             backgroundColor:"#FF6384",
//             hoverBackgroundColor: "#FF6384",
//         }]
// };

// var myBubbleChart = new Chart(ctx,{
//     type: 'bubble',
//     data: data,
//     options: {
//         elements: {
//             points: {
//                 borderWidth: 1,
//                 borderColor: 'rgb(0, 0, 0)'
//             }
//         }
//     }
// });

