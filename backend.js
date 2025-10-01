feather.replace();

// conway's game of life
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameOfLifeCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resolution = 10;
    let cols, rows;
    let grid;

    const ALIVE_COLOR = '#008000';
    const DEAD_COLOR = '#121212';

    function setup() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.ceil(canvas.width / resolution);
        rows = Math.ceil(canvas.height / resolution);
        grid = buildGrid();
    }

    function buildGrid() {
        return new Array(cols).fill(null)
            .map(() => new Array(rows).fill(null)
                .map(() => (Math.random() < 0.10 ? 1 : 0)) // intial 10% chance to be alive
            );
    }

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let col = 0; col < cols; col++) {
            for (let row = 0; row < rows; row++) {
                const cell = grid[col][row];
                ctx.fillStyle = cell ? ALIVE_COLOR : DEAD_COLOR;
                ctx.fillRect(col * resolution, row * resolution, resolution, resolution);
            }
        }
    }

    function updateGrid() {
        const nextGenGrid = grid.map(arr => [...arr]);

        for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
                const cell = grid[col][row];
                let numNeighbors = 0;

                for (let i = -1; i < 2; i++) {
                    for (let j = -1; j < 2; j++) {
                        if (i === 0 && j === 0) continue;
                        const x_cell = col + i;
                        const y_cell = row + j;

                        if (x_cell >= 0 && y_cell >= 0 && x_cell < cols && y_cell < rows) {
                            const currentNeighbor = grid[x_cell][y_cell];
                            numNeighbors += currentNeighbor;
                        }
                    }
                }

                if (cell === 1 && numNeighbors < 2) {
                    nextGenGrid[col][row] = 0; // underpopulation
                } else if (cell === 1 && numNeighbors > 3) {
                    nextGenGrid[col][row] = 0; // overpopulation
                } else if (cell === 0 && numNeighbors === 3) {
                    nextGenGrid[col][row] = 1; // reproduction
                }
            }
        }
        grid = nextGenGrid;
    }
    
    function gameLoop() {
        updateGrid();
        drawGrid();
    }

    setup();
    // timer loop
    setInterval(gameLoop, 300);

    window.addEventListener('resize', setup);
});

// git init logic
async function fetchGitHubRepos() {
    const username = 'yion81';
    const repoContainer = document.getElementById('github-repos');
    const loadingMessage = document.getElementById('loading-repos');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        const repos = await response.json();

        if (loadingMessage) {
            loadingMessage.style.display = 'none';
        }

        if (repos.length === 0) {
            repoContainer.innerHTML = '<p class="text-center col-span-full">No public repositories found.</p>';
            return;
        }

        repos.forEach(repo => {
            const repoCard = `
<a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="github-card flex flex-col card-bg p-6 rounded-xl">
    <div>
        <h3 class="text-xl font-bold mb-2 text-white flex items-start">
            <i data-feather="book-open" class="mr-2 h-5 w-5 mt-1 flex-shrink-0"></i>
            <span class="break-all">${repo.name}</span>
        </h3>
    </div>
    <p class="text-gray-400 mb-4 text-sm flex-grow">${repo.description || 'No description provided.'}</p>
    <div class="flex items-center justify-between text-sm text-gray-500 mt-auto">
        <div class="flex items-center">
            <span class="w-3 h-3 rounded-full mr-2" style="background-color: ${getLanguageColor(repo.language)}"></span>
            <span>${repo.language || 'N/A'}</span>
        </div>
        <div class="flex items-center space-x-4">
            <span class="flex items-center"><i data-feather="star" class="mr-1 w-4 h-4"></i> ${repo.stargazers_count}</span>
            <span class="flex items-center"><i data-feather="git-branch" class="mr-1 w-4 h-4"></i> ${repo.forks_count}</span>
        </div>
    </div>
</a>`;
            repoContainer.insertAdjacentHTML('beforeend', repoCard);
        });
        feather.replace();
    } catch (error) {
        if(loadingMessage) {
            loadingMessage.style.display = 'none';
        }
        repoContainer.innerHTML = `<p class="text-center text-red-400 col-span-full">Failed to load repositories. ${error.message}</p>`;
        console.error("Failed to fetch GitHub repos:", error);
    }
}

function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#563d7c',
        'Dart': '#00B4AB',
        'C++': '#f34b7d',
        'Jupyter Notebook': '#DA5B0B',
        'default': '#6b7280'
    };
    return colors[language] || colors['default'];
}

document.addEventListener('DOMContentLoaded', fetchGitHubRepos);
