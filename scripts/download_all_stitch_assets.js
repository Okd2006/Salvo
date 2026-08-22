/* eslint-disable */
import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const requestedScreens = [
  { id: '9064b892b8964b41a9f39a1a23cc6970', name: 'overview', title: 'Overview | Salvo AI' },
  { id: '1fc6676cf6b747b2b158563a1395673e', name: 'launch', title: 'Salvo Launch | Autonomous Recovery' },
  { id: '884a9b47da0d4eb49bbf4e20dd85bbbf', name: 'diagnosis', title: 'AI Diagnosis | Salvo AI' },
  { id: '6249deae598d474992b1a01dc2b9a5bc', name: 'simulator', title: 'Recovery Simulator | Salvo AI' },
  { id: '6b4e56fe85be417b8c52905dc4181938', name: 'shader', title: 'Shader' },
  { id: 'cb420d6b1a2540ed9da0263990e35bc2', name: 'threejs', title: 'Three.js' },
  { id: '4d6ea031c11a443ea7fac657d04fc9f8', name: 'audit', title: 'Audit Trail | Salvo AI' },
  { id: 'ac56fee0a7c54eaf90550a58b330bf42', name: 'execution', title: 'Live Execution | Salvo AI' },
];

const projectId = '4395933167899808293';

async function main() {
  const token = execSync('gcloud auth print-access-token').toString().trim();
  const env = {
    ...process.env,
    STITCH_ACCESS_TOKEN: token,
    GOOGLE_CLOUD_PROJECT: 'reewa-homes-website',
    STITCH_PROJECT_ID: 'reewa-homes-website',
  };

  const jsPath = path.resolve('node_modules/@_davideast/stitch-mcp/bin/stitch-mcp.js');

  console.log('Listing project screens...');
  const res = execFileSync(process.execPath, [
    jsPath, 'tool', 'list_screens', '-d', JSON.stringify({ projectId })
  ], { env, encoding: 'utf8' });

  const data = JSON.parse(res);
  const screensList = data.screens || [];
  console.log(`Found ${screensList.length} total screens in project.`);

  const htmlDir = path.resolve('stitch_html');
  const imgDir = path.resolve('stitch_images');
  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  for (const r of requestedScreens) {
    const found = screensList.find(s => s.name.endsWith(r.id));
    if (!found) {
      console.error(`Could not find screen ${r.title} (${r.id})`);
      continue;
    }

    console.log(`Processing: ${r.title} (${r.id})`);

    // Download HTML
    if (found.htmlCode && found.htmlCode.downloadUrl) {
      console.log(`  Downloading HTML from ${found.htmlCode.downloadUrl.slice(0, 60)}...`);
      try {
        const resp = await fetch(found.htmlCode.downloadUrl);
        if (resp.ok) {
          const htmlText = await resp.text();
          const filePath = path.join(htmlDir, `${r.name}.html`);
          fs.writeFileSync(filePath, htmlText, 'utf8');
          console.log(`  ✓ Saved ${filePath} (${htmlText.length} bytes)`);
        } else {
          console.error(`  ✕ HTML fetch failed HTTP ${resp.status}`);
        }
      } catch (err) {
        console.error(`  ✕ HTML download error: ${err.message}`);
      }
    } else {
      console.warn(`  No htmlCode downloadUrl found for ${r.name}`);
    }

    // Download Screenshot Image
    if (found.screenshot && found.screenshot.downloadUrl) {
      console.log(`  Downloading Image from ${found.screenshot.downloadUrl.slice(0, 60)}...`);
      try {
        const resp = await fetch(found.screenshot.downloadUrl);
        if (resp.ok) {
          const buf = await resp.arrayBuffer();
          const filePath = path.join(imgDir, `${r.name}.png`);
          fs.writeFileSync(filePath, Buffer.from(buf));
          console.log(`  ✓ Saved ${filePath} (${buf.byteLength} bytes)`);
        } else {
          console.error(`  ✕ Image fetch failed HTTP ${resp.status}`);
        }
      } catch (err) {
        console.error(`  ✕ Image download error: ${err.message}`);
      }
    } else {
      console.warn(`  No screenshot downloadUrl found for ${r.name}`);
    }
  }

  console.log('\n=== ALL ASSETS DOWNLOADED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
