# 用法（PowerShell）：
#   .\scripts\push-to-github.ps1
#   .\scripts\push-to-github.ps1 -RepoUrl "https://github.com/其他用户/其他仓库.git"
param(
  [string]$RepoUrl = "https://github.com/shengjiang0128/yitan.git"
)

$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
Set-Location $root

function Find-Git {
  $candidates = @(
    "git",
    "$env:ProgramFiles\Git\cmd\git.exe",
    "${env:ProgramFiles(x86)}\Git\cmd\git.exe",
    "$env:LOCALAPPDATA\Programs\Git\cmd\git.exe"
  )
  foreach ($c in $candidates) {
    if ($c -eq "git") {
      $cmd = Get-Command git -ErrorAction SilentlyContinue
      if ($cmd) { return $cmd.Source }
    } elseif (Test-Path $c) {
      return $c
    }
  }
  throw "未找到 Git。请先安装：https://git-scm.com/download/win ，安装后重新打开终端再运行本脚本。"
}

$git = Find-Git
Write-Host "使用 Git: $git"

if (-not (Test-Path ".git")) {
  & $git init
}

& $git add .
& $git diff --cached --quiet
if ($LASTEXITCODE -ne 0) {
  & $git commit -m "feat: 一摊小程序登录页、首页与自定义底栏"
} else {
  Write-Host "没有新的改动需要提交。"
}

& $git branch -M main

$remotes = & $git remote 2>$null
if ($remotes -notcontains "origin") {
  & $git remote add origin $RepoUrl
} else {
  & $git remote set-url origin $RepoUrl
}

& $git push -u origin main
Write-Host "推送完成。"
