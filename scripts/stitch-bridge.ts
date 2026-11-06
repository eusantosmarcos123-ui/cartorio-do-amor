/**
 * Google Stitch <-> Antigravity Integration Bridge
 * Cartório do Amor - Romantic Editorial Certificate Suite
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

export function runStitchBridge() {
  console.log('✨ [Antigravity x Stitch Bridge] Sincronizando Design Tokens & Telas...');

  const configPath = path.join(rootDir, 'stitch.config.json');
  if (!fs.existsSync(configPath)) {
    throw new Error('Arquivo stitch.config.json não localizado!');
  }

  const stitchConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  console.log(`📌 Projeto: ${stitchConfig.project} (Design System: ${stitchConfig.designSystem})`);
  console.log(`🔗 Engine: ${stitchConfig.integration.engine} + ${stitchConfig.integration.provider}`);

  // Validação dos componentes mapeados
  const mappings = stitchConfig.componentMappings;
  let allComponentsFound = true;

  for (const [componentName, details] of Object.entries<{ source: string; description: string }>(mappings)) {
    const fullPath = path.join(rootDir, details.source);
    if (fs.existsSync(fullPath)) {
      console.log(`  ✓ Componente mapeado: ${componentName} -> ${details.source}`);
    } else {
      console.warn(`  ⚠️ Componente não encontrado: ${componentName} em ${details.source}`);
      allComponentsFound = false;
    }
  }

  // Validação dos templates Stitch
  const templatePath = path.join(rootDir, 'stitch-templates', 'romantic-editorial.html');
  if (fs.existsSync(templatePath)) {
    console.log(`  ✓ Template Stitch carregado: stitch-templates/romantic-editorial.html`);
  }

  const report = {
    syncedAt: new Date().toISOString(),
    status: allComponentsFound ? 'SUCCESS' : 'WARNING_MISSING_FILES',
    designSystem: stitchConfig.designSystem,
    tokenCount: Object.keys(stitchConfig.tokens.colors).length,
    componentsSynced: Object.keys(mappings).length,
  };

  const reportPath = path.join(rootDir, 'stitch-sync-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`🚀 [Antigravity x Stitch Bridge] Sincronização concluída com sucesso! Relatório: ${reportPath}`);
}

runStitchBridge();
