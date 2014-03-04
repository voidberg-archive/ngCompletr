'use strict';

module.exports = function( grunt ) {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg    : grunt.file.readJSON('package.json'),
    banner : '/*\n * <%= pkg.name %> <%= pkg.version %>\n * <%= pkg.homepage %>\n *\n * Built on <%= grunt.template.today("dd-mm-yyyy") %>\n *\n * Licensed under the <%= pkg.license %> license\n */\n',
    uglify : {
      options: {
        banner: '<%= banner %>'
      },
      production : {
        src: [ 'src/ngCompletr.js' ],
        dest: 'dist/ngCompletr.min.<%= pkg.version %>.js'
      }
    },
    copy : {
      production : {
        files : [
          { src: 'src/ngCompletr.js', dest : 'dist/ngCompletr.<%= pkg.version %>.js' },
          { src: 'src/ngCompletr.css', dest : 'dist/ngCompletr.<%= pkg.version %>.css' }
        ]
      }
    },
    clean: {
      dist: 'dist/*'
    },
    cssmin: {
      production: {
        options: {
          banner: '<%= banner %>'
        },
        files: {
          'dist/ngCompletr.min.<%= pkg.version %>.css': ['src/ngCompletr.css']
        }
      }
    },
    jsvalidate: {
      options:{
        globals: {},
        esprimaOptions: {},
        verbose: false
      },
      targetName:{
        files:{
          src: [
            'Gruntfile.js',
            'src/*.js'
          ]
        }
      }
    },
    karma: {
      options: {
        configFile: 'test/karma.conf.js',
        browsers: ['PhantomJS']
      },
      unit: {
        singleRun: true
      },
      watch: {
        autoWatch: true
      },
      server: {
        background: true
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        'src/*.js'
      ]
    },
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-jsvalidate');

  grunt.registerTask('default', ['build']);
  grunt.registerTask('test', ['karma:unit']);
  grunt.registerTask('validate', ['jsvalidate', 'jshint']);
  grunt.registerTask('build', ['clean', 'validate', 'karma:unit', 'copy', 'cssmin' ,'uglify']);
};
