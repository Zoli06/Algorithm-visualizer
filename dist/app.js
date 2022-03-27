import './extensions.js';
/*static*/ class Sorting {
    static numbers = Array.from({ length: 40 }, () => Math.getRandomArbitrary(20, 80));
    static defaultColor = 'black';
    static activeColor = 'red';
    static animationDuration = 500;
    static delayAfterAnimation = 200;
    static isActiveColorWhenDelay = true;
    constructor() {
        throw 'Sorting class is static';
    }
    static drawNumbers() {
        $('.numbersContainer').empty();
        for (let i = 0; i < this.numbers.length; i++) {
            $('.numbersContainer').append(`<div class="number" style="height: ${this.numbers[i]}%; left: ${i * (100 / this.numbers.length)}%; color: "${this.defaultColor}"></div>`);
        }
    }
    static async swap(index1, index2) {
        this.move(index1, index2);
        this.move(index2, index1);
        [this.numbers[index1], this.numbers[index2]] = [
            this.numbers[index2],
            this.numbers[index1],
        ];
        await this.animationFinished();
    }
    static async insert(from, to) {
        this.move(from, to);
        for (let i = to; i < from; i++) {
            this.move(i, i + 1, false);
        }
        let temp = this.numbers[from];
        for (let i = from; i > to; i--) {
            this.numbers[i] = this.numbers[i - 1];
        }
        this.numbers[to] = temp;
        await this.animationFinished();
    }
    static move(from, to, markActive = true) {
        $('.number')
            .eq(from)
            .css('background-color', markActive ? this.activeColor : this.defaultColor)
            .animate({ left: `${to * (100 / this.numbers.length)}%` }, this.animationDuration, undefined, () => {
            if (!this.isActiveColorWhenDelay) {
                $('.number').eq(from).css('background-color', this.defaultColor);
            }
        });
    }
    static async animationFinished() {
        await new Promise((r) => setTimeout(r, this.animationDuration + this.delayAfterAnimation));
        this.drawNumbers();
    }
    static async bubbleSort() {
        for (let i = 0; i < this.numbers.length; i++) {
            for (let j = 0; j < this.numbers.length - i - 1; j++) {
                if (this.numbers[j] > this.numbers[j + 1])
                    await this.swap(j, j + 1);
            }
        }
    }
    static async selectionSort() {
        for (let i = 0; i < this.numbers.length - 1; i++) {
            let min_idx = i;
            for (let j = i + 1; j < this.numbers.length; j++)
                if (this.numbers[j] < this.numbers[min_idx])
                    min_idx = j;
            await this.swap(min_idx, i);
        }
    }
    static async insertionSort() {
        let key = 0;
        let j = 0;
        for (let i = 1; i < this.numbers.length; i++) {
            key = this.numbers[i];
            j = i - 1;
            while (j >= 0 && this.numbers[j] > key) {
                j = j - 1;
            }
            await this.insert(i, j + 1);
        }
    }
    static async quickSortIterative(l = 0, h = this.numbers.length - 1) {
        const partition = async (low, high) => {
            let pivot = this.numbers[high];
            let i = low - 1;
            for (let j = low; j <= high - 1; j++) {
                if (this.numbers[j] <= pivot) {
                    i++;
                    await this.swap(i, j);
                }
            }
            await this.swap(i + 1, high);
            return i + 1;
        };
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
}
Sorting.drawNumbers();
await new Promise((r) => setTimeout(r, 1000));
Sorting.insertionSort();
