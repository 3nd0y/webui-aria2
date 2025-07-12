Function FindProcessByCommand(keyword)
  Dim wmi, processList, process, result
  Set wmi = GetObject("winmgmts:\\.\root\cimv2")
  Set processList = wmi.ExecQuery("SELECT * FROM Win32_Process")

  result = ""
  For Each process In processList
    If InStr(LCase(process.CommandLine), LCase(keyword)) > 0 Then
      result = result & process.Name & " (PID: " & process.ProcessId & ")" & vbCrLf
    End If
  Next

  If result = "" Then
    FindProcessByCommand = "Not found"
  Else
    FindProcessByCommand = result
  End If
End Function

MsgBox FindProcessByCommand("node-server.js")
MsgBox FindProcessByCommand("aria2.exe")