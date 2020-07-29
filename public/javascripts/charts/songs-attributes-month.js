var chart;
var year = 2020;
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
                    let month = data[seriesIndex].data[dataPointIndex].x;
                    window.location.href = `/songs/attributes/${attr}/${year}/${month}`;
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
            text: 'Attributes per month',
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

function updateChart(_year) {
    year = _year;
    var url = `/api/songs/attributes/${_year}`;
    $.getJSON(url, function(response) {
        data = response;
        chart.updateSeries(response);
    });
}