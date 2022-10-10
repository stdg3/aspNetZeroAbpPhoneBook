(function () {
    app.widgets.Widgets_Tenant_ProfitShare = function () {
        var _tenantDashboardService = abp.services.app.tenantDashboard;

        var _widget;
        this.init = function (widgetManager) {
            _widget = widgetManager.getWidget();
            getProfitShare();
        };

        //== Profit Share Chart.
        //** Based on Chartist plugin - https://gionkunz.github.io/chartist-js/index.html
        var profitShare = function (data) {
            var $chart = _widget.find('.kt_chart_profit_share');
            var randomChartId = getRandomChartId();
            _widget.find('.kt_chart_profit_share').attr('id', randomChartId);

            if ($chart.length === 0) {
                return;
            }

            const series = [
                {
                    value: data[0],
                    className: 'custom',
                    meta: {
                        color: '#716aca',
                    },
                },
                {
                    value: data[1],
                    className: 'custom',
                    meta: {
                        color: '#36a3f7',
                    },
                },
                {
                    value: data[2],
                    className: 'custom',
                    meta: {
                        color: '#ffb822',
                    },
                },
            ]

            var $chartText = _widget.find('.kt-widget14__legend-text');
            var $chartBullets = _widget.find('.kt-widget14__legend-bullet');

            $($chartBullets[0]).css("background-color", series[0].meta.color);
            $($chartBullets[1]).css("background-color", series[1].meta.color);
            $($chartBullets[2]).css("background-color", series[2].meta.color);

            $($chartText[0]).text(data[0] + '% Product Sales');
            $($chartText[1]).text(data[1] + '% Online Courses');
            $($chartText[2]).text(data[2] + '% Custom Development');

            var chart = new Chartist.Pie(
                '#' + randomChartId,
                {
                    series: series,
                    labels: [1, 2, 3],
                },
                {
                    donut: true,
                    donutWidth: 17,
                    showLabel: false,
                }
            );

            chart.on('draw', function (data) {
                if (data.type === 'slice') {
                    // Get the total path length in order to use for dash array animation
                    var pathLength = data.element._node.getTotalLength();

                    // Set a dasharray that matches the path length as prerequisite to animate dashoffset
                    data.element.attr({
                        'stroke-dasharray': pathLength + 'px ' + pathLength + 'px',
                    });

                    // Create animation definition while also assigning an ID to the animation for later sync usage
                    var animationDefinition = {
                        'stroke-dashoffset': {
                            id: 'anim' + data.index,
                            dur: 1000,
                            from: -pathLength + 'px',
                            to: '0px',
                            easing: Chartist.Svg.Easing.easeOutQuint,
                            // We need to use `fill: 'freeze'` otherwise our animation will fall back to initial (not visible)
                            fill: 'freeze',
                            stroke: data.meta.color,
                        },
                    };

                    // If this was not the first slice, we need to time the animation so that it uses the end sync event of the previous animation
                    if (data.index !== 0) {
                        animationDefinition['stroke-dashoffset'].begin = 'anim' + (data.index - 1) + '.end';
                    }

                    // We need to set an initial value before the animation starts as we are not in guided mode which would do that for us

                    data.element.attr({
                        'stroke-dashoffset': -pathLength + 'px',
                        stroke: data.meta.color,
                    });

                    // We can't use guided mode as the animations need to rely on setting begin manually
                    // See http://gionkunz.github.io/chartist-js/api-documentation.html#chartistsvg-function-animate
                    data.element.animate(animationDefinition, false);
                }
            });
        };

        var getProfitShare = function () {
            _tenantDashboardService.getProfitShare().done(function (result) {
                profitShare(result.profitShares);
            });
        };

        function getRandomChartId() {
            return 'kt_chart_profit_share' + Math.floor(Math.random() * 1000000) + new Date().getTime();
        }
    };
})();
