# Sheep-Sorrel

## A Pollen-inspired book-generator in JS

### Installation
* `git clone` this repo
* `npm i` the dependencies
* `npm start` or `gulp` to compile `src` to `dist`

### Entry Point Summary
| I want to change...       | Modify                            |
|---------------------------|-----------------------------------|
| Book title                | `gulpfile.js::directory.title`    |
| Content                   | `src/content`                     |
| Fonts/colors/breakpoints  | `src/styles`                      |
| Cover image               | `src/content/index.jpg`           |
| Header/footer             | `src/views/partials`              |
| Markup                    | `gulpfile.js::marked`             |

### Writing
Set the book title in the variable `directory` in `gulpfile.js`.

Place content in `src/content`. Number folders (`1. *title*`, `2. *title*`, etc.). Hope that the `gulpfile` takes care of your folders in the order specified. Currently only supports Markdown. These `*title*`s will become the chapter names.

Will throw an error if Markdown files are more than 1 folder deep in `src/content`. This means `src/content/folder-1/okay.md` works, but `src/content/folder-1/oh-no/help.md` won't. This is intentional.

The top of each Markdown file *must* start with
```markdown
---
prev: {the previous page}
next: {the next page}
chapter: {the chapter-top page}
title: {your title}
---
```
otherwise the footer will not work as expected.

### Styling
Don't like the default styles? Modify `src/styles/_user.scss`. Available options:
* font
* sans and sans-serif font stacks
* background, text, accent, and border colors
* CSS breakpoints

You may also opt to modify `src/views/partials/{header,footer}.hbs` to add your own custom headers/footers to pages, respectively.

### Images
Place an image named `index.jpg` at the root of `src/content` for a cover image. Responsive images coming soon.

### Deployment
Deploy the `dist` folder to a static provider of your choice (my favorite is [surge.sh](surge.sh)).