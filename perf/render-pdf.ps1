# perf/render-pdf.ps1 - export a .docx to PDF using Word COM automation
param([string]$In, [string]$Out)

$ErrorActionPreference = 'Stop'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($In, $false, $true, $false)
  # wdFormatPDF = 17
  $doc.SaveAs([ref]$Out, [ref]17)
  Write-Output ("exported: " + $Out)
  $doc.Close([ref]0)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
