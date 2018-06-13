# Sheep-Sorrel

## A Pollen-inspired book-generator in JS

### Installation
* `git clone` this repo
* `npm i` the dependencies
* `npm start` or `gulp` to compile `src` to `dist`

### Writing
Place content in `src/content`. Number folders (1. *title*, 2. *title*, etc.). Hope that the `gulpfile` takes care of your folders in the order specified. Currently only supports Markdown. 

Will throw an error if Markdown files are more than 1 folder deep in `src/content`. This means `src/content/folder-1/okay.md` works, but `src/content/folder-1/oh-no/help.md` will break a lot of everything.

The top of each Markdown file *must* start with
```markdown
---
prev: testing-1
next: testing-3
chapter: testing-1
title: A Really Good Title
---
```
otherwise things will start to suck really quickly.

### Styling
Don't like the default styles? Modify `src/styles/user.scss`.

### Deployment
Deploy the `dist` folder to a static provider of your choice (my favorite is [surge.sh](surge.sh)).