# Workflow

> This project is experimental for now, so it's still simple. Soon will have more updates.

[![Build Status: Linux](https://travis-ci.org/alexandref93/workflow.svg?branch=master)](https://travis-ci.org/alexandref93/workflow) 

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