const css = require('@/css.js');

describe('CSS', () => {
  let options;
  const errorResponse = {
    classMap: {},
    output: ''
  };

  beforeEach(() => {
    options = {
      verbose: true,
      customLogger: jest.fn()
    };
  });

  describe('Bad inputs', () => {
    test('Empty', () => {
      expect(css())
        .toEqual(errorResponse);

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('Just options', () => {
      expect(css(options))
        .toEqual(errorResponse);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Error parsing CSS', '');
    });

    test('Options, empty string', () => {
      expect(css(options, ''))
        .toEqual(errorResponse);

      expect(options.customLogger)
        .toHaveBeenCalledWith('Error parsing CSS', '');
    });

    test('Options, HTML', () => {
      expect(css(options, '<h1>Bad</h1>'))
        .toEqual(errorResponse);

      let firstError = options.customLogger.mock.calls[0];
      let secondError = options.customLogger.mock.calls[1];

      expect(JSON.stringify(firstError))
        .toEqual('["Error parsing CSS",{"reason":"missing \'{\'","line":1,"column":13,"source":""}]');

      expect(secondError)
        .toEqual(['Error parsing CSS', '<h1>Bad</h1>']);
    });
  });

  describe('Process CSS', () => {
    test('One rule', () => {
      expect(css(options, '.test { background: #F00; }', false))
        .toEqual({
          classMap: {
            '.test': [
              '.rp__background__--COLON__--OCTOTHORPF00'
            ]
          },
          output: '.rp__background__--COLON__--OCTOTHORPF00 {\n  background: #F00;\n}'
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });

    test('One rule uglified', () => {
      expect(css(options, '.test { background: #F00; }', true))
        .toEqual({
          classMap: {
            '.test': [
              '.rp__0'
            ]
          },
          output: '.rp__0 {\n  background: #F00;\n}'
        });

      expect(options.customLogger)
        .not.toHaveBeenCalled();
    });
  });
});
