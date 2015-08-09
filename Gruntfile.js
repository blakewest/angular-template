module.exports = function(grunt) {

  // Default debug mode to false in feature, staging and production
  // Allow overriding through env.DEBUG
  var envIsDebug = process.env.DEBUG || ['feature', 'staging', 'production', 'test'].indexOf(process.env.NODE_ENV) === -1;
  var envIsProd = process.env.NODE_ENV === 'production';

  // Here locally for dynamic build task.
  var env = envIsDebug ? 'debug' : 'prod';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    vendorJS: [
      'bower_components/jquery/jquery.js',
      'bower_components/lodash/dist/lodash.js',
      'bower_components/moment/moment.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/restangular/dist/restangular.js',
    ],
    vendorCSS: [],
    ngAnnotate: {
      options: {
        singleQuotes: true,
      },
      public: {
        files: [
          {
            expand: true,
            src: ['public/js/*.js']
          }
        ]
      }
    },
    cssmin: {
      vendor: {
        files: {
          'vendor/css/all.css': '<%= vendorCSS %>'
        }
      }
    },
    concat: {
      vendor: {
        options: {
          separator: ';'
        },
        src: ['<%= vendorJS %>'],
        dest: 'public/vendor/js/all.js'
      },
      dist: {
        options: {
          separator: ';'
        },
        src: ['<%= vendorJS %>', 'app/common/app.js', 'app/common/initModules.js', 'app/**/*.js'],
        dest: 'public/dist/dist.js'
      }
    },
    uglify: {
      options: {
        // the banner is inserted at the top of the output
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      vendor: {
        files: {
          'public/vendor/js/all.min.js': ['<%= concat.vendor.dest %>']
        }
      },
      dist: {
        files: {
          'public/dist/dist.min.js': ['<%= concat.dist.dest %>']
        }
      }
    },

    bower: {
      install: {
        options: {
          cleanup: false,
          copy: false,
          install: true
        }
      }
    },
    haml: {
      compile: {
        options: {
          language: 'coffee',
        },
        files: [{
            expand: true,     // Enable dynamic expansion.
            cwd: 'app/',      // Src matches are relative to this path.
            src: ['**/*.haml'], // Actual pattern(s) to match.
            dest: 'public/views/',   // Destination path prefix.
            ext: '.html',   // Dest filepaths will have this extension.
        }]
      }
    },
    ngtemplates:  {
      chartbnb:        {
        cwd:      'public/views',
        src:      '**/*.html',
        dest:     'public/js/templates.js',
        options:  {
          standalone: true,
          module: 'chartbnb.templates',
          url:  function(url) {
            return '/static/' + url;
          }
        }
      }
    },
    less: {
      compile: {
        options: {
          paths: ['css']
        },
        files: [{
            expand: true,     // Enable dynamic expansion.
            cwd: 'css/',      // Src matches are relative to this path.
            src: ['**/*.less'], // Actual pattern(s) to match.
            dest: 'public/css/',   // Destination path prefix.
            ext: '.css',   // Dest filepaths will have this extension.
        }]
      }
    },
    preprocess : {
      html : {
        src : [ 'public/views/index.html' ],
        options: {
          inline : true,
          context : {
            // False doesn't cut it for preprocess, so must explicitly be set to undefined
            DEBUG: envIsDebug ? true : undefined
          }
        }
      }
    },
    includeSource: {
      options: {
        basePath: 'app'
      },
      target: {
        files: {
          'public/views/index.html': 'public/views/index.html'
        }
      }
    },
    karma: {
      unit_watch: {
        configFile: 'test/karma.conf.js',
        runnerPort: 9090,
        autoWatch: true
      },
      functional_watch: {
        configFile: 'test/karma-functional.conf.js',
        runnerPort: 9090,
        autoWatch: true
      },
      unit: {
        configFile: 'test/karma.conf.js',
        runnerPort: 9090,
        singleRun: true,
      },
      functional: {
        configFile: 'test/karma-functional.conf.js',
        runnerPort: 9090,
        singleRun: true,
      },
      e2e: {
        configFile: 'test/karma-e2e.conf.js',
        runnerPort: 9091,
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      options: {
        livereload: 35728
      },
      viewReload: {
        files: ['app/**/*'],
        tasks: ['haml', 'preprocess', 'includeSource']
      }
    },
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          logConcurrentOutput: true,
          watch: ['server.js']
        }
      }
    },
    concurrent: {
      devWatch: {
        tasks: ['nodemon', 'watch'],
        options: {
          logConcurrentOutput: true
        }
      },
      test: {
        tasks: ['karma:unit_watch', 'karma:functional_watch'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });


  // Load grunt plugins
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-bower-task');
  grunt.loadNpmTasks('grunt-haml');
  if(['feature', 'staging', 'production'].indexOf(process.env.NODE_ENV) === -1){
    grunt.loadNpmTasks('grunt-karma');
  }
  grunt.loadNpmTasks('grunt-angular-templates');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-preprocess');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-include-source');

  // Default task(s).
  grunt.registerTask('install', ['bower:install', 'build']);
  grunt.registerTask('build-shared',
    ['ngAnnotate:public', 'cssmin:vendor', 'haml', 'preprocess','concat:vendor']);
  grunt.registerTask('build-prod', ['build-shared', 'ngtemplates:hint', 'concat:dist', 'uglify:dist']);
  grunt.registerTask('build-debug', ['build-shared', 'includeSource', 'concurrent:devWatch']);
  grunt.registerTask('build', ['build-' + env ]);
  grunt.registerTask('bdd', ['concurrent:test']);
  grunt.registerTask('default', ['install']);
  // grunt.registerTask('test', ['karma:unit', 'karma:functional']);

};
