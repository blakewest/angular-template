// Karma configuration
// Generated on Tue Oct 01 2013 14:50:00 GMT-0700 (PDT)

module.exports = function(config) {
  config.set({

    // base path, that will be used to resolve files and exclude
    basePath: '../',


    // frameworks to use
    frameworks: ['jasmine'],

    plugins: ['karma-jasmine',
              'karma-phantomjs-launcher',
              'karma-haml-preprocessor',
              'karma-ng-html2js-preprocessor',
              'karma-coverage'
    ],

    preprocessors: {
      'app/**/*.haml': ['haml-coffee', 'ng-html2js'],
      'app/**/*.js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'app.templates',
      cacheIdFromPath: function(filepath) {
        filepath = filepath.replace('app', '/static');
        filepath = filepath.replace('haml', 'html');
        return filepath;
      }
    },

    // list of files / patterns to load in the browser
    files: [
      'public/vendor/js/all.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/jasmine-jquery/lib/jasmine-jquery.js',
      'bower_components/replicator/dist/replicator.min.js',
      'bower_components/behave/dist/behave.js',
      'bower_components/rosie/src/rosie.js',
      'bower_components/facade/dist/facade.js',
      'app/app/app.js',
      'app/**/*Modules.js',
      'app/**/*.js',
      'app/**/*.haml',
      'https://js.stripe.com/v2/',
      'test/mocks/*.js',
      'test/unit/**/*Spec.js'
    ],


    // list of files to exclude
    exclude: [
      'test/**/*.conf'
    ],


    // test results reporter to use
    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress', 'coverage'],

    coverageReporter: {
      dir: 'coverage',
      subdir: 'unit'
    },


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // If browser does not capture in given timeout [ms], kill it
    captureTimeout: 60000,


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
