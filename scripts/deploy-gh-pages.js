import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 正在准备部署到 gh-pages 分支...');

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist 目录不存在，请先运行 npm run build');
  process.exit(1);
}

// Ensure .nojekyll exists
fs.writeFileSync(path.join(distDir, '.nojekyll'), '# bypass jekyll\n');

try {
  const commands = [
    `git -C "${distDir}" init -b gh-pages`,
    `git -C "${distDir}" add -A`,
    `git -C "${distDir}" commit -m "deploy: update gh-pages static site"`,
    `git -C "${distDir}" remote add origin git@github.com:nwboss/quant_ai_blog.git`,
    `git -C "${distDir}" push -f origin gh-pages`,
  ];

  for (const cmd of commands) {
    execSync(cmd, { stdio: 'inherit' });
  }

  // Cleanup .git inside dist
  const gitDirInDist = path.join(distDir, '.git');
  if (fs.existsSync(gitDirInDist)) {
    fs.rmSync(gitDirInDist, { recursive: true, force: true });
  }

  console.log('\n🎉 部署成功！已成功推送到 gh-pages 分支！');
} catch (err) {
  console.error('❌ 部署失败：', err);
  process.exit(1);
}
