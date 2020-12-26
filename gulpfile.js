
/* ИНСТРУКЦИИ ДЛЯ GULP */


/* пути к папкам, чтобы галп видел куда ему заходить */

const project_folder = 'prod'; // базовый прод
const source_folder = 'src'; //  базовый дэв

const path = {
    build: {
        html: project_folder + '/',
        css: 'prod/css/',
        js: 'prod/js/',
        img: 'prod/img/',
        fonts: 'prod/fonts/'
    },
    src: {
        html: [source_folder  + '/*.html', '!' + source_folder  + '/_*.html'], //галп игнорит файлы с префиксом во втором случае
        pug: source_folder + '/pug/*.pug', 
        sass: source_folder  + '/sass/styles.sass',
        js:  source_folder + '/js/*.js',
        img: source_folder  + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
        fonts: source_folder  + '/fonts/*.ttf'
    },
    watch: {
        html: source_folder  + '/**/*.html',
        sass: source_folder  + '/sass/*.sass',
        pug: source_folder + '/pug/*.pug', 
        js:  source_folder + '/js/*.js',
        img: source_folder  + '/img/**/*.{jpg, png, svg, gif, ico, webp}',
        fonts: source_folder  + '/fonts/*.ttf'
    },
    clean: "./" + project_folder + "/"

}

/* пути для gulp к его инструментам */

//запускаторы таск, ищет либу в package это дает доступ к их методам
var {src, dest} = require('gulp'),
    gulp = require('gulp'),
    browsersync = require('browser-sync').create(),
    gulpfileinclude = require('gulp-file-include'),  // для добавления импортов в html
    del = require('del'), //для удаления ненужного файла на prod
    pugcompiler = require('gulp-pug'), 
    sasscompiler = require('sass'),
    babel = require('gulp-babel'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    imagemin = require('gulp-imagemin'),
    plumber = require('gulp-plumber'),
    compressSvg = require('gulp-svgmin');
    




/* функции gulp, что он будет делать */

// настройка browser-sync(синхронизация редактора с браузером)
function reload(params) {
    browsersync.init({
        server:{
            baseDir: "./"+ project_folder + "/"
        },
        port: 3000,
        open: true,
        notify: false
    })
}


//функция для обработки html
function html(){
    return src(path.src.html)
     .pipe(gulpfileinclude())
     .pipe(dest(path.build.html))
     .pipe(browsersync.stream())
}

// Использование шаблонизатора pug (sass для html)
function PugToHtml(){
    return src(path.src.pug)
    .pipe(
        pugcompiler({
        pretty: true
      })
    )
    .pipe(browsersync.stream())
    .pipe(dest(path.build.html))

}


//функция для перевода sass в css ДОРАБОТАТЬ
function SassToCss(){
    return gulp.src(path.src.sass)

      .pipe(browsersync.stream())
      .pipe(plumber())
      .pipe(concat('style.css'))
      .pipe(dest(path.build.css))
  }


//функция для удаления ненужных файлов в dist(prod)
function clean(params){
    return del(clean)
}

//функция для сжатия js
function compressJs(){
    return gulp.src(path.src.js)
        .pipe(babel({
            presets: ['@babel/env']
          }))
        .pipe(plumber())
        .pipe(browsersync.stream())
        .pipe(uglify())
        .pipe(concat('main.min.js'))
        .pipe(gulp.dest(path.build.js))
}

//Функция для сжатия картинок
function compressImages(){
    return gulp.src(path.src.img)
      .pipe(imagemin())
      .pipe(compressSvg())
      .pipe(gulp.dest(path.build.img))
  }



//функция для слежки за изменениями([указывать куда следить] что делать)
function watchFiles(){
    gulp.watch([path.watch.html],html),
    gulp.watch([path.watch.pug], PugToHtml),
    gulp.watch([path.watch.sass], SassToCss),
    gulp.watch([path.watch.js], compressJs),
    gulp.watch([path.watch.img], compressImages);
   
}


//инициализация фичей, отдельно series и вместе parallel
var build = gulp.series(html);
// сюда добавлять новые таски(функции)
var watch = gulp.parallel(build,
                        watchFiles,
                        PugToHtml,
                        SassToCss,
                        compressJs,
                        reload,
                        compressImages)

/* команды для gulp */

//передаем галпу, что ему делать при вызове в терминале
exports.html = html;
exports.sass = SassToCss;
exports.build = build;
exports.watch = watch;
exports.default = watch;
