# perf/capture-pages.ps1 - save selected Word pages as PNG (clipboard EMF -> Bitmap)
param([string]$In, [string]$OutDir, [string]$Pages, [string]$Log)

$ErrorActionPreference = 'Continue'
function Log2($m) { if ($Log) { Add-Content -Path $Log -Value $m } ; Write-Output $m }

Log2 "start"
Add-Type -AssemblyName System.Windows.Forms
Log2 "loaded WinForms"
Add-Type -AssemblyName System.Drawing
Log2 "loaded Drawing"

$pageList = @($Pages -split ',' | ForEach-Object { [int]$_.Trim() })
Log2 ("pages requested: " + ($pageList -join ', '))

$word = New-Object -ComObject Word.Application
Log2 "word created"
$word.Visible = $false
$word.DisplayAlerts = 0
$doc = $word.Documents.Open($In, $false, $true, $false)
Log2 "doc opened"
$doc.Repaginate()
Log2 "repaginated"

foreach ($p in $pageList) {
  Log2 ("-- page " + $p)
  $rng = $doc.GoTo(1, 1, $p)
  $rng.Select()
  Log2 "  selected"
  $doc.Bookmarks.Item("\Page").Range.CopyAsPicture()
  Start-Sleep -Milliseconds 700
  Log2 "  copied"

  $file = Join-Path $OutDir ("page-" + $p + ".png")
  try {
    $ms = [System.Windows.Forms.Clipboard]::GetDataObject().GetData('EnhancedMetafile')
    Log2 ("  emf stream: " + $(if ($ms -eq $null) { 'null' } else { $ms.GetType().Name + ' ' + $ms.Length + ' bytes' }))
    $mf = New-Object System.Drawing.Imaging.Metafile -ArgumentList $ms
    $w = [int]$mf.Width
    $h = [int]$mf.Height
    Log2 ("  metafile " + $w + "x" + $h)
    $bmp = New-Object System.Drawing.Bitmap -ArgumentList $w, $h
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($mf, 0, 0, $w, $h)
    $g.Dispose()
    $bmp.Save($file, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $mf.Dispose()
    Log2 ("  saved " + $file)
  } catch {
    Log2 ("  FAILED: " + $_.Exception.GetType().Name + " " + $_.Exception.Message)
  }
}

$doc.Close([ref]0)
Log2 "doc closed"
$word.Quit()
[System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
Log2 "done"
