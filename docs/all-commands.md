# All commands

## append

Add more content to the end of the file.

### Params

| Param   | Description           | Type   |
|---------|-----------------------|:------:|
| file    | The file to append    | string |
| ...args | The content on append | string |

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

## erro

## exist

## if

## input

## interval

## list

## log

## lower

## move

## notify

## random

## read

## remove

## repeat

## shell

## template

## timeout

## unless

## upper

## wallpaper

## warn

## watch