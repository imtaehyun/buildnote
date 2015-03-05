module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			dev: {
				options: {
					port: 9000,
					hostname: "0.0.0.0",
					keepalive: true
				}
			}
		},

		watch: {
			files: ['**/*'],
			options: {
				livereload: true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-connect');

	grunt.registerTask('server', ['connect']);
}