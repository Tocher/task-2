(function (root) {
    var EMPTY = root.maze.EMPTY;
    var WALL = root.maze.WALL;
    var PATH = root.maze.PATH;
    var CURRENT = root.maze.CURRENT;

    //функция isFinish() проверяет является ли точка выходом из лабиринта
    function isFinish(x, y, maze) {
        if (x === 0 || y === 0 || x === (maze[0].length - 1) || y === (maze.length - 1)) {
            if (maze[y][x] === EMPTY) {
                console.log("finish found at x=" + (x + 1) +", y=" + (y + 1));
                return true;
            }
        }

        return false;
    }

    function check(x, y, maze) {
        if (y >= 0 && x >= 0 && y < maze.length && x < maze[0].length) {
            if (maze[y][x] === EMPTY) {
                return true;
            }
        }

        return false;
    }

    function retrace(startX, startY, finishX, finishY, maze) {
        var currentX = finishX,
            currentY = finishY,
            distance = maze[finishY][finishX],
            mazeFirstElemLength = maze[0].length,
            path = [], result;

        function findLowerDistance(x, y, dist) {
            if (y-1 >= 0 && x >= 0 && y-1 < maze.length && x < mazeFirstElemLength &&
                    maze[y-1][x] < distance && maze[y-1][x] !== -1) {
                return [x, y - 1, distance - 1];
            }

            if (y >= 0 && x-1 >= 0 && y < maze.length && x-1 < mazeFirstElemLength &&
                    maze[y][x-1] < distance && maze[y][x-1] !== -1) {
                return [x - 1, y, distance - 1];
            }

            if (y+1 >= 0 && x >= 0 && y+1 < maze.length && x < mazeFirstElemLength &&
                    maze[y+1][x] < distance && maze[y+1][x] !== -1) {
                return [x, y + 1, distance - 1];
            }
            if (y >= 0 && x + 1 >= 0 && y < maze.length && x + 1 < mazeFirstElemLength &&
                    maze[y][x+1] < distance && maze[y][x + 1] !== -1) {
                return [x + 1, y, distance - 1];
            }

            return 0;
        }

        while (currentX !== startX && currentY !== startY) {
            path.push([currentX,currentY]);

            if (path.length > 1000) { break; }

            result = findLowerDistance(currentX, currentY, distance);
            currentX = result[0];
            currentY = result[1];
            distance = result[2];

            console.log(result + "");
        }

        path.push([currentX, currentY]);
        path.push([startX, startY]);

        return path;
    }

    /**
     * Функция находит путь к выходу и возвращает найденный маршрут
     *
     * @param {number[][]} maze карта лабиринта представленная двумерной матрицей чисел
     * @param {number} x координата точки старта по оси X
     * @param {number} y координата точки старта по оси Y
     * @returns {[number, number][]} маршрут к выходу представленный списоком пар координат
     */
    function solution(maze, x, y) {
        var start = [x, y],
            world = { 0: [start] }, // массив world хранит проверяемые за каждый ход точки, например, за третий ход фунцкия проверила точки world[3]
            queuedPoints = [start], //currentPoints хранит точки для следующего хода
            found = 0, finishX, finishY,
            turnNumber = 0,
            path;

        maze[y][x] = -1;

        function turn(points) {
            var newQueue=[];

            world[++turnNumber] = points; //толкаем в world массив точек за прошлый ход

            for (var i = 0; i < points.length; i++) {
                var x = points[i][0],
                    y = points[i][1];

                if (check(x - 1, y, maze)) {
                    if (isFinish(x - 1, y, maze)) {
                        found = 1;
                        finishX = x;
                        finishY = y;
                    }

                    newQueue.push([x - 1, y]);
                    maze[y][x - 1] = turnNumber;
                }

                if (check(x, y - 1, maze)) {
                    if(isFinish(x, y-1, maze)) {
                        found = 1;
                        finishX = x;
                        finishY = y;
                    }

                    newQueue.push([x,y - 1]);
                    maze[y - 1][x] = turnNumber;
                }

                if (check(x + 1, y, maze)) {
                    if(isFinish(x + 1, y, maze)) {
                        found = 1;
                        finishX = x;
                        finishY = y;
                    }

                    newQueue.push([x + 1, y]);
                    maze[y][x + 1] = turnNumber;
                }
                if (check(x, y + 1, maze)) {
                    if (isFinish(x, y + 1, maze)) {
                        found = 1;
                        finishX = x;
                        finishY = y;
                    }

                    newQueue.push([x, y + 1]);
                    maze[y + 1][x] = turnNumber;
                }
            }
            if (newQueue.length === 0) {
                console.log("Exit not found");
            }

            queuedPoints = newQueue;
        }

        while (found !== 1) {
            turn(queuedPoints);
        }

        if (found) {
            maze[y][x] = 0;
            path = retrace(start[0], start[1], finishX, finishY, maze);

            console.log(start[0], start[1]);
        }

        return path;
    }

    root.maze.solution = solution;
})(this);
