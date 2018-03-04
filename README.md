# Marvin

> Create a workflow (simple or complex) with Marvin.

[![Build Status: Linux](https://travis-ci.org/alexandref93/marvin.svg?branch=master)](https://travis-ci.org/alexandref93/marvin)
[![Build status](https://ci.appveyor.com/api/projects/status/3oa2kqlddu42ife5?svg=true)](https://ci.appveyor.com/project/alexandref93/marvin)
[![Coverage Status](https://coveralls.io/repos/github/alexandref93/marvin/badge.svg?branch=master)](https://coveralls.io/github/alexandref93/marvin?branch=master)

**The project is still in alpha phase.**

# Contents

- [Install](#install)
- [Usage](#usage)
- [CLI Usage](#cli)

## Install

With yarn:

```
yarn add marvin-cli
// or
yarn global add marvin-cli
````

With npm:

```
npm install marvin-cli
// or
npm install marvin-cli --global
```

## Usage

```
// .marvin on project folder

copy /path/oldFile /path/newFile
move /path/earth /path/mars
```

On terminal:
```
$ marvin
```

## CLI

```shellscript
$ marvin --help

  Usage: marvin [file ...] [options]

  Create a complex workflow in a simpler way


  Options:

    -h, --help  output usage information


  How use the Marvin, step-by-step:


     1. : Create um file with name .marvin and these content below

          $content = watch ./src/file --async {
            log file changed
          }


     2. : Run the file

          marvin
```

MIT © [Carlos Alexandre Fuechter](https://github.com/alexandref93)