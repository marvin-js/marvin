<p align="center">
  <img src="media/logo_slogan.png" />
</p>

<p align="center">
  <a href="https://travis-ci.org/marvin-js/marvin"><img src="https://travis-ci.org/marvin-js/marvin.svg?branch=master" alt="Build Status: Linux" /></a>
  <a href="https://ci.appveyor.com/project/alexandref93/marvin-yxg1f"><img src="https://ci.appveyor.com/api/projects/status/fp3rxxadd0ss2vn5?svg=true" alt="Build Status: Windows" /></a>
  <a href="https://coveralls.io/github/marvin-js/marvin?branch=master"><img src="https://coveralls.io/repos/github/marvin-js/marvin/badge.svg?branch=master" alt="Coverage Status" /></a>
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="GitHub license" />
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" />
</p>

> Create a workflow (simple or complex) with Marvin.

**The project is still in beta phase.**

# Contents

- [Install](#install)
- [Usage](#usage)
- [CLI Usage](#cli)
- [Philosophy](#philosophy)
- [API Doc](#api-doc)
- [FAQ](#faq)
- [Contributing](#contributing)

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

  Usage: marvin [options] [file ...]

  Create a complex workflow in a simpler way


  Options:

    -v, --version   output the version number
    -d --dir <dir>  root directory where files marvins will be search
    -h, --help      output usage information


  Commands:

    init        create a .marvin.yml. case the command is global, the file will created on $HOME, otherwhise on project root
    add         add a packet to .marvin.yml
    help [cmd]  display help for [cmd]


  How use the Marvin, step-by-step:


     1. : Create um file with name .marvin and these content below

          $content = watch ./src/file --async {
            log file changed
          }


     2. : Run the file

          marvin
```

## Philosophy

No, is not a new programming language, is only a script, with objective to help create a workflow on day to day. Without panic, of course.

### How is the syntax?

Read [this doc](docs/how-is-syntax.md).

## API Doc

Read [this doc](docs/all-commands.md).

## FAQ

Do you have more doubts? Please, [open a issue](https://github.com/marvin-js/marvin/issues/new) and we will discuss :)

### How create a new plugin?

Please take a look at [this boilerplate](https://github.com/marvin-js/boilerplate-marvin-plugin).

### What is a packet?

Is a package with set of plugins.

### How create a new packet?

Please take a look at [this boilerplate](https://github.com/marvin-js/boilerplate-marvin-packet).

## Contributing

Please read [CONTRIBUTING.md](.github/CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.

<p align="center">
  <img src="media/logo.png" / >
</p>

<p align="center">
 MIT © <a href="https://github.com/alexandref93">Carlos Alexandre Fuechter</a>
</p>
