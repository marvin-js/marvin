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

## confirm

## copy

## create

## download

## each

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