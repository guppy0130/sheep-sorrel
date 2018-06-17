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
const prefixer = require('gulp-autoprefixer');

let directory = {
    title: 'Book Title',
    chapters: {},
    order: [],
    current: '',
    indexImage: false
};

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
    let directoryCopy = JSON.parse(JSON.stringify(directory));

    let linkify = (link) => {
        return ((link == null) ? null : link.toLowerCase().replace(/\s/gi, '-'));
    };

    ['partials/header', 'partials/footer', 'templates/base'].forEach(name => {
        fs.readFile('./src/views/' + name + '.hbs', 'utf8', (err, templateString) => {
            handlebars.registerPartial(name, templateString);
        });
    });

    handlebars.registerHelper('linkify', (input) => {
        return linkify(input);
    });

    fs.readFile('./src/views/templates/page.hbs', 'utf8', (err, templateString) => {
        let template = handlebars.compile(templateString);
        return gulp.src('./src/content/**/*.md')
            .pipe(markdown(marked))
            .pipe(tap((file, t) => {
                let data = JSON.parse(file.contents.toString());
                file.contents = Buffer.from(template(data));

                let relativeArray = path.relative(__dirname + '/src/content', file.path).split(path.sep);

                if (relativeArray.length >= 3) {
                    throw new Error('only files one folder deep are allowed.');
                }
                let canon = relativeArray[0].slice(3);
                if (!(canon in directoryCopy['chapters'])) {
                    directoryCopy['order'][relativeArray[0][0]] = canon; //uses the first character of folder name to place element in array
                    directoryCopy['chapters'][canon] = [];
                }
                let current = data.title || relativeArray[1].replace('.json', '');
                directoryCopy.current = current;
                directoryCopy['chapters'][canon].push(current);
            }))
            .pipe(rename(path => {
                path.dirname = linkify(path.dirname.slice(3));
                path.basename = linkify(directoryCopy.current);
                path.extname = '.html';
                directoryCopy.current = '';
            }))
            .pipe(gulp.dest('./dist'))
            .on('finish', () => {
                let newOrder = [];
                for (let i = 0; i < directoryCopy.order.length; i++) {
                    if (directoryCopy.order[i] != null) {
                        newOrder.push(directoryCopy.order[i]);
                    }
                }
                directoryCopy.order = newOrder;
                fs.readFile('./src/views/templates/chapter.hbs', 'utf8', (err, templateString) => {
                    let template = handlebars.compile(templateString);
                    console.log(directoryCopy);
                    fs.writeFile('./dist/index.html', template(directoryCopy), err => {
                        if (err) {
                            throw err;
                        } else {
                            done();
                        }
                    });
                });
            });
    });
});

gulp.task('sass', () => {
    return gulp.src('./src/**/*.scss')
        .pipe(sass({
            outputStyle: 'compressed'
        }))
        .pipe(prefixer())
        .pipe(gulp.dest('./dist'));
});

gulp.task('images', () => {
    return gulp.src('./src/content/**/*.{jpg,png}')
        .pipe(tap((file, t) => {
            console.log(path.relative(__dirname + '/src/content', file.path));
            if (path.relative(__dirname + '/src/content', file.path) === 'index.jpg') {
                directory.indexImage = true;
            }
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('reload', (done) => {
    browserSync.reload();
    done();
});

gulp.task('default', gulp.series('del', 'images', gulp.parallel('pages', 'sass'), () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: hygienist('dist')
        }
    });
    gulp.watch(['./src/**/*.scss'], gulp.series('sass', 'reload'));
    gulp.watch(['./src/**/*.{hbs,md}'], gulp.series('pages', 'reload'));
}));

gulp.task('test', gulp.series('images', gulp.parallel('pages', 'sass'), () => {
    browserSync.init({
        server: {
            baseDir: './dist',
            middleware: hygienist('dist'),
        },
        open: false,
        notify: false
    });
}));
