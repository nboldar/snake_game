"use strict";

/**
 * Объект змейки.
 * @property {{x: int, y: int}[]} body Массив с точками тела змейки.
 * @property {string} lastStepDirection Направление, куда сходила змейка прошлый раз.
 * @property {string} direction Направление, куда пользователь направил змейку.
 */
const snake = {
    body: null,
    lastStepDirection: null,
    direction: null,
    /**
     * Инициализирует змейку, откуда она будет начинать и ее направление.
     * @param {{x: int, y: int}} startPoint Точка начальной позиции змейки.
     * @param {string} direction Начальное направление игрока.
     */
    init(startPoint, direction) {
        this.body = [startPoint];
        this.lastStepDirection = direction;
        this.direction = direction;
    },
    /**
     * Проверяет содержит ли змейка переданную точку.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/some|Array.prototype.some()}
     * @param {{x: int, y: int}} point Точка, которую проверяем.
     * @returns {boolean} true, если змейка содержит переданную точку, иначе false.
     */
    isBodyPoint(point) {
        return this.body.some(snakePoint => snakePoint.x === point.x && snakePoint.y === point.y);
    },
    /**
     * Двигает змейку на один шаг.
     */
    makeStep() {
        // Записываем направление движения, которое сейчас произойдет как направление прошлого шага.
        this.lastStepDirection = this.direction;
        // Вставляем следующую точку в начало массива.
        this.body.unshift(this.getNextStepHeadPoint());
        // Удаляем последний лишний элемент.
        this.body.pop();
    },
    /**
     * Добавляет в конец тела змейки копию последнего элемента змейки.
     */
    incrementBody() {
        // Получаем индекс последней точки в массиве точек змейки (последний элемент this.body).
        const lastBodyIdx = this.body.length - 1;
        // Получаем последнюю точку змейки.
        const lastBodyPoint = this.body[lastBodyIdx];
        // Клонируем последнюю точку змейки (делаем копию).
        const lastBodyPointClone = Object.assign({}, lastBodyPoint);
        // Добавляем копию в наш массив this.body.
        this.body.push(lastBodyPointClone);

        // game.tickInterval = setInterval(() => this.tickHandler(), 1000 / game.settings.speed);

    },
    /**
     * Отдает точку, где будет голова змейки если она сделает шаг.
     * @returns {{x: int, y: int}} Следующая точка куда придет змейка сделав шаг.
     */
    getNextStepHeadPoint() {
        // Получаем в отдельную переменную голову змейки.
        const firstPoint = this.body[0];
        // Возвращаем точку, где окажется голова змейки в зависимости от направления.
        switch (this.direction) {
            case 'up':
                // в зависимости от направления телепортинуем змейку в конец или начало направления при достижения стены
                if (firstPoint.y === 0) {
                    return {x: firstPoint.x, y: firstPoint.y + (settings.rowsCount - 1)};
                } else {
                    return {x: firstPoint.x, y: firstPoint.y - 1};
                }
            case 'down':

                if (firstPoint.y === (settings.rowsCount - 1)) {
                    return {x: firstPoint.x, y: 0};
                } else {
                    return {x: firstPoint.x, y: firstPoint.y + 1};
                }

            case 'right':
                if (firstPoint.x === (settings.colsCount - 1)) {
                    return {x: 0, y: firstPoint.y}
                } else {
                    return {x: firstPoint.x + 1, y: firstPoint.y};
                }


            case 'left':
                if (firstPoint.x === 0) {
                    return {x: firstPoint.x + (settings.colsCount - 1), y: firstPoint.y};
                } else {
                    return {x: firstPoint.x - 1, y: firstPoint.y};
                }
        }
    },
    /**
     * Устанавливает направление змейки.
     * @param {string} direction Направление змейки.
     */
    setDirection(direction) {
        this.direction = direction;
    },
};
/**
 * объект определяющий стены
 * @type {{points: *[], isWallsPoints(*): *, setWallsCoordinates(*): void}}
 */
