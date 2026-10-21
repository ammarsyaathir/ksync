# perf/report-layout.ps1 - verify page geometry of tables and inline figures
param([string]$In)

$ErrorActionPreference = 'Stop'
$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
  $doc = $word.Documents.Open($In, $false, $true, $false)
  $doc.Repaginate()

  $ps = $doc.PageSetup
  Write-Output ("page: " + [math]::Round($ps.PageWidth,1) + " x " + [math]::Round($ps.PageHeight,1) + " pt   margins T" + [math]::Round($ps.TopMargin,1) + " B" + [math]::Round($ps.BottomMargin,1) + " L" + [math]::Round($ps.LeftMargin,1) + " R" + [math]::Round($ps.RightMargin,1))
  $textW = $ps.PageWidth - $ps.LeftMargin - $ps.RightMargin
  $textH = $ps.PageHeight - $ps.TopMargin - $ps.BottomMargin
  Write-Output ("text area: " + [math]::Round($textW,1) + " x " + [math]::Round($textH,1) + " pt")
  Write-Output ("pages: " + $doc.ComputeStatistics(2) + "   inline shapes: " + $doc.InlineShapes.Count + "   tables: " + $doc.Tables.Count)

  Write-Output ""
  Write-Output "--- inline figures (wdVerticalPositionRelativeToPage = 6) ---"
  $bad = 0
  for ($i = 1; $i -le $doc.InlineShapes.Count; $i++) {
    $s = $doc.InlineShapes.Item($i)
    $pg  = $s.Range.Information(3)
    $top = [math]::Round($s.Range.Information(6), 1)
    $w = [math]::Round($s.Width, 1)
    $h = [math]::Round($s.Height, 1)
    $bottom = $top + $h
    $fitsW = $w -le ($textW + 1)
    $fitsH = $bottom -le ($ps.PageHeight - $ps.BottomMargin + 1)
    if (-not ($fitsW -and $fitsH)) { $bad++ }
    Write-Output ("  fig " + $i + "  page " + $pg + "  top " + $top + "pt  " + $w + "x" + $h + "pt  bottom " + $bottom + "pt  width " + $(if($fitsW){'ok'}else{'*** OVERFLOW'}) + "  height " + $(if($fitsH){'ok'}else{'*** OVERFLOW'}) + "  (" + [math]::Round($w/72,2) + "in x " + [math]::Round($h/72,2) + "in)")
  }
  Write-Output ("  overflow problems: " + $bad)

  Write-Output ""
  Write-Output "--- tables ---"
  for ($i = 1; $i -le $doc.Tables.Count; $i++) {
    $t = $doc.Tables.Item($i)
    Write-Output ("  table " + $i + "  page " + $t.Range.Information(3) + "  rows " + $t.Rows.Count + "  first cell: " + $t.Cell(1,1).Range.Text.Trim())
  }

  $doc.Close([ref]0)
} finally {
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
}
