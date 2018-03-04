# Workflow

> This project is experimental for now, so it's still simple. Soon will have more updates.

[![Build Status: Linux](https://travis-ci.org/alexandref93/workflow.svg?branch=master)](https://travis-ci.org/alexandref93/workflow)
[![Build status](https://ci.appveyor.com/api/projects/status/3oa2kqlddu42ife5?svg=true)](https://ci.appveyor.com/project/alexandref93/workflow)
[![Coverage Status](https://coveralls.io/repos/github/alexandref93/workflow/badge.svg?branch=master)](https://coveralls.io/github/alexandref93/workflow?branch=master)

Create a workflow with a simple file.

## Usage

```
// .workflow on project folder

cp /path/oldFile /path/newFile
mv /path/earth /path/mars
```

On terminal:
```
$ workflow
```

## Future usage

```
// .workflow

$newPath = cp /path/earth /path/mars
watch $newPath
  log new update
```

MIT © [Carlos Alexandre Fuechter](https://github.com/alexandref93)