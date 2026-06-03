Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "..\images\icons"
$targetSize = 128

function IsBlackBg([System.Drawing.Color]$c) {
  if ($c.A -lt 16) { return $true }
  return ($c.R -lt 30 -and $c.G -lt 30 -and $c.B -lt 30)
}

function Load-Bitmap([string]$path) {
  $raw = [System.Drawing.Bitmap]::FromFile($path)
  $maxSide = 320
  if ($raw.Width -gt $maxSide -or $raw.Height -gt $maxSide) {
    $ratio = [Math]::Min($maxSide / $raw.Width, $maxSide / $raw.Height)
    $nw = [Math]::Max(1, [int]($raw.Width * $ratio))
    $nh = [Math]::Max(1, [int]($raw.Height * $ratio))
    $bmp = New-Object System.Drawing.Bitmap $nw, $nh, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($raw, 0, 0, $nw, $nh)
    $g.Dispose(); $raw.Dispose()
    return $bmp
  }
  return $raw
}

function Process-Icon([string]$path) {
  $src = Load-Bitmap $path
  $w = $src.Width; $h = $src.Height
  $out = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      $c = $src.GetPixel($x, $y)
      if (IsBlackBg $c) {
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
      } else {
        $out.SetPixel($x, $y, [System.Drawing.Color]::FromArgb(255, $c.R, $c.G, $c.B))
      }
    }
  }
  $src.Dispose()

  $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
  for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
      if ($out.GetPixel($x, $y).A -gt 10) {
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
  $dest = New-Object System.Drawing.Rectangle 0, 0, $cropW, $cropH
  $srcRect = New-Object System.Drawing.Rectangle $minX, $minY, $cropW, $cropH
  $gc.DrawImage($out, $dest, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $gc.Dispose(); $out.Dispose()

  $final = New-Object System.Drawing.Bitmap $targetSize, $targetSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gf = [System.Drawing.Graphics]::FromImage($final)
  $gf.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $pad = [int]($targetSize * 0.04)
  $box = $targetSize - 2 * $pad
  $scale = [Math]::Min($box / $cropW, $box / $cropH)
  $nw = [int]($cropW * $scale)
  $nh = [int]($cropH * $scale)
  $ox = [int](($targetSize - $nw) / 2)
  $oy = [int](($targetSize - $nh) / 2)
  $gf.DrawImage($crop, $ox, $oy, $nw, $nh)
  $gf.Dispose(); $crop.Dispose()

  $tmp = "$path.tmp.png"
  $final.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
  $final.Dispose()
  Move-Item -Force $tmp $path
}

New-Item -ItemType Directory -Force -Path $dir | Out-Null

$srcBase = Join-Path $PSScriptRoot "..\assets\user-icons"
$map = @{
  "icon-fruit.png"  = "fruit.png"
  "icon-staple.png" = "staple.png"
  "icon-steam.png"  = "steam.png"
  "icon-drink.png"  = "drink.png"
  "icon-grill.png"  = "grill.png"
  "icon-fry.png"    = "fry.png"
  "icon-other.png"  = "other.png"
  "icon-cake.png"   = "cake.png"
}

foreach ($kv in $map.GetEnumerator()) {
  $from = Join-Path $srcBase $kv.Value
  $to = Join-Path $dir $kv.Key
  if (-not (Test-Path $from)) { Write-Host "MISSING $($kv.Value)"; continue }
  Copy-Item -Force $from $to
  Process-Icon $to
  Write-Host "OK $($kv.Key)"
}

Write-Host "All icons ${targetSize}x${targetSize}"
