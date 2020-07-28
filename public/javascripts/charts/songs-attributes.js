var chart;

var colors = [
    '#1DB954',
    '#191414',
    '#FD9528',
    '#FD4928',
    '#1E7E9E',
    '#D62271'
]

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
                    console.log(seriesIndex);
                    console.log(dataPointIndex);
                    let attr = data[seriesIndex].name;
                    let year = data[seriesIndex].data[dataPointIndex].x;
                    window.location.href = `/songs/attributes/${year}`;
                }
            }
        },
        colors: colors,
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth',
            width: 2
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
                hideOverlappingLabels: true,
                style: {
                    colors: [],
                    fontSize: '12px',
                    fontFamily: 'Nunito, sans-serif',
                    fontWeight: 400,
                    cssClass: 'apexcharts-xaxis-label',
                },
            },
            tickAmount: 'dataPoints'
        },
        yaxis: {
            decimalsInFloat: 4
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

function updateChart(start, end) {
    var url = `/api/songs/attributes/${start}/${end}`;
    $.getJSON(url, function(response) {
        data = response;
        chart.updateSeries(response);
    });
}