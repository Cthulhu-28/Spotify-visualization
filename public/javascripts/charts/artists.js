var chart;

var data = [];

var artist;

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

function init() {

    var options = {
        series: [],
        chart: {
            height: 350,
            type: 'bar',
            events: {
                dataPointSelection: function(event, chartContext, config) {
                    let point = config.dataPointIndex;
                    let attr = data[point].x;
                    window.location.href = `/artists/${attr}/${artist}`;
                }
            }
        },
        colors: colors,
        plotOptions: {
            bar: {
                columnWidth: '45%',
                distributed: true,
                dataLabels: {
                    position: 'top'
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: function(val, opts) {
                return parseFloat(val.toFixed(4));
            },
            style: {
                fontSize: '14px',
                fontFamily: 'Nunito, sans-serif',
                fontWeight: '500',
                colors: ["#191414"]
            },
            offsetY: -30
        },
        legend: {
            show: false
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
        // xaxis: {
        //     categories: [
        //         ['John', 'Doe'],
        //         ['Joe', 'Smith'],
        //         ['Jake', 'Williams'],
        //         'Amber', ['Peter', 'Brown'],
        //         ['Mary', 'Evans'],
        //         ['David', 'Wilson'],
        //         ['Lily', 'Roberts'],
        //     ],
        //     labels: {
        //         style: {
        //             colors: colors,
        //             fontSize: '12px'
        //         }
        //     }
        // }
    };

    chart = new ApexCharts(document.querySelector("#chart"), options);
    chart.render();
}

function updateChart(_artist) {
    artist = _artist;
    var url = `/api/artists/${_artist}`;
    $.getJSON(url, function(response) {
        data = response;
        chart.updateSeries([{
            name: 'Value',
            data: response
        }])
    });
}