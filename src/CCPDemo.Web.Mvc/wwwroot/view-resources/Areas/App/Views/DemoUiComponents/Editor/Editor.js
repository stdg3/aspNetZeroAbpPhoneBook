$(function () {
  var demoUiComponentsService = abp.services.app.demoUiComponents;

  //
  // Quill initialize
  //
  var quill = new Quill('#kt_docs_quill_basic', {
    modules: {
      toolbar: [
        [{
          header: [1, 2, false]
        }],
        ['bold', 'italic', 'underline'],
        ['image', 'code-block']
      ]
    },
    placeholder: 'Type your text here...',
    theme: 'snow' // or 'bubble'
  });

  //
  // tag select - post
  //
  $('.test-btn-summernote').click(function () {
    demoUiComponentsService.sendAndGetValue(quill.root.innerHTML).done(function (data) {
      abp.libs.sweetAlert.config.info.html = true;
      abp.message.info(data.output, app.localize('PostedValue'), { isHtml: true });
      abp.notify.info(app.localize('SavedSuccessfully'));
    });
  });
});
