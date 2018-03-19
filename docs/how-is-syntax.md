# How is the syntax?

## A command with params

```
command params1 params2 params3
```

## A command with params and options

```
command params1 --options1=value params2 --options2=test
```

## A command with set variables

```
$variable = command param1
```

**ps:** variable ever has the prefix $

## A command with expression

```
command param1 param2 {
  command2 param3 param4
}
```

## All command have a option to async

```
command param1 --async {
  log hello world
}

command2 param2
```

## Summing up

```
$items = command param1 --async {
  $item = each $items {
    log $item
  }
}

log hello world
```