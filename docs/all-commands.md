# All commands

## append

Add more content to the end of the file.

### Params

| Param   | Description           | Type   |
|---------|-----------------------|:------:|
| file    | The file to append    | string |
| ...args | The content on append | string |

### Return

`string`: The content with append.

### Example

```
// .marvin

append file/text.txt hello world
```

## capitalize

Converts the first character of string to upper case and the remaining to lower case.

### Params

| Param   | Description           | Type   |
|---------|-----------------------|:------:|
| value   | The content           | string |

### Return

`string`: The new value.

### Example

```
// .marvin

capitalize hello
```

## checkbox

A simple checkbox.

![Example](../media/doc/checkbox.gif)

### Params

| Param    | Description           | Type   |
|----------|-----------------------|:------:|
| question | The question          | string |
| ...args  | Options               | string |


### Return

`Array<string>`; A list with items choiced.

### Example

```
//.marvin

$pizza = checkbox "What is your favorite pizza" pepperoni marguerite "four cheese"
log $pizza
```

## choose

A simple choose.

### Params

| Param    | Description           | Type   |
|----------|-----------------------|:------:|
| question | The question          | string |
| ...args  | Options               | string |

### Return

`string`: The item choosed.

### Example

```
//.marvin

$chooseWrong = choose "What is your favorite framework/lib" react angular vue jquery
log $chooseWrong
```

## confirm

A simple choose.

### Params

| Param    | Description             | Type   |
|----------|-------------------------|:------:|
| question | The question to confirm | string |

### Return

`boolean`

### Example

```
//.marvin

$response = confirm "Do you like donuts"
log $response
```

## copy

Copy a file/folder to other place.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| origin   | The origin of file/folder | string |
| dest     | The dest of file/folder   | string |


### Return

`string`: The path of dest.

### Example

```
//.marvin

copy /foo/bar /x/y
```

## create

Create a file/folder

### Options

| Options | Description           | Type   |
|---------|-----------------------|:------:|
| dir     | If this is folder     | void   |

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| name     | The name of file/folder   | string |
| ..args   | The content of file       | string |

### Return

`string`: A new path.

### Example

```
//.marvin

create --dir /foo/bar
// or
$path = create /foo/bar/file.txt hello world
log $path
```

## download

Download a file by url.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| url      | The url of download                | string |
| path     | Where the download it will be done | string |

### Return

`string`: The path where download it will be done.

### Example

```
//.marvin

create --dir /foo/bar
// or
$path = create /foo/bar/file.txt hello world
log $path
```

## each

Executes a provided expression once for each array element.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ...args  | The elements in array              |  any   |

### Return

`any`: The element of array

### Example

```
//.marvin

$item = each 1 2 3 4 5 "test" "hello world" {
  log $item
}
```

## env

Set/Get value of environment.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| variable | The name of variable               | string |
| value    | The value (only when is to set)    | string |

### Return

`string`: The get of variable

### Example

```
//.marvin

// get

env HOME

// set

env VERSION_APP 5.0.x
```

## erro

Log a output on format erro.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ...args  | The content                        |  any   |

### Return 

`void`

### Example

```
// .marvin

erro happened a erro

```

## exist

Verify that exist a folder or file.

### Params

| Param    | Description                        | Type    |
|----------|------------------------------------|:-------:|
| path     | The path of folder or file         |  string |

## Return

`boolean`

### Example

```
//.marvin

$result = exist /dir/root/foo/bar

if $result {
  log Folder exists
}

```

## if

Test a assertion

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ..args   | The conditions                     |  any   |

### Return 

`boolean`

### Example

```
//.marvin

if $number > $number2 && $result === $result2 {
  log hello world
}

```

## input

Collect a input

### Params

| Param    | Description                        | Type    |
|----------|------------------------------------|:-------:|
| question | The question                       |  string |

### Return

`string`: The input

### Example