const walls = {
    points: [
        {x: null, y: null},
        {x: null, y: null},
        {x: null, y: null},
        {x: null, y: null},
        {x: null, y: null},
    ],
    /**
     * возвращает является ли точка частью стены
     * @param point
     * @returns {boolean}
     */
    isWallsPoints(point) {

        return this.points.some(exPoint => point.x === exPoint.x && point.y === exPoint.y);

    },
    /**
     * утанавливает координаты стен
     * @param arrayOfPoints
     */

    setWallsCoordinates(arrayOfPoints) {
        for (let x = 0; x < this.points.length; x++) {
            this.points[x].x = arrayOfPoints[x].x;
            this.points[x].y = arrayOfPoints[x].y;
        }

    },

};


/**
 * Объект отображения.
 */
const renderer = {
    cells: null,
    /**
     * Метод инициализирует и выводит карту для игры.
     * @param {int} rowsCount Количество строк в карте.
     * @param {int} colsCount Количество колонок в карте.
     */
    renderMap(rowsCount, colsCount) {
        // Контейнер, где будут наши ячейки, первоначально его очистим.
        const table = document.getElementById('game');
        table.innerHTML = "";

        // Объект-хранилище всех клеток пока пустой.
        this.cells = {};

        // Цикл запустится столько раз, сколько у нас количество строк.
        for (let row = 0; row < rowsCount; row++) {
            // Создаем строку, добавляем ей класс, после добавляем ее в таблицу.
            const tr = document.createElement('tr');
            tr.classList.add('row');
            table.appendChild(tr);

            // Цикл запустится столько раз, сколько у нас количество колонок.
            for (let col = 0; col < colsCount; col++) {
                // Создаем ячейку, добавляем ячейке класс cell.
                const td = document.createElement('td');
                td.classList.add('cell');

                // Записываем в объект всех ячеек новую ячейку.
                this.cells[`x${col.toString()}_y${row.toString()}`] = td;

                // Добавляем ячейку в строку.
                tr.appendChild(td);
            }
        }
    },

    /**
     * Отображает все объекты на карте.
     * @param {{x: int, y: int}[]} snakePointsArray Массив с точками змейки.
     * @param {{x: int, y: int}} foodPoint Точка еды.
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames|Object.getOwnPropertyNames()}
     * @see {@link https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach|Array.prototype.forEach()}
     */
    render(snakePointsArray, foodPoint, wallsPoints) {
        // Чистим карту от предыдущего рендера, всем ячейкам оставляем только класс cell.
        for (const key of Object.getOwnPropertyNames(this.cells)) {
            this.cells[key].className = 'cell';
        }

        // Отображаем змейку.
        snakePointsArray.forEach((point, idx) => {
            // Если первый элемент массива, значит это голова, иначе тело.
            this.cells[`x${point.x}_y${point.y}`].classList.add(idx === 0 ? 'snakeHead' : 'snakeBody');
        });

        // Отображаем еду.
        this.cells[`x${foodPoint.x}_y${foodPoint.y}`].classList.add('food');
        wallsPoints.forEach((point) => {
            this.cells[`x${point.x}_y${point.y}`].classList.add('walls')
        });
    },
};

/**
 * Объект еды.
 * @property {int} x Координата X еды.
 * @property {int} y Координата Y еды.
 */
const food = {
    x: null,
    y: null,

    /**
     * Отдает координаты еды.
     * @returns {{x: int, y: int}} Координаты еды.
     */
    getFoodCoordinates() {
        return {
            x: this.x,
            y: this.y,
        }
    },

    /**
     * Устанавливает координаты для еды.
     * @param {{x: int, y: int}} point Новая точка с координатами еды.
     */
    setFoodCoordinates(point) {
        this.x = point.x;
        this.y = point.y;
    },

    /**
     * Определяет соответствует ли точка на которой находится еда той точке что была передана.
     * @param {{x: int, y: int}} point Точка, для проверки соответствия точке еды.
     * @returns {boolean} true, если точки совпали, иначе false.
     */
    isFoodPoint(point) {
        return this.x === point.x && this.y === point.y;
    },
};

