$(function () {
    var demoUiComponentsService = abp.services.app.demoUiComponents;

    //
    // date picker
    //
    var $selectedDate = {
        startDate: moment().startOf('day'),
    };

    $('.date-picker').daterangepicker({
        singleDatePicker: true,
    }, (start) => $selectedDate.startDate = start);

    $('.test-btn-date-picker').click(function () {
        demoUiComponentsService
            .sendAndGetDate($selectedDate.startDate.format('YYYY-MM-DDTHH:mm:ssZ'))
            .done(function (result) {
                abp.message.info(result.dateString, app.localize('PostedValue'));
                abp.notify.info(app.localize('SavedSuccessfully'));
            });
    });

    //
    // datetime picker
    //

    var $selectedDateTime = {
        startDate: moment()
    };

    $('.datetime-picker').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        startDate: moment().startOf('minute'),
        locale: {
            format: "L LT"
        },
    }, (start) => $selectedDateTime.startDate = start);

    $('.test-btn-datetime-picker').click(function () {
        demoUiComponentsService
            .sendAndGetDateTime($selectedDateTime.startDate.format('YYYY-MM-DDTHH:mm:ssZ'))
            .done(function (result) {
                abp.message.info(result.dateString, app.localize('PostedValue'));
                abp.notify.info(app.localize('SavedSuccessfully'));
            });
    });

    //
    // daterange picker
    //
    var selectedDateRange = {
        startDate: moment().add(-7, 'days').startOf('day'),
        endDate: moment().endOf('day'),
    };

    $('.daterange-picker').daterangepicker(
        $.extend(
            true,
            app.createDateRangePickerOptions({
                allowFutureDate: true,
            }),
            selectedDateRange
        ),
        function (start, end, label) {
            selectedDateRange.startDate = start;
            selectedDateRange.endDate = end;
        }
    );

    $('.test-btn-daterange-picker').click(function () {
        demoUiComponentsService
            .sendAndGetDateRange(selectedDateRange.startDate, selectedDateRange.endDate)
            .done(function (result) {
                abp.message.info(result.dateString, app.localize('PostedValue'));
                abp.notify.info(app.localize('SavedSuccessfully'));
            });
    });
});
