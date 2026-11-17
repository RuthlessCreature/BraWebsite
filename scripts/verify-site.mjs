import { readFileSync, readdirSync, existsSync, mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';

const root = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(join(root, 'index.html'), 'utf8');
const images = readdirSync(join(root, 'images'));

assert.ok(html.includes('POMEROL'), 'Pomerol branding missing');
assert.ok(html.includes('13923387986@163.com'), 'Nicole contact email missing');
assert.ok(html.includes('+8613923387986'), 'Nicole phone missing');
assert.ok(html.includes('2665') && html.includes('307'), 'Product styles missing');
assert.ok(html.includes('inquiryForm'), 'Inquiry form missing');
assert.ok(html.includes('factory-exterior.webp'), 'Manufacturing visual missing');
assert.ok(images.length >= 39, `Expected >=39 media assets, found ${images.length}`);
for (let i = 1; i <= 33; i++) {
  const file = `p${String(i).padStart(2, '0')}.webp`;
  assert.ok(existsSync(join(root, 'images', file)), `Missing image ${file}`);
}
const required = [
  'hero-lifestyle.webp', 'feature-black-cami.webp',
  'factory-exterior.webp', 'factory-sewing-floor.webp',
  'factory-quality-lab.webp', 'factory-warehouse.webp'
];
for (const file of required) {
  assert.ok(existsSync(join(root, 'images', file)), `Missing image ${file}`);
}
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
assert.ok(scripts.length > 0, 'Page script missing');
const dir = mkdtempSync(join(tmpdir(), 'pomerol-verify-'));
try {
  for (let i = 0; i < scripts.length; i++) {
    const file = join(dir, `app-${i}.mjs`);
    writeFileSync(file, scripts[i]);
    execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
  }
} finally { rmSync(dir, { recursive: true, force: true }); }
console.log(`PASS: HTML, product catalog, inquiry, scripts and ${images.length} media assets`);
