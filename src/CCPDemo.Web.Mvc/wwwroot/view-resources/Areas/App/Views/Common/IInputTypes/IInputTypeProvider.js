(function () {
  abp.inputTypeProviders = new (function () {
    var _providers = {};

    this.addInputTypeProvider = function (provider) {
      if (!provider) {
        throw new Error('Input type provider can not be null or undefined.');
      }

      if (typeof provider.name !== 'string') {
        throw new Error('Input type provider should have "name" property which is same unique name of InputType');
      }

      if (typeof provider.get !== 'function') {
        throw new Error('Input type provider should have "get" method which returns new manager for input type.');
      }

      _providers[provider.name] = provider;
    };

    this.getInputTypeInstance = function (args) {
      if (typeof args === 'string') {
        return _providers[args].get();
      } else if (typeof args === 'object' && typeof args.inputType === 'object') {
        var provider = _providers[args.inputType.name].get();
        provider.init(args.inputType, args.options);
        return provider;
      }
      throw new Error(
        'Parameter should be type of string (InputTypeName),or object which includes inputType and options'
      );
    };
  })();
})();
