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

marked.setOptions({
    pedantic: true,
    smartypants: true
});

gulp.task('del', () => {
    try {
        fs.statSync('./dist');
    } catch {
        fs.mkdirSync('./dist');
    }
    return del(['./dist/*', '!./dist']);
});

gulp.task('handlebars', (done) => {
    ['partials/header', 'partials/footer', 'templates/base'].forEach(name => {
        fs.readFile('./src/views/' + name + '.hbs', 'utf8', (err, templateString) => {
            handlebars.registerPartial(name, templateString);
        });
    });
    done();
});

gulp.task('pages', (done) => {
    let template;
    fs.readFile('./src/views/templates/page.hbs', 'utf8', (err, templateString) => {
        template = handlebars.compile(templateString);
        return gulp.src('./src/content/**/*.md')
            .pipe(markdown(marked))
            .pipe(tap((file, t) => {
                file.contents = Buffer.from(template(JSON.parse(file.contents.toString())));
            })).pipe(rename({
                extname: '.html'
            })).pipe(gulp.dest('./dist'))
            .on('finish', () => {
                done();
            });
    });
});

gulp.task('chapters', (done) => {
    let directory = {},
        template;
    directory['title'] = 'Super duper testing';
    directory['chapters'] = {};
    fs.readFile('./src/views/templates/chapter.hbs', 'utf8', (err, templateString) => {
        template = handlebars.compile(templateString);
        return gulp.src('./src/content/**/*.md')
            .pipe(tap((file, t) => {
                let relativePath = path.relative(__dirname + '/src/content', file.path);
                let relativeArray = relativePath.split(path.sep);

                if (relativeArray.length >= 3) {
                    throw new Error('only files one folder deep are allowed.');
                }
                if (!(relativeArray[0] in directory['chapters'])) {
                    directory['chapters'][relativeArray[0]] = [];
                }
                directory['chapters'][relativeArray[0]].push(relativeArray[1]);
            })).on('finish', () => {
                console.log(directory);
                let html = template(directory);
                fs.writeFile('./dist/index.html', html, (err) => {
                    if (err) {
                        throw err;
                    } else {
                        return done();
                    }
                });
            });
    });

});

gulp.task('default', gulp.series('del', 'handlebars', gulp.parallel('chapters', 'pages')));
