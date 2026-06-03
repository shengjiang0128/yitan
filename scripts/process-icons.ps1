Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "..\images\icons"
$targetSize = 128
$files = @(
  "icon-fruit.png", "icon-staple.png", "icon-steam.png", "icon-cake.png",
  "icon-drink.png", "icon-grill.png", "icon-fry.png", "icon-other.png"
)

function ColorDist([System.Drawing.Color]$a, [System.Drawing.Color]$b) {
  $dr = $a.R - $b.R; $dg = $a.G - $b.G; $db = $a.B - $b.B
  return [Math]::Sqrt($dr * $dr + $dg * $dg + $db * $db)
}

function IsBgLike([System.Drawing.Color]$c) {
  if ($c.A -lt 20) { return $true }
  $avg = ($c.R + $c.G + $c.B) / 3.0
  if ($avg -lt 35) { return $true }
  if ($avg -gt 235) { return $true }
  if ($avg -gt 170 -and $avg -lt 245 -and [Math]::Abs($c.R - $c.G) -lt 18 -and [Math]::Abs($c.G - $c.B) -lt 18) { return $true }
  return $false
}

function Load-Bitmap([string]$path) {
  $raw = [System.Drawing.Bitmap]::FromFile($path)
  $maxSide = 640
  if ($raw.Width -le $maxSide -and $raw.Height -le $maxSide) { return $raw }
  $ratio = [Math]::Min($maxSide / $raw.Width, $maxSide / $raw.Height)
  $nw = [int]($raw.Width * $ratio)
  $nh = [int]($raw.Height * $ratio)
  $bmp = New-Object System.Drawing.Bitmap $nw, $nh, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.DrawImage($raw, 0, 0, $nw, $nh)
  $g.Dispose(); $raw.Dispose()
  return $bmp
}

function Remove-Background([System.Drawing.Bitmap]$src) {
  $w = $src.Width; $h = $src.Height
  $vis = New-Object 'bool[,]' $w, $h
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) { $vis[$x, $y] = $false }
  }
  $q = New-Object System.Collections.Generic.Queue[object]
  function Enqueue([int]$x, [int]$y) {
    if ($x -lt 0 -or $y -lt 0 -or $x -ge $w -or $y -ge $h) { return }
    if ($vis[$x, $y]) { return }
    $c = $src.GetPixel($x, $y)
    if (-not (IsBgLike $c)) { return }
    $vis[$x, $y] = $true
    $q.Enqueue(@($x, $y))
  }
  for ($x = 0; $x -lt $w; $x++) { Enqueue $x 0; Enqueue $x ($h - 1) }
  for ($y = 0; $y -lt $h; $y++) { Enqueue 0 $y; Enqueue ($w - 1) $y }
  while ($q.Count -gt 0) {
    $p = $q.Dequeue()
    $cx = $p[0]; $cy = $p[1]
    $base = $src.GetPixel($cx, $cy)
    foreach ($d in @(@(1,0), @(-1,0), @(0,1), @(0,-1))) {
      $nx = $cx + $d[0]; $ny = $cy + $d[1]
      if ($nx -lt 0 -or $ny -lt 0 -or $nx -ge $w -or $ny -ge $h) { continue }
      if ($vis[$nx, $ny]) { continue }
      $nc = $src.GetPixel($nx, $ny)
      if ((IsBgLike $nc) -or (ColorDist $nc $base) -lt 42) {
        $vis[$nx, $ny] = $true
        $q.Enqueue(@($nx, $ny))
      }
    }
  }
  $out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      if ($vis[$x, $y]) {
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      } else {
        $c = $src.GetPixel($x, $y)
        if (IsBgLike $c) {
          $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
        } else {
          $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
        }
      }
    }
  }
  return $out
}

function Crop-And-Resize([System.Drawing.Bitmap]$src, [int]$size) {
  $w = $src.Width; $h = $src.Height
  $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      if ($src.GetPixel($x, $y).A -gt 8) {
        if ($x -lt $minX) { $minX = $x }
        if ($y -lt $minY) { $minY = $y }
        if ($x -gt $maxX) { $maxX = $x }
        if ($y -gt $maxY) { $maxY = $y }
      }
    }
  }
  $cropW = $maxX - $minX + 1
  $cropH = $maxY - $minY + 1
  $crop = New-Object System.Drawing.Bitmap $cropW, $cropH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gc = [System.Drawing.Graphics]::FromImage($crop)
  $gc.DrawImage($src, (New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH), (New-Object System.Drawing.Rectangle $minX, $minY, $cropW, $cropH), [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose()
  $final = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gf = [System.Drawing.Graphics]::FromImage($final)
  $gf.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $padding = [int]($size * 0.02)
  $box = $size - 2 * $padding
  $scale = [Math]::Min($box / $cropW, $box / $cropH)
  $nw = [int]($cropW * $scale)
  $nh = [int]($cropH * $scale)
  $ox = [int](($size - $nw) / 2)
  $oy = [int](($size - $nh) / 2)
  $gf.DrawImage($crop, $ox, $oy, $nw, $nh)
  $gf.Dispose(); $crop.Dispose()
  return $final
}

foreach ($f in $files) {
  $p = Join-Path $dir $f
  if (-not (Test-Path $p)) { continue }
  $src = Load-Bitmap $p
  $cut = Remove-Background $src
  $src.Dispose()
  $final = Crop-And-Resize $cut $targetSize
  $cut.Dispose()
  $tmp = "$p.tmp.png"
  $final.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $final.Dispose()
  Move-Item -Force $tmp $p
  Write-Host "OK $f"
}

Write-Host "Done ${targetSize}x${targetSize} transparent icons"
