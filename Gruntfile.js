//Gruntプラグインの導入（watchの場合）
module.exports = function(grunt){

	grunt.loadNpmTasks('grunt-babel');
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-yuidoc");
    grunt.loadNpmTasks("grunt-contrib-sass");

    grunt.initConfig({
		babel: {
			options: {
				/* ソースマップを出力させる場合はtrueにする */
				sourceMap: true
			},
			dist: {
				files: {
					/* 変換後のJSファイル: 変換前のJSファイル */
//					"common/js/test/dot_01.js": "common/js/es2015/dot_01.js",
//					"common/js/test/point-wave.js": "common/js/es2015/point-wave.js"
				}
			}
		},
        concat:{
            baseJS:{
                src:[
                    "common/js/pageInfo.js",
                    "common/js/jquery/jquery.js",
                    "common/js/jquery/easing.js",
                    "common/js/library.js",
                    "common/js/ie/selectivizr-min.js",
                    "common/js/develop/stats.min.js",
                    "common/js/develop/dat.gui.min.js"
                ],
                dest:"common/js/base.js"
            }
        },
        uglify:{
            baseJS:{
                src:"common/js/base.js",
                dest:"common/js/minify/base.js"
            },
            mainJS:{
                src:"common/js/main.js",
                dest:"common/js/minify/main.js"
            }
        },
        clean:{
            js:"<%= concat.baseJS.dest %>"
        },
		sass:{
			options:{
				style: "compact"
			},
			all:{
				files:{
					"common/css/layout.css"	: "src/scss/layout.scss"
				}
			}
		},
        watch:{
			sass:{
				files: ["src/scss/*.scss"],
				tasks: ["sass"]
			}
//			babel: {
//				files: ["common/js/es2015/*.js"],
//				tasks: ["babel"]
//			},
//			yuidoc: {
//				files: ['common/js/develop/Planet.js'],
//				tasks: ['yuidoc']
//			}
        },
		yuidoc: {
			dist: {
				'name': 'Planet',
				'description': "テストテストテストテストテストテスト",
				options: {
					//出力パスの指定(今回はGruntfile.jsと同階層に出力するよう指定)
					paths: './',
					//YUIDocファイルを出力するディレクトリ名を記述
					outdir: 'yuidocs/',
					"themedir": "themes/custom/"
				}
			}
		}
    });

    grunt.registerTask("default",["concat","uglify"]);

}

