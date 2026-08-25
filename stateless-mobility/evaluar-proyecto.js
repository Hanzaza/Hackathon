/* eslint-disable @typescript-eslint/no-require-imports */
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const runCommand = (command, name) => {
    console.log(`\n========================================`);
    console.log(`🚀 Ejecutando: ${name}`);
    console.log(`========================================\n`);
    try {
        const output = execSync(command, { encoding: 'utf-8', stdio: 'pipe' });
        console.log(output);
        return output;
    } catch (error) {
        console.log(`⚠️ Se encontraron detalles en ${name}:`);
        console.log(error.stdout || error.message);
        return error.stdout;
    }
};

const getProjectMetrics = (dir = '.') => {
    console.log(`\n========================================`);
    console.log(`🚀 Ejecutando: Métricas de Código y Estructura`);
    console.log(`========================================\n`);

    const ignoredDirs = new Set(['node_modules', '.next', 'dist', 'build', '.git', '.system_generated', 'out']);
    const stats = {};

    const walk = (currentDir) => {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
            if (ignoredDirs.has(entry.name)) continue;
            const fullPath = path.join(currentDir, entry.name);
            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name).toLowerCase() || path.basename(entry.name);
                if (['.ico', '.png', '.jpg', '.jpeg', '.svg', '.lock', '.webp', '.woff', '.woff2'].includes(ext)) continue;

                try {
                    const content = fs.readFileSync(fullPath, 'utf-8');
                    const lines = content.split('\n');
                    const totalLines = lines.length;
                    const blankLines = lines.filter(l => l.trim().length === 0).length;
                    const codeLines = totalLines - blankLines;

                    if (!stats[ext]) {
                        stats[ext] = { files: 0, totalLines: 0, codeLines: 0, blankLines: 0 };
                    }
                    stats[ext].files += 1;
                    stats[ext].totalLines += totalLines;
                    stats[ext].codeLines += codeLines;
                    stats[ext].blankLines += blankLines;
                } catch {
                    // Skip binary or unreadable files
                }
            }
        }
    };

    try {
        walk(dir);

        console.log('┌──────────────┬────────────┬──────────────┬──────────────┬──────────────┐');
        console.log('│ Lenguaje/Ext │  Archivos  │ Líneas Tot.  │    Código    │ En Blanco    │');
        console.log('├──────────────┼────────────┼──────────────┼──────────────┼──────────────┤');

        let totalFiles = 0;
        let totalLinesSum = 0;
        let totalCodeSum = 0;
        let totalBlankSum = 0;

        const sortedExts = Object.keys(stats).sort((a, b) => stats[b].totalLines - stats[a].totalLines);

        for (const ext of sortedExts) {
            const item = stats[ext];
            totalFiles += item.files;
            totalLinesSum += item.totalLines;
            totalCodeSum += item.codeLines;
            totalBlankSum += item.blankLines;

            const nameStr = ext.padEnd(12);
            const filesStr = String(item.files).padStart(10);
            const linesStr = String(item.totalLines).padStart(12);
            const codeStr = String(item.codeLines).padStart(12);
            const blankStr = String(item.blankLines).padStart(12);

            console.log(`│ ${nameStr} │ ${filesStr} │ ${linesStr} │ ${codeStr} │ ${blankStr} │`);
        }

        console.log('├──────────────┼────────────┼──────────────┼──────────────┼──────────────┤');
        const totName = 'TOTAL'.padEnd(12);
        const totFiles = String(totalFiles).padStart(10);
        const totLines = String(totalLinesSum).padStart(12);
        const totCode = String(totalCodeSum).padStart(12);
        const totBlank = String(totalBlankSum).padStart(12);
        console.log(`│ ${totName} │ ${totFiles} │ ${totLines} │ ${totCode} │ ${totBlank} │`);
        console.log('└──────────────┴────────────┴──────────────┴──────────────┴──────────────┘\n');
    } catch (err) {
        console.log(`⚠️ Error al calcular métricas: ${err.message}`);
    }
};

const main = () => {
    console.log("Iniciando auditoría del proyecto...\n");

    // 1. Estructura y Tamaño del Proyecto (Nativo Node.js / Multiplataforma)
    getProjectMetrics('.');

    // 2. Clean Code y Linter (ESLint)
    runCommand('npx eslint . --ext .js,.jsx,.ts,.tsx', 'Análisis de Clean Code (ESLint)');

    // 3. Detección de Código Duplicado (jscpd)
    runCommand('npx jscpd ./src --min-lines 5 --min-tokens 50', 'Detección de Clones / Código Duplicado');

    // 4. Auditoría de Seguridad de Dependencias
    runCommand('npm audit --production', 'Seguridad de Dependencias');

    console.log(`\n✅ Evaluación completada. Revisa los puntos críticos antes del hackathon.`);
};

main();