Add-Type -AssemblyName System.Drawing

$ref = Join-Path $PSScriptRoot "..\images\tab\ref-tabbar.png"
$outDir = Join-Path $PSScriptRoot "..\images\tab"
New-Item -ItemType Directory -Force -Path $outDir | Out-Null

function Crop-Pad([System.Drawing.Bitmap]$src, [int]$x, [int]$y, [int]$w, [int]$h, [int]$pad, [int]$outW, [int]$outH, [string]$path) {
  $x0 = [Math]::Max(0, $x - $pad)
  $y0 = [Math]::Max(0, $y - $pad)
  $x1 = [Math]::Min($src.Width - 1, $x + $w + $pad - 1)
  $y1 = [Math]::Min($src.Height - 1, $y + $h + $pad - 1)
  $cw = $x1 - $x0 + 1
  $ch = $y1 - $y0 + 1

  $crop = New-Object System.Drawing.Bitmap $cw, $ch, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($crop)
  $g.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $dest = New-Object System.Drawing.Rectangle 0, 0, $cw, $ch
  $srcRect = New-Object System.Drawing.Rectangle $x0, $y0, $cw, $ch
  $g.DrawImage($src, $dest, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()

  $final = New-Object System.Drawing.Bitmap $outW, $outH, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $gf = [System.Drawing.Graphics]::FromImage($final)
  $gf.Clear([System.Drawing.Color]::FromArgb(0, 0, 0, 0))
  $gf.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $scale = [Math]::Min($outW / $cw, $outH / $ch)
  $dw = [int]($cw * $scale)
  $dh = [int]($ch * $scale)
  $ox = ($outW - $dw) / 2
  $oy = ($outH - $dh) / 2
  $gf.DrawImage($crop, $ox, $oy, $dw, $dh)
  $gf.Dispose()
  $crop.Dispose()
  $final.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $final.Dispose()
}

$src = [System.Drawing.Bitmap]::FromFile($ref)

# Auto-detected from ref-tabbar.png (773x152)
Crop-Pad $src 56 60 44 40 6 96 96 (Join-Path $outDir "icon-home.png")
Crop-Pad $src 56 60 44 39 4 96 96 (Join-Path $outDir "icon-home-inactive.png")
Crop-Pad $src 206 58 44 44 6 96 96 (Join-Path $outDir "icon-discover.png")
Crop-Pad $src 308 0 136 104 4 224 224 (Join-Path $outDir "icon-ai.png")
Crop-Pad $src 509 57 38 43 6 96 96 (Join-Path $outDir "icon-notify.png")
Crop-Pad $src 661 60 34 41 6 96 96 (Join-Path $outDir "icon-profile.png")

$src.Dispose()
Write-Host "Cropped tab icons from reference"
