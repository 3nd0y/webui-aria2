Option Explicit

Dim shell, wmi, processList, proc
Set shell = CreateObject("WScript.Shell")
Set wmi = GetObject("winmgmts:\\.\root\cimv2")

' Cari dan kill proses yang mengandung node-server.js
KillProcessByKeyword "node-server.js"

' Cari dan kill proses dengan nama aria2c.exe
KillProcessByName "aria2c.exe"

Sub KillProcessByKeyword(keyword)
    Dim found, pid, cmdLine
    found = False

    Set processList = wmi.ExecQuery("SELECT * FROM Win32_Process")
    For Each proc In processList
        cmdLine = ""
        On Error Resume Next
        cmdLine = proc.CommandLine
        On Error GoTo 0

        If Not IsNull(cmdLine) And InStr(LCase(cmdLine), LCase(keyword)) > 0 Then
            pid = proc.ProcessId
            WScript.Echo "Menghentikan proses PID " & pid & " yang mengandung '" & keyword & "'"
            shell.Run "taskkill /PID " & pid & " /F", 0, True
            found = True
        End If
    Next

    If Not found Then
        WScript.Echo "Tidak ditemukan proses yang mengandung '" & keyword & "'"
    End If
End Sub

Sub KillProcessByName(procName)
    Dim found, pid
    found = False

    Set processList = wmi.ExecQuery("SELECT * FROM Win32_Process WHERE Name='" & procName & "'")
    For Each proc In processList
        pid = proc.ProcessId
        WScript.Echo "Menghentikan proses " & procName & " PID " & pid
        shell.Run "taskkill /PID " & pid & " /F", 0, True
        found = True
    Next

    If Not found Then
        WScript.Echo "Tidak ditemukan proses dengan nama '" & procName & "'"
    End If
End Sub
