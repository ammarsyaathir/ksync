# perf/diag-clip.ps1 - inspect clipboard data object types after copy-as-picture
param([string]$In, [int]$Page = 6)

$ErrorActionPreference = 'Continue'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Open($In, $false, $true, $false)
$doc.Repaginate()
$rng = $doc.GoTo(1, 1, $Page)
$rng.Select()
$doc.Bookmarks.Item("\Page").Range.CopyAsPicture()
Start-Sleep -Milliseconds 800

$data = [System.Windows.Forms.Clipboard]::GetDataObject()
foreach ($f in $data.GetFormats()) {
  $obj = $null
  try { $obj = $data.GetData($f) } catch { Write-Output ("  " + $f + " -> GetData threw: " + $_.Exception.Message); continue }
  if ($obj -eq $null) { Write-Output ("  " + $f + " -> null") }
  else { Write-Output ("  " + $f + " -> " + $obj.GetType().FullName) }
}

$doc.Close([ref]0)
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
