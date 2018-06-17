#!/bin/bash

# set -ev

mkdir "../src/content/1. Introduction"

touch "../src/content/1. Introduction/page-1.md"
echo "---" > "../src/content/1. Introduction/page-1.md"
echo "prev:" > "../src/content/1. Introduction/page-1.md"
echo "next: Page 2" > "../src/content/1. Introduction/page-1.md"
echo "chapter: Page 1" > "../src/content/1. Introduction/page-1.md"
echo "title: Page 1" > "../src/content/1. Introduction/page-1.md"
echo "---" > "../src/content/1. Introduction/page-1.md"
echo "## Page 1 Title" > "../src/content/1. Introduction/page-1.md"

touch "../src/content/1. Introduction/page-2.md"
echo "---" > "../src/content/1. Introduction/page-2.md"
echo "prev: Page 1" > "../src/content/1. Introduction/page-2.md"
echo "next:" > "../src/content/1. Introduction/page-2.md"
echo "chapter: Page 1" > "../src/content/1. Introduction/page-2.md"
echo "title: Page 2" > "../src/content/1. Introduction/page-2.md"
echo "---" > "../src/content/1. Introduction/page-2.md"
echo "## Page 2 Title" > "../src/content/1. Introduction/page-2.md"
