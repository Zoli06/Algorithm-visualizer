"use strict"

let numbers = [];
const speed = 200;
const defaultColor = "black";
const activeColor = "red";

function generateRandomNumbers(numbersLength) {
    for (let i = 0; i < numbersLength; i++) {
        numbers.push(getRandomArbitrary(.2, 1));
    }
}

function drawNumbers() {
    $(".numbersContainer").empty();
    for (let i = 0; i < numbers.length; i++) {
        $(".numbersContainer").append(`<div class="number" style="height: ${numbers[i] * 100}%; left: ${i * (100 / numbers.length)}%; color: "${defaultColor}"></div>`);
    }
}

async function swap(index1, index2) {
    $(".number").eq(index1).css("background-color", activeColor).animate({ "left": `${index2 * (100 / numbers.length)}%` }, speed);
    $(".number").eq(index2).css("background-color", activeColor).animate({ "left": `${index1 * (100 / numbers.length)}%` }, speed, undefined, () => {
        $(".number").eq(index1).css("background-color", defaultColor);
        $(".number").eq(index2).css("background-color", defaultColor);
    });
    [numbers[index1], numbers[index2]] = [numbers[index2], numbers[index1]];
    await new Promise(r => setTimeout(r, speed * 2));
    drawNumbers();
}

async function bubbleSort() {
    for (let i = 0; i < numbers.length; i++) {
        for (let j = 0; j < (numbers.length - i - 1); j++) {
            if (numbers[j] > numbers[j + 1])
                await swap(j, j + 1);
        }
    }
}

async function selectionSort() {
    for (let i = 0; i < numbers.length - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < numbers.length; j++)
            if (numbers[j] < numbers[min_idx])
                min_idx = j;

        await swap(min_idx, i);
    }
}

async function quickSortIterative(l = 0, h = numbers.length - 1) {
    async function partition(low, high) {
        let pivot = numbers[high];
    
        let i = (low - 1);
        for (let j = low; j <= high - 1; j++) {
            if (numbers[j] <= pivot) {
                i++;
    
                await swap(i, j);
            }
        }
    
        await swap(i + 1, high);
    
        return i + 1;
    }
    
    let stack = new Array(h - l + 1);
    stack.fill(0);

    let top = -1;

    stack[++top] = l;
    stack[++top] = h;

    while (top >= 0) {
        h = stack[top--];
        l = stack[top--];

        let p = await partition(l, h);

        if (p - 1 > l) {
            stack[++top] = l;
            stack[++top] = p - 1;
        }

        if (p + 1 < h) {
            stack[++top] = p + 1;
            stack[++top] = h;
        }
    }
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

generateRandomNumbers(25);
drawNumbers();
quickSortIterative();