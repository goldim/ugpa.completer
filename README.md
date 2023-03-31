# ugpa.completer
The Completer class provides completions based on an item model.
There are two implementations: one is based on `qx.ui.menu.Menu` and another one on `qx.ui.list.List`.
In the future I gonna leave `qx.ui.list.List` implementation because `qx.ui.menu.Menu` lacks some functionality which can't be added.
Inspired by JQuery UI Autocomplete widget and Qt Completer widget.

# example of usage
See Application Demo file.

# TODO
1. Get rid of menu and list separation - make one widget class
2. Make source as remote url and JSON string
3. Turn on/off icons for autocomplete items