var chart;

var colors = [
    '#008FFB',
    '#00E396',
    '#FEB019',
    '#FF4560',
    '#775DD0',
    '#546E7A',
    '#26a69a',
    '#D10CE8'
]
var year;
var chart = undefined;
var data = undefined;

function init() {

    var options = {
        series: [],
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            },
            events: {
                markerClick: function(event, chartContext, { seriesIndex, dataPointIndex, config }) {
                    window.location.href = `/songs/attributes/popularity/${year}/${data[dataPointIndex].x}`;
                }
            }
        },
        colors: ['#1DB954'],
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Number of songs per year',
            align: 'left'
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
            },
        },
        xaxis: {
            labels: {
                rotate: 0,
                hideOverlappingLabels: true
            },
            tickAmount: 'dataPoints'
        },
        tooltip: {
            style: {
                fontSize: '12px',
                fontFamily: 'Nunito, sans-serif',
            },
        }
    };

    chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

function updateChart(_year) {
    year = _year;
    var url = `/api/songs/${_year}`;
    $.getJSON(url, function(response) {
        data = response;
        chart.updateSeries([{
            name: 'Songs',
            data: response
        }])
    });
}