#!/bin/bash

set -ev

mkdir "./src/content/1. Introduction"

touch "./src/content/1. Introduction/page-1.md"
cat <<EOT > "./src/content/1. Introduction/page-1.md"
---
prev:
next: Page 2
chapter: Page 1
title: Page 1
---
## Page 1 Title
EOT

touch "./src/content/1. Introduction/page-2.md"
cat <<EOT > "./src/content/1. Introduction/page-2.md"
---
prev: Page 1
next:
chapter: Page 1
title: Page 2
---
## Page 2 Title
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
