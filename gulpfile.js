const del = require('del');
const gulp = require('gulp');
const marked = require('marked');
const markdown = require('gulp-markdown-to-json');
const sass = require('gulp-sass');
const fs = require('fs');
const handlebars = require('handlebars');
const rename = require('gulp-rename');
const tap = require('gulp-tap');
const path = require('path');
const browserSync = require('browser-sync');
const hygienist = require('hygienist-middleware');

marked.setOptions({
    pedantic: true,
    smartypants: true
});

gulp.task('del', () => {
    try {
        fs.statSync('./dist');
    } catch (e) {
        fs.mkdirSync('./dist');
    }
    return del(['./dist/*', '!./dist']);
});

gulp.task('pages', (done) => {
    ['partials/header', 'partials/footer', 'templates/base'].forEach(name => {
        fs.readFile('./src/views/' + name + '.hbs', 'utf8', (err, templateString) => {
            handlebars.registerPartial(name, templateString);
        });
    });

    let directory = {
        title: 'Book Title',
        chapters: {},
        order: []
    };

    fs.readFile('./src/views/templates/page.hbs', 'utf8', (err, templateString) => {
        let template = handlebars.compile(templateString);
        return gulp.src('./src/content/**/*.md')
            .pipe(markdown(marked))
            .pipe(rename({
                extname: '.html'
            }))
            .pipe(tap((file, t) => {
                let data = JSON.parse(file.contents.toString());
                file.contents = Buffer.from(template(data));

                let relativeArray = path.relative(__dirname + '/src/content', file.path).split(path.sep);

                if (relativeArray.length >= 3) {
                    throw new Error('only files one folder deep are allowed.');
                }
                let canon = relativeArray[0].slice(3);
                if (!(canon in directory['chapters'])) {
                    directory['order'][relativeArray[0][0]] = canon;
                    directory['chapters'][canon] = [];
                }
                directory['chapters'][canon].push(data.title || relativeArray[1]);
            }))
            .pipe(gulp.dest('./dist'))
            .on('finish', () => {
                let newOrder = [];
                for (let i = 0; i < directory.order.length; i++) {
                    if (directory.order[i] != null) {
                        newOrder.push(directory.order[i]);
                    }
                }
                directory.order = newOrder;
                fs.readFile('./src/views/templates/chapter.hbs', 'utf8', (err, templateString) => {
                    let template = handlebars.compile(templateString);
                    console.log(directory);
                    fs.writeFile('./dist/index.html', template(directory), err => {
                        if (err) {
                            throw err;
                        } else {
                            done();
                        }
                    });
                });
                done();
            });
    });
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./dist'));
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('default', gulp.series('del', gulp.parallel( 'pages', 'sass'), () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: hygienist('dist')
        }
    });
    gulp.watch(['./src/**/*.sass'], gulp.series('sass', 'reload'));
    gulp.watch(['./src/**/*.(hbs|md)'], gulp.series('pages', 'reload'));
}));
