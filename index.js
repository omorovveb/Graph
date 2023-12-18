const weeksToShow = 50;
moment.locale('ru');
const daysInWeek = 7;
const container = document.getElementById('contributionsGrid');
const date = document.getElementById('date');
const url = 'https://dpg.gg/test/calendar.json';
const monthDiv = document.querySelector('.graph-month');
const template = document.querySelector('.template');
const currentDate = moment(new Date());
const graphMonth = document.querySelector('.graph-month');

const start = (date) => {
    axios
        .get(url)
        .then((response) => {
            const data = response.data;

            for (let row = 0; row < daysInWeek; row++) {
                for (let col = 0; col < weeksToShow + 1; col++) {
                    const cellDate = moment(date)
                        .subtract(weeksToShow, 'weeks')
                        .add(col, 'weeks')
                        .add(row, 'days');
                    const dateString = cellDate.format('YYYY-MM-DD');
                    const contributions = data[dateString] || 0;
                    const cellClass = getCellClass(contributions);
                    const cell = document.createElement('div');
                    cell.classList.add('cell', cellClass);
                    cell.title = `${dateString};  ${contributions} contributions`;
                    container.appendChild(cell);
                }
            }
        })
        .catch((error) => {
            console.error('Ошибка получения данных:', error);
        });
};

function getCellClass(contributions) {
    if (contributions === 0) {
        return 'no-contributions';
    } else if (contributions >= 1 && contributions <= 9) {
        return 'low-contributions';
    } else if (contributions >= 10 && contributions <= 19) {
        return 'medium-contributions';
    } else if (contributions >= 20 && contributions <= 29) {
        return 'high-contributions';
    } else {
        return 'very-high-contributions';
    }
}

function getMonthsBetweenDates(startDate) {
    let months = [];
    let currentDate = moment(startDate);
    let endDate = moment(startDate).subtract(50, 'weeks').endOf('month');

    while (currentDate.isSameOrAfter(endDate, 'month')) {
        months.push(currentDate.format('MMMM'));
        currentDate.subtract(1, 'month');
    }

    while (monthDiv.firstChild) {
        monthDiv.removeChild(monthDiv.firstChild);
    }

    if (months.length > 0 && monthDiv) {
        months.reverse().forEach((month) => {
            const monthElement = document.createElement('div');
            monthElement.textContent = month;
            monthDiv.appendChild(monthElement);
        });
    }
}

start(currentDate);
getMonthsBetweenDates(currentDate.format('YYYY-MM-DD'));
date.value = currentDate.format('YYYY-MM-DD');

date.addEventListener('change', function (e) {
    const parentElement = document.getElementById('contributionsGrid');
    while (parentElement.firstChild) {
        parentElement.removeChild(parentElement.firstChild);
    }

    start(e.target.value);
    const startDate = e.target.value;

    getMonthsBetweenDates(startDate);
});
