import { execFileSync, execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const screens = [
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

  const htmlDir = path.resolve('stitch_html');
  const imgDir = path.resolve('stitch_images');
  fs.mkdirSync(htmlDir, { recursive: true });
  fs.mkdirSync(imgDir, { recursive: true });

  for (const s of screens) {
    console.log(`Fetching code for ${s.title} (${s.id})...`);
    try {
      const codeRes = execFileSync(process.execPath, [
        jsPath, 'tool', 'get_screen_code', '-d', JSON.stringify({ projectId, screenId: s.id })
      ], { env, encoding: 'utf8' });

      const codeParsed = JSON.parse(codeRes);
      if (codeParsed.htmlContent) {
        fs.writeFileSync(path.join(htmlDir, `${s.name}.html`), codeParsed.htmlContent);
        console.log(`  Saved stitch_html/${s.name}.html`);
      } else {
        console.warn(`  No htmlContent returned for ${s.name}`);
      }
    } catch (err) {
      console.error(`  Error fetching code for ${s.name}:`, err.message);
    }

    console.log(`Fetching image for ${s.title} (${s.id})...`);
    try {
      const imgRes = execFileSync(process.execPath, [
        jsPath, 'tool', 'get_screen_image', '-d', JSON.stringify({ projectId, screenId: s.id })
      ], { env, encoding: 'utf8' });

      const imgParsed = JSON.parse(imgRes);
      if (imgParsed.imageContent) {
        const buffer = Buffer.from(imgParsed.imageContent, 'base64');
        fs.writeFileSync(path.join(imgDir, `${s.name}.png`), buffer);
        console.log(`  Saved stitch_images/${s.name}.png (${buffer.length} bytes)`);
      } else {
        console.warn(`  No imageContent returned for ${s.name}`);
      }
    } catch (err) {
      console.error(`  Error fetching image for ${s.name}:`, err.message);
    }
  }

  console.log('Done fetching all Stitch assets!');
}

main();
