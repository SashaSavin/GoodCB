
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
        css: source_folder + '/sass/*.css',
        sass: source_folder  + '/sass/styles.sass',
        js:  source_folder + '/js/*.js',
        img: 'src/img/*.png',
        fonts: source_folder  + '/fonts/*.ttf'
    },
    watch: {
        html: source_folder  + '/**/*.html',
        sass: source_folder  + '/sass/*.sass',
        css: '/sass/*.css',
        pug: source_folder + '/pug/*.pug', 
        js:  source_folder + '/js/*.js',
        img: 'src/img/*.png',
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
    sass = require('gulp-dart-sass');



/* функции gulp, что он будет делать */

// настройка browser-sync(синхронизация редактора с браузером)
function reload(params) {
    browsersync.init({
        server:{
            baseDir: "./"+ source_folder + "/"
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

// функция для передачи css в prod
function SassToCss(){
    return gulp.src(path.src.sass)
      .pipe(browsersync.stream())
      .pipe(sass().on('error', sass.logError))
      .pipe(dest(path.build.css))
      .pipe(dest('./src/css'))
     
  }


//Передачи картинок в прод
function imgToProd(){
    return src(path.src.img)
     .pipe(browsersync.stream())
     .pipe(gulp.dest(path.build.img))
}

//Передача шрифтов
function FontsToProd(){
    return src(path.src.fonts)
    .pipe(dest(path.build.fonts))
}

//функция для удаления ненужных файлов в dist(prod)
function clean(params){
    return del(clean)
}



//функция для слежки за изменениями([указывать куда следить] что делать)
function watchFiles(){
    gulp.watch([path.watch.html],html),
    gulp.watch([path.watch.pug], PugToHtml),
    gulp.watch([path.watch.sass], SassToCss),
    gulp.watch([path.watch.img], imgToProd),
    gulp.watch([path.watch.fonts], FontsToProd);
   
}


//инициализация фичей, отдельно series и вместе parallel
var build = gulp.series(html);
// сюда добавлять новые таски(функции)
var watch = gulp.parallel(build,
                        watchFiles,
                        PugToHtml,
                        SassToCss,
                        reload,
                        imgToProd,
                        FontsToProd)

/* команды для gulp */

//передаем галпу, что ему делать при вызове в терминале

exports.html = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;
