# Marvin

> Create a workflow (simple or complex) with Marvin.

[![Build Status: Linux](https://travis-ci.org/marvin-js/marvin.svg?branch=master)](https://travis-ci.org/marvin-js/marvin)
[![Build Status: Windows](https://ci.appveyor.com/api/projects/status/fp3rxxadd0ss2vn5?svg=true)](https://ci.appveyor.com/project/alexandref93/marvin-yxg1f)
[![Coverage Status](https://coveralls.io/repos/github/marvin-js/marvin/badge.svg?branch=master)](https://coveralls.io/github/marvin-js/marvin?branch=master)

**The project is still in alpha phase.**

# Contents

- [Install](#install)
- [Usage](#usage)
- [CLI Usage](#cli)
- [Roadmap](#roadmap)

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

## Roadmap

- Document all possible commands
- Allow development plugin
- Allow more verbose logs
- Add more commands like: fetch, template, ftp, git, etc.


MIT © [Carlos Alexandre Fuechter](https://github.com/alexandref93)
