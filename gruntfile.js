module.exports = function(grunt) {
    grunt.initConfig({

        // define source files and their destinations
        uglify: {
            files: {
                src: 'src/**/*.js', // source files mask
                dest: 'builds/titancast-api.js', // destination folder
            },
            
            options : {
                sourceMap : 'builds/sourcemap.map'
              },
        },
        watch: {
            js: {
                files: 'src/**/*.js',
                tasks: ['uglify']
            },
        }
    });

    // load plugins
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // register at least this one task
    grunt.registerTask('default', ['uglify']);

};