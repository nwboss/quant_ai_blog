$ErrorActionPreference = "Continue"
$ProjectDir = "G:\blog_quant"
Set-Location -Path $ProjectDir

$LogDir = Join-Path $ProjectDir "logs"
if (-not (Test-Path $LogDir)) {
    New-Item -ItemType Directory -Path $LogDir -Force | Out-Null
}
$LogFile = Join-Path $LogDir "daily-news.log"

function Log-Message($msg) {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $logLine = "[$timestamp] $msg"
    Write-Output $logLine
    Add-Content -Path $LogFile -Value $logLine
}

Log-Message "========================================="
Log-Message "🚀 开始执行每日快讯自动化任务..."

try {
    # 1. 确保 Git 分支在 main 上并拉取最新
    Log-Message "1. 检查并同步 main 分支最新状态..."
    & git checkout main 2>&1 | Out-Null
    & git pull origin main 2>&1 | Out-Null

    # 2. 生成当天早报 Markdown
    Log-Message "2. 正在执行早报生成脚本..."
    & node "scripts/generate-daily-news.js" 2>&1 | Tee-Object -FilePath $LogFile -Append

    # 3. 检查是否有新文件产生
    $status = & git status --porcelain
    if (-not $status) {
        Log-Message "ℹ️ 今日早报已存在或无新变更，跳过后续部署发布。"
    } else {
        Log-Message "3. 检测到新增早报，开始构建并部署至 gh-pages 分支..."
        & npm run deploy 2>&1 | Tee-Object -FilePath $LogFile -Append

        Log-Message "4. 提交并推送源码至 GitHub main 分支..."
        $today = Get-Date -Format "yyyy-MM-dd"
        $commitMsg = "chore(daily): auto-publish daily news for " + $today
        & git add .
        & git commit -m $commitMsg
        & git push origin main 2>&1 | Tee-Object -FilePath $LogFile -Append

        Log-Message "🎉 每日早报自动化抓取、构建与发布全部完成！"
    }
} catch {
    Log-Message "❌ 执行过程中遇到异常: $_"
}

Log-Message "========================================="