```
//.marvin

$result = input "What is your name"
```

## interval

Set a interval to expression

### Options

| Options | Description           | Type   |
|---------|-----------------------|:------:|
| count   | The limit of interval | number |

### Params

| Param        | Description                        | Type     |
|--------------|------------------------------------|:--------:|
| milliseconds | The interval                       |  number  |

### Return

`void`

### Example

```
//.marvin

interval 100 {
  log hello
}

interval --count=10 100 {
  log world
}

```

## list

List all folder/files by a path

### Params

| Param        | Description                        | Type     |
|--------------|------------------------------------|:--------:|
| path         | The path                           |  string  |

### Return

`Array<string>`: A list with files/folders

### Examples

```
list /*.jpg
```

## log

Log a output.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ...args  | The content                        |  any   |

### Return 

`void`

### Example

```
// .marvin

log hello world

```

## lower

Converts string to lower case.

### Params

| Param   | Description           | Type   |
|---------|-----------------------|:------:|
| value   | The content           | string |

### Return

`string`: The new value.

### Example

```
// .marvin

lower hello
```

## move

Move a file/folder to other place.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| origin   | The origin of file/folder | string |
| dest     | The dest of file/folder   | string |

### Return

`string`: The path of dest.

### Example

```
//.marvin

move /foo/bar /x/y
```

## notify

## random

Return a random element between.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| ..args   | The elements              | any    |

### Return

`any`: The element.

### Example

```
//.marvin

$result = random 1 2 3 "teste" true 23
```

## read

Read the file.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| path     | The path of file          | string |

### Return

`string`: The content of file.

### Example

```
//.marvin

$world = read /txt/hello/world
```

## remove

Remove the file.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| path     | The path of file          | string |

### Return

`void`

### Example

```
//.marvin

remove /txt/hello/world
```

## repeat

Repeat a expression.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| count    | The count to repeat       | number |

### Return

`void`

### Example

```
//.marvin

repeat 10 {
  log ops
  create /world
}
```

## shell

Execute a command line.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| ..args   | The commands              | any    |

### Return

`void`

### Example

```
//.marvin

shell git checkout -b feature/new-branch
```

## template

Compile template that can interpolate data properties in "interpolate" delimiters.

### Params

| Param    | Description               | Type   |
|----------|---------------------------|:------:|
| ..args   | The properties            | any    |

### Result

`string`: The content compiled.

### Example

```
//.marvin

$content = template --file=/template/hello.tmp var1:"hello world" type:js
```

## timeout

Sets a timer which executes a expression once after the timer expires.

### Params

| Param        | Description                 | Type   |
|--------------|-----------------------------|:------:|
| milliseconds | The milliseconds to execute | number |

### Result

`void`

### Example

```
//.marvin

timeout 10000 {
  create /world
}
```

## unless

Test a negative condition

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ..args   | The conditions                     |  any   |

### Return 

`boolean`

### Example

```
//.marvin

unless true === false {
  log hello world
}

```

## upper

Converts string to upper case.

### Params

| Param   | Description           | Type   |
|---------|-----------------------|:------:|
| value   | The content           | string |

### Return

`string`: The new value.

### Example

```
// .marvin

upper hello
```

## wallpaper

Set/Get a wallpaper

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| path     | The path                           |  any   |

### Return

`string`: The path of wallpaper.

### Example

```
//.marvin

// set
wallpaper /background/foo.jpg

// get
$path = wallpaper
log $path
```

## warn

Log a output on format warn.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| ...args  | The content                        |  any   |

### Return 

`void`

### Example

```
// .marvin

warn happened a warn

```

## watch

Watch for changes on file/folder.

### Params

| Param    | Description                        | Type   |
|----------|------------------------------------|:------:|
| path     | The path to watching change        | string |

### Return

`string`: The path changed.

### Example

```
//.marvin

$path = watch /src/code/*.* {
  log $path
}
```
