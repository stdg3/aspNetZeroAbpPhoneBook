(function ($) {
  $.validator.setDefaults({
    errorElement: 'div',
    errorClass: 'invalid-feedback',
    focusInvalid: false,
    submitOnKeyPress: true,
    ignore: ':hidden',
    highlight: function (element) {
      $(element).closest('.form-group').find('input:eq(0)').addClass('is-invalid');
    },

    unhighlight: function (element) {
      $(element).closest('.form-group').find('input:eq(0)').removeClass('is-invalid');
    },

    errorPlacement: function (error, element) {
      if (element.closest('.input-icon').length === 1) {
        error.insertAfter(element.closest('.input-icon'));
      } else {
        error.insertAfter(element);
      }
    },

    success: function (label) {
      label.closest('.form-group').removeClass('has-danger');
      label.remove();
    },

    submitHandler: function (form) {
      $(form).find('.alert-danger').hide();
    },
  });

  $.validator.addMethod(
    'email',
    function (value, element) {
      return /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
    },
    'Please enter a valid Email.'
  );

  $.validator.addMethod(
    'text',
    function (value, element) {
      return new RegExp($(element).attr('pattern')).test(value);
    },
    'Please enter a well formatted value.'
  );
})(jQuery);
