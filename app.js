"use strict"

let numbers = [];
let speed = 1000;

function generateRandomNumbers(numbersLength) {
    for (let i = 0; i < numbersLength; i++) {
        numbers.push(getRandomArbitrary(.2, 1));
    }
}

function drawNumbers() {
    $(".numbersContainer").empty();
    for (let i = 0; i < numbers.length; i++) {
        $(".numbersContainer").append(`<div class="number" style="height: ${numbers[i] * 100}%; left: ${i * (100 / numbers.length)}%"></div>`);
    }
}

function swap(index1, index2) {
    $(".number").eq(index1).animate({ "left": `${index2 * (100 / numbers.length)}%` }, speed);
    $(".number").eq(index2).animate({ "left": `${index1 * (100 / numbers.length)}%` }, speed);
    [numbers[index1], numbers[index2]] = [numbers[index2], numbers[index1]];
}

async function bubbleSort() {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < (numbers.length - i - 1); j++) {
            if (numbers[j] > numbers[j + 1])
                swap(j, j + 1);
                await new Promise(r => setTimeout(r, speed * 2));
                drawNumbers();
        }
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

generateRandomNumbers(25);
drawNumbers();
bubbleSort();