module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated failures
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/tiptipfront'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true
    },

    reporters: ['progress', 'kjhtml', 'junit'], // Make sure 'junit' is included
    junitReporter: {
      outputDir: 'test-results', // This is where your test results XML files will be saved
      outputFile: 'test-results.xml', // Name of the file to create
      useBrowserName: false // Set to false unless you need browser name in the file name
    },

    reporters: ['progress', 'kjhtml', 'coverage'], // 'kjhtml' for HTML reports
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true
  });
};
