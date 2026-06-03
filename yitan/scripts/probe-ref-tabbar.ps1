Add-Type -AssemblyName System.Drawing
$ref = Join-Path $PSScriptRoot "..\images\tab\ref-tabbar.png"
$b = [System.Drawing.Bitmap]::FromFile($ref)

function Find-OrangeBox([int]$x0, [int]$x1, [int]$y0, [int]$y1) {
  $minX = 9999; $maxX = 0; $minY = 9999; $maxY = 0
  for ($y = $y0; $y -le $y1; $y++) {
    for ($x = $x0; $x -le $x1; $x++) {
      $c = $b.GetPixel($x, $y)
      if ($c.A -gt 120 -and $c.R -gt 160 -and $c.G -gt 60 -and $c.B -lt 180) {
        if ($x -lt $minX) { $minX = $x }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  if ($minX -lt 9999) {
    Write-Host "x=$minX y=$minY w=$($maxX-$minX+1) h=$($maxY-$minY+1)"
  }
}

Write-Host "home with underline:"
Find-OrangeBox 40 110 55 120

$b.Dispose()
