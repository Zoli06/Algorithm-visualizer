import './extensions.js';

/*static*/ class Sorting {
    private static numbers: number[] = Array.from({ length: 8 }, () =>
        Math.getRandomArbitrary(20, 80)
    );
    static defaultColor: string = 'black';
    static activeColor: string = 'red';
    static animationDuration: number = 1000;
    static delayAfterAnimation: number = 1000;
    static isActiveColorWhenDelay: boolean = true;

    constructor() {
        throw 'Sorting class is static';
    }

    static draw(): void {
        $('.numbersContainer').empty();

        for (let i = 0; i < this.numbers.length; i++) {
            $('.numbersContainer').append(
                `<div class="number" style="height: ${this.numbers[i]}%; left: ${i * (100 / this.numbers.length)}%; color: "${this.defaultColor}"></div>`
            );
        }
    }

    private static async swap(index1: number, index2: number) {
        this.move(index1, index2);
        this.move(index2, index1);

        [this.numbers[index1], this.numbers[index2]] = [
            this.numbers[index2],
            this.numbers[index1],
        ];

        await this.animationFinished();
    }

    private static async insert(from: number, to: number) {
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

    private static move(from: number, to: number, markActive: boolean = true) {
        $('.number')
            .eq(from)
            .css(
                'background-color',
                markActive ? this.activeColor : this.defaultColor
            )
            .animate(
                { left: `${to * (100 / this.numbers.length)}%` },
                this.animationDuration,
                undefined!,
                () => {
                    if (!this.isActiveColorWhenDelay) {
                        $('.number').eq(from).css('background-color', this.defaultColor);
                    }
                }
            );
    }

    private static async animationFinished() {
        await new Promise((r) =>
            setTimeout(r, this.animationDuration + this.delayAfterAnimation)
        );
        this.draw();
    }

    static async bubbleSort() {
        for (let i = 0; i < this.numbers.length; i++) {
            for (let j = 0; j < this.numbers.length - i - 1; j++) {
                if (this.numbers[j] > this.numbers[j + 1]) await this.swap(j, j + 1);
            }
        }
    }

    static async selectionSort() {
        for (let i = 0; i < this.numbers.length - 1; i++) {
            let min_idx = i;
            for (let j = i + 1; j < this.numbers.length; j++)
                if (this.numbers[j] < this.numbers[min_idx]) min_idx = j;

            await this.swap(min_idx, i);
        }
    }

    static async insertionSort() {
        let key: number = 0;
        let j: number = 0;
        for (let i = 1; i < this.numbers.length; i++) {
            key = this.numbers[i];
            j = i - 1;

            while (j >= 0 && this.numbers[j] > key) {
                j = j - 1;
            }

            await this.insert(i, j + 1);
        }
    }

    // static async mergeSort() {
    //     const merge = (l: number, m: number, r: number) => {
    //         let n1 = m - l + 1;
    //         let n2 = r - m;

    //         let L = Array(n1).fill(0);
    //         let R = Array(n2).fill(0);

    //         for (let i = 0; i < n1; i++)
    //             L[i] = this.numbers[l + i];
    //         for (let j = 0; j < n2; j++)
    //             R[j] = this.numbers[m + 1 + j];

    //         let i = 0;
    //         let j = 0;
    //         let k = l;
    //         while (i < n1 && j < n2) {
    //             if (L[i] <= R[j]) {
    //                 this.numbers[k] = L[i];
    //                 i++;
    //             } else {
    //                 this.numbers[k] = R[j];
    //                 j++;
    //             }
    //             k++;
    //         }

    //         while (i < n1) {
    //             this.numbers[k] = L[i];
    //             i++;
    //             k++;
    //         }

    //         while (j < n2) {
    //             this.numbers[k] = R[j];
    //             j++;
    //             k++;
    //         }

    //         console.log(this.numbers);
    //     }

    //     for (let curr_size = 1; curr_size <= this.numbers.length - 1; curr_size = 2 * curr_size) {
    //         for (let left_start = 0; left_start < this.numbers.length - 1; left_start += 2 * curr_size) {
    //             let mid = Math.min(left_start + curr_size - 1, this.numbers.length - 1);

    //             let right_end = Math.min(left_start + 2 * curr_size - 1, this.numbers.length - 1);

    //             merge(left_start, mid, right_end);
    //         }
    //     }
    // }

    static async quickSort(l: number = 0, h: number = this.numbers.length - 1) {
        const partition = async (low: number, high: number) => {
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

let algorithms = { 'Sorting': ['Bubble Sort', 'Selection Sort', 'Insertion Sort', /*'Merge Sort', */ 'Quick Sort'] };

function run(): boolean {
    switch ($('#algorithm-types').find(":selected").text()) {
        case 'Sorting':
            switch ($('#algorithms').find(":selected").text()) {
                case 'Bubble Sort':
                    Sorting.bubbleSort();
                    break;
                case 'Selection Sort':
                    Sorting.selectionSort();
                    break;
                case 'Insertion Sort':
                    Sorting.insertionSort();
                    break;
                // case 'Merge Sort':
                //     Sorting.mergeSort();
                //     break;
                case 'Quick Sort':
                    Sorting.quickSort();
                    break;
            }
            break;
    }

    return false;
}

function fillAlgorithmTypes() {
    Object.keys(algorithms).forEach(algorithmType => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        algorithms[algorithmType].forEach(algorithm => {
            $('#algorithms').append(
                $('<option>').text(algorithm).attr('value', algorithm.toLowerCase().replace(' ', ''))
            );
        });

        $('#algorithm-types').append(
            $('<option>').text(algorithmType).attr('value', algorithmType.toLowerCase().replace(' ', ''))
        );
    });
}

fillAlgorithmTypes();

Sorting.draw();
await new Promise((r) => setTimeout(r, 1000));
$('#run').on('click', run);