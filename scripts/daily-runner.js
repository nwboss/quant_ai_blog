import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * 智量双线 | 每日快讯定时运行器 (Node.js 原生版)
 */

const projectDir = path.resolve('.');
const logDir = path.join(projectDir, 'logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'daily-news.log');

function log(msg) {
  const timestamp = new Date().toLocaleString('zh-CN', { hour12: false });
  const line = `[${timestamp}] ${msg}`;
  console.log(line);
  try {
    fs.appendFileSync(logFile, line + '\n', 'utf-8');
  } catch (e) {}
}

function run(cmd) {
  log(`执行命令: ${cmd}`);
  return execSync(cmd, { cwd: projectDir, encoding: 'utf-8', stdio: 'pipe' });
}

async function main() {
  log('=========================================');
  log('🚀 开始执行每日快讯自动化任务...');

  try {
    // 1. 同步最新代码
    try {
      run('git checkout main');
      run('git pull origin main');
    } catch (err) {
      log(`⚠️ git pull 提示: ${err.message?.trim() || err}`);
    }

    // 2. 生成今日早报
    log('2. 正在执行今日早报生成脚本...');
    const generateOutput = run('node ./scripts/generate-daily-news.js');
    log(generateOutput.trim());

    // 3. 检查是否有未提交的新增日报
    const status = run('git status --porcelain').trim();
    if (!status) {
      log('ℹ️ 今日早报已生成且已发布，无新的变更需要部署。');
    } else {
      log('3. 检测到新增内容，开始构建并推送到 GitHub Pages (gh-pages)...');
      const deployOutput = run('npm run deploy');
      log(deployOutput.trim());

      log('4. 提交并同步源码至 GitHub main 分支...');
      const today = new Date().toISOString().slice(0, 10);
      run('git add .');
      run(`git commit -m "chore(daily): auto-publish daily news for ${today}"`);
      const pushOutput = run('git push origin main');
      log(pushOutput.trim());

      log('🎉 每日快讯自动化抓取、构建与双分支发布全部成功！');
    }
  } catch (err) {
    log(`❌ 执行失败: ${err.stderr || err.message || err}`);
  }

  log('=========================================');
}

main();
