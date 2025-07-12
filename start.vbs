Set shell = CreateObject("WScript.Shell")

' Jalankan node server tanpa jendela cmd muncul
shell.Run "node node-server.js", 0, False

' Jalankan aria2c tanpa jendela cmd muncul
shell.Run "aria2c --conf-path aria2.conf", 0, False

WScript.Echo "Node server dan aria2c dijalankan."
