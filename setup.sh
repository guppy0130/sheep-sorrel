#!/bin/bash

set -ev

# create a random cover
mx=320;my=256;head -c "$((3*mx*my))" /dev/urandom | convert -depth 8 -size "${mx}x${my}" RGB:- ./src/content/index.jpg

mkdir "./src/content/1. Introduction"

touch "./src/content/1. Introduction/page-1.md"
cat <<EOT > "./src/content/1. Introduction/page-1.md"
---
prev:
next: Page 2
chapter: Page 1
title: Page 1
---
some content from page one
EOT

touch "./src/content/1. Introduction/page-2.md"
cat <<EOT > "./src/content/1. Introduction/page-2.md"
---
prev: Page 1
next:
chapter: Page 1
title: Page 2
---
some content from page two
EOT

mkdir "./src/content/2. Chapter 1"

touch "./src/content/2. Chapter 1/page-2-1.md"
cat <<EOT > "./src/content/2. Chapter 1/page-2-1.md"
---
prev:
next:
chapter: Title of Chapter 1
title: Title of Chapter 1
---
## How Writing E2E Tests is Harder than Expected

lorem ipsum content
EOT