/**
 * Статус игры.
 * @property {string} condition Статус игры.
 */
const status = {
    condition: null,

    /**
     * Устанавливает статус в "playing".
     */
    setPlaying() {
        this.condition = 'playing';
    },

    /**
     * Устанавливает статус в "stopped".
     */
    setStopped() {
        this.condition = 'stopped';
    },

    /**
     * Устанавливает статус в "finished".
     */
    setFinished() {
        this.condition = 'finished';
    },

    /**
     * Проверяет является ли статус "playing".
     * @returns {boolean} true, если статус "playing", иначе false.
     */
    isPlaying() {
        return this.condition === 'playing';
    },

    /**
     * Проверяет является ли статус "stopped".
     * @returns {boolean} true, если статус "stopped", иначе false.
     */
    isStopped() {
        return this.condition === 'stopped';
    },
};

/**
 * Объект с настройками по умолчанию, которые можно будет поменять при инициализации игры.
 * @property {int} rowsCount Количество строк.
 * @property {int} colsCount Количество колонок.
 * @property {int} speed Скорость змейки.
 * @property {int} winLength Длина змейки для победы.
 * @property {int} accseleration значение ускорения змейки(на сколько увеличится скорость.

 */
const settings = {
    rowsCount: 29,
    colsCount: 30,
    speed: 2,
    winLength: 50,
    acceleration: 1,

    /**
     * Проверка значений настроек игры.
     * @returns {boolean} true, если настройки верные, иначе false.
     */
    validate() {
        if (this.rowsCount < 10 || this.rowsCount > 30) {
            console.error('Неверные настройки, значение rowsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.colsCount < 10 || this.colsCount > 30) {
            console.error('Неверные настройки, значение colsCount должно быть в диапазоне [10, 30].');
            return false;
        }

        if (this.speed < 1 || this.speed > 10) {
            console.error('Неверные настройки, значение speed должно быть в диапазоне [1, 10].');
            return false;
        }

        if (this.winLength < 5 || this.winLength > 50) {
            console.error('Неверные настройки, значение winLength должно быть в диапазоне [5, 50].');
            return false;
        }

        return true;
    },
};

/**
 * Объект игры.
 *
 * @property {settings} settings Настройки игры.
 * @property {renderer} renderer Объект отображения.
 * @property {snake} snake Объект змейки.
 * @property {food} food Объект еды.
 * @property {status} status Статус игры.
 * @property {int} tickInterval Номер интервала игры.
 * @property {number} score  счет игры.
 * @property {number} userSpeed текущая скорость змейки.
 * @property {object} scoreField поле вывода счета.

 *
 */
const game = {
    settings,
    renderer,
    snake,
    food,
    status,
    tickInterval: null,
    userSpeed: null,
    score: 0,
    scoreField: document.querySelector('#score'),
    walls,
    fraquencyWallsChanging: 5,
    tickWallsChange: null,

    /**
     *
     * @param {object} point точка от которой мы определяем запрещенные точки для заполнения
     * @returns {Array} массив точек с координатами
     */
    fobbidenPoints(point) {
        const fobidenPointsArray = [];
        for (let a = -2; a < 3; a++) {
            if (point.x + a < 0 || point.x + a > this.settings.colsCount - 1) {
                continue;
            }

            for (let b = -2; b < 3; b++) {
                if (point.y + b < 0 || point.y + b > this.settings.rowsCount - 1) {
                    continue;
                }

                let obj = {};
                obj.x = point.x + a;
                obj.y = point.y + b;
                fobidenPointsArray.push(obj);
            }
        }
        return fobidenPointsArray;
    },


    /**
     * отображаем в браузере счет
     * @param x{number} счет игры
     */
    scoreFunc(x) {
        // let scoreTab = document.querySelector('#score');
        this.scoreField.innerHTML = `score: ${x}`;
    },

    /**
     * Инициализация игры.
     * @param {object} [settings = {}] Настройки игры, которые можно изменить.
     */
    init(settings = {}) {
        // this.getRandomWallsCoordinates();
        // this.walls.setWallsCoordinates(this.getRandomWallsCoordinates());
        // this.walls.getWallsPoints();
        // Записываем переданные настройки в те, которые будут использоваться.
        Object.assign(this.settings, settings);
        //задаем первоначальную скорость из настроек
        this.userSpeed = this.settings.speed;
        //отображаем в браузере первоначальный счет
        this.scoreFunc(this.score);


        // Если настройки игры неверные - не проводим инициализацию.
        if (!this.settings.validate()) {
            return;
        }
        // Инициализируем карту.
        this.renderer.renderMap(this.settings.rowsCount, this.settings.colsCount);
        // Устанавливаем обработчики событий.
        this.setEventHandlers();
        // Ставим игру в начальное положение.
        this.reset();
    },

    /**
     * Ставит игру в начальное положение.
     */
    reset() {
        // Ставим статус игры в "остановлена".
        this.stop();
        // Инициализируем змейку.
        this.snake.init(this.getStartSnakePoint(), 'up');
        // Ставим еду на карту в случайную пустую ячейку.
        this.food.setFoodCoordinates(this.getRandomCoordinates());

        this.walls.setWallsCoordinates(this.getRandomWallsCoordinates());
        // Отображаем все что нужно для игры.
        this.render();
        // устанавливаем начальную скорость на уровне заданной пользователем
        this.userSpeed = this.settings.speed;
        //обнуляем счет
        this.score = 0;
        //отрисовываем счет в браузере
        this.scoreFunc(this.score);
    },
    /**
     * Ставим статус игры в "играем".
     */
    play() {
        // Ставим статус в 'playing'.
        this.status.setPlaying();
        // Ставим интервал шагов змейки.
        // console.log(`это в плей ${this.userSpeed}`);
        this.tickWallsChange = setInterval(() => this.wallsChanging(), this.fraquencyWallsChanging * 1000);

        this.tickInterval = setInterval(() => this.tickHandler(), 1000 / this.userSpeed);
        // Меняем название кнопки в меню на "Стоп" и делаем ее активной.
        this.changePlayButton('Стоп');
    },


    /**
     * Ставим статус игры в "стоп".
     */
    stop() {
        // Ставим статус в 'stopped'.
        this.status.setStopped();
        // Убираем интервал шагов змейки.
        clearInterval(this.tickInterval);
        clearInterval(this.tickWallsChange);
        // Меняем название кнопки в меню на "Старт" и делаем ее активной.
        this.changePlayButton('Старт');
    },

    /**
     * Ставим статус игры в "финиш".
     */
    finish() {
        // Ставим статус в 'finished'.
        this.status.setFinished();
        // Убираем интервал шагов змейки.
        clearInterval(this.tickInterval);
        clearInterval(this.tickWallsChange);
        // Меняем название кнопки в меню на "Игра закончена" и делаем ее неактивной.
        this.changePlayButton('Игра закончена', true);
    },


    wallsChanging() {
        const randomWallsPointIdx = Math.floor(Math.random() * this.walls.points.length);
        const excludeArr = [this.food.getFoodCoordinates(), ...this.snake.body, ...this.fobbidenPoints(this.snake.body[0])];
        let myPoint = this.walls.points[randomWallsPointIdx];
        while (true) {
            myPoint.x = Math.floor(Math.random() * this.settings.rowsCount);
            myPoint.y = Math.floor(Math.random() * this.settings.colsCount);
            if (!excludeArr.some(exPoint => this.walls.points[randomWallsPointIdx].x === exPoint.x && this.walls.points[randomWallsPointIdx].y === exPoint.y)){
                break;
            }
        }

        console.log(`наша случайная стена ${this.walls.points[randomWallsPointIdx].x} и ${this.walls.points[randomWallsPointIdx].y}`);
        // this.render();

    },


    /**
     * Обработчик события тика игры, когда змейка должна перемещаться.
     */
    tickHandler() {
        // Если следующий шаг невозможен, то ставим игру в статус завершенный.
        if (!this.canSnakeMakeStep()) {
            return this.finish();
        }
        // Если следующий шаг будет на еду, то заходим в if.
        if (this.food.isFoodPoint(this.snake.getNextStepHeadPoint())) {
            // Прибавляем к змейке ячейку.
            this.snake.incrementBody();
            //добавляем к счету балл
            this.score += 1;
            //отрисовуем в браузере
            this.scoreFunc(this.score);
            //ускоряем змейку на 1 шаг, шаг прописан в настройках
            this.userSpeed = this.userSpeed + this.settings.acceleration;
            //чтобы новая скорость сработала очищаем выпонение интервального старого кода
            clearInterval(this.tickInterval);
            //... и запускаем уже с новой скоростью
            this.play();
            console.log(this.settings.speed);
            // Ставим еду в свободную ячейку.
            this.food.setFoodCoordinates(this.getRandomCoordinates());
            // Если выиграли, завершаем игру.
            if (this.isGameWon()) {
                this.finish();
            }
        }

        // Перемещаем змейку.
        this.snake.makeStep();
        console.log('привет');
        // Отрисовываем что получилось после шага.
        this.render();
        // this.fobbidenPoints(this.snake.body[0])
    },

    /**
     * Меняем кнопку с классом playButton.
     * @param {string} textContent Текст кнопки.
     * @param {boolean} [isDisabled = false] Необходимо ли заблокировать кнопку.
     */
    changePlayButton(textContent, isDisabled = false) {
        // Находим кнопку.
        const playButton = document.getElementById('playButton');
        // Меняем текст внутри кнопки на переданный.
        playButton.textContent = textContent;
        // Если необходимо запретить нажатие кнопку - ставим класс disabled, иначе убираем класс disabled.
        isDisabled ? playButton.classList.add('disabled') : playButton.classList.remove('disabled');
    },

    /**
     * Возвращает начальную позицию змейки в центре карты.
     * @returns {{x: int, y: int}} Точка начальной позиции змейки.
     */
    getStartSnakePoint() {
        return {
            x: Math.floor(this.settings.colsCount / 2),
            y: Math.floor(this.settings.rowsCount / 2)
        };
    },

    /**
     * Ставит обработчики события.
     */
    setEventHandlers() {
        // При клике на кнопку с классом playButton вызвать функцию this.playClickHandler.
        document.getElementById('playButton').addEventListener('click', () => this.playClickHandler());
        // При клике на кнопку с классом newGameButton вызвать функцию this.newGameClickHandler.
        document.getElementById('newGameButton').addEventListener('click', event => this.newGameClickHandler(event));
        // При нажатии кнопки, если статус игры "играем", то вызываем функцию смены направления у змейки.
        document.addEventListener('keydown', event => this.keyDownHandler(event));
    },

    /**
     * Отображает все для игры, карту, еду и змейку.
     */
    render() {
        // console.log(`это стены ${this.walls.points}`);
        // this.setRandomWallsCoordinates();
        this.renderer.render(this.snake.body, this.food.getFoodCoordinates(), this.walls.points);
    },

    /**
     * Отдает случайную не занятую точку на карте.
     * @return {{x: int, y: int}} Точку с координатами.
     */
    getRandomCoordinates() {
        // Занятые точки на карте.
        const exclude = [this.food.getFoodCoordinates(), ...this.snake.body];
        // Пытаемся получить точку ничем не занятую на карте.
        while (true) {
            // Случайно сгенерированная точка.
            const rndPoint = {
                x: Math.floor(Math.random() * this.settings.colsCount),
                y: Math.floor(Math.random() * this.settings.rowsCount),
            };

            // Если точка ничем не занята, то возвращаем ее из функции.
            if (!exclude.some(exPoint => rndPoint.x === exPoint.x && rndPoint.y === exPoint.y)) {
                return rndPoint;
            }
        }
    },
    /**
     * создаем массив случайных объектов-координат для стен
     * @returns {Array}
     */
    getRandomWallsCoordinates() {
        const randomWallsPointArray = [];
        const excludeArr = [this.food.getFoodCoordinates(), ...this.snake.body, ...this.fobbidenPoints(this.snake.body[0])];
        for (let x = 0; x < this.walls.points.length; x++) {
            let arrObj = {};
            do {
                arrObj.x = Math.floor(Math.random() * settings.rowsCount);
                arrObj.y = Math.floor(Math.random() * settings.rowsCount);
            } while (excludeArr.some(exPoint => arrObj.x === exPoint.x && arrObj.y === exPoint.y));

            randomWallsPointArray.push(arrObj);
        }
        ;

        console.log(`это случайные координаты для стен ${randomWallsPointArray.length}`);

        return randomWallsPointArray;
    },


    /**
     * Обработчик события нажатия на кнопку playButton.
     */
    playClickHandler() {
        // Если сейчас статус игры "играем", то игру останавливаем, если игра остановлена, то запускаем.
        if (this.status.isPlaying()) {
            this.stop();
        } else if (this.status.isStopped()) {
            this.play();
        }
    },

    /**
     * Обработчик события нажатия на кнопку "Новая игра".
     */
    newGameClickHandler() {
        // Ставим игру в начальное положение.
        this.reset();
    },

    /**
     * Обработчик события нажатия кнопки клавиатуры.
     * @param {KeyboardEvent} event
     */
    keyDownHandler(event) {
        // Если статус игры не "играем", значит обрабатывать ничего не нужно.
        if (!this.status.isPlaying()) {
            return;
        }

        // Получаем направление змейки, больше мы не обрабатываем других нажатий.
        const direction = this.getDirectionByKeyCode(event.keyCode);

        // Змейка не может повернуть на 180 градусов, поэтому делаем проверку, можем ли мы назначить направление.
        if (this.canSetDirection(direction)) {
            this.snake.setDirection(direction);
        }
    },

    /**
     * Отдает направление змейки в зависимости от переданного кода нажатой клавиши.
     * @param {int} keyCode Код нажатой клавиши.
     * @returns {string} Направление змейки.
     */
    getDirectionByKeyCode(keyCode) {
        switch (keyCode) {
            case 38:
            case 87:
                return 'up';
            case 39:
            case 68:
                return 'right';
            case 40:
            case 83:
                return 'down';
            case 37:
            case 65:
                return 'left';
            default:
                return '';
        }
    },

    /**
     * Определяет можно ли назначить переданное направление змейке.
     * @param {string} direction Направление, которое проверяем.
     * @returns {boolean} true, если направление можно назначить змейке, иначе false.
     */
    canSetDirection(direction) {
        return direction === 'up' && this.snake.lastStepDirection !== 'down' ||
            direction === 'right' && this.snake.lastStepDirection !== 'left' ||
            direction === 'down' && this.snake.lastStepDirection !== 'up' ||
            direction === 'left' && this.snake.lastStepDirection !== 'right';
    },

    /**
     * Проверяем произошла ли победа, судим по очкам игрока (длине змейки).
     * @returns {boolean} true, если игрок выиграл игру, иначе false.
     */
    isGameWon() {
        return this.snake.body.length > this.settings.winLength;
    },

    /**
     * Проверяет возможен ли следующий шаг.
     * @returns {boolean} true если следующий шаг змейки возможен, false если шаг не может быть совершен.
     */
    canSnakeMakeStep() {
        // Получаем следующую точку головы змейки в соответствии с текущим направлением.
        const nextHeadPoint = this.snake.getNextStepHeadPoint();
        // Змейка может сделать шаг если следующая точка не на теле змейки и точка внутри игрового поля.
        if (!this.snake.isBodyPoint(nextHeadPoint) && !this.walls.isWallsPoints(nextHeadPoint)) {
            return true;
        }


    },
};

// При загрузке страницы инициализируем игру.
window.onload = game.init({speed: 4});
