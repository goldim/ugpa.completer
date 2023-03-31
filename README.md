# ugpa.completer
The Completer class provides completions based on an item model.
There are two implementations: one is based on `qx.ui.menu.Menu` and another one on `qx.ui.list.List`.
In the future I gonna leave `qx.ui.list.List` implementation because `qx.ui.menu.Menu` lacks some functionality which can't be added.
Inspired by JQuery UI Autocomplete widget and Qt Completer widget.

# TODO
1. Reset settings button in demo example
2. Source list and control panel for it in demo
3. Get rid of menu and list separation - make one widget class
4. Make source as remote url and JSON string
5. Turn on/off icons for autocomplete items