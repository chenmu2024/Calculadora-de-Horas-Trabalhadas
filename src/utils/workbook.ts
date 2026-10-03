import { calculateDuration, calculateNightShift, isValidTime, timeToMinutes } from './time';
interface Row { date: string; start: string; end: string; lunchStart?: string; lunchEnd?: string; breakTime?: string; totalHours: string }
const xml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
/** Small uncompressed ZIP writer; XLSX uses the standard Open XML package. */
export function buildWorkbook(entries: Row[], hourlyRate = 25, nightTemplate = false): Uint8Array {
  const text = (ref: string, value: string) => `<c r="${ref}" t="inlineStr"><is><t>${xml(value)}</t></is></c>`;
  const number = (ref: string, value: number, style = 0) => `<c r="${ref}" s="${style}"><v>${value}</v></c>`;
  const formula = (ref: string, value: string, cached: number, style = 0) => `<c r="${ref}" s="${style}"><f>${xml(value)}</f><v>${cached}</v></c>`;
  const headers = ['Dia / Descrição', 'Entrada', 'Saída Almoço', 'Retorno Almoço', 'Saída Final', 'Pausa', 'Total Horas', 'Horas Extras', 'Saldo (horas decimais)', 'Valor (R$)'];
  let sheet = `<row r="1">${headers.map((value, i) => text(`${String.fromCharCode(65 + i)}1`, value)).join('')}${text('L1', 'Taxa horária (R$)')}${text('M1', 'Meta diária')}${text('N1', 'Adicional noturno (%)')}${text('K1', 'Horas noturnas fictas (22–05)')}</row>`;
  entries.forEach((entry, i) => {
    const row = i + 2;
    const valid = isValidTime(entry.start) && isValidTime(entry.end);
    const hasLunch = isValidTime(entry.lunchStart ?? '') && isValidTime(entry.lunchEnd ?? '');
    const rest = hasLunch ? (timeToMinutes(entry.lunchEnd!) - timeToMinutes(entry.lunchStart!) + 1440) % 1440 : isValidTime(entry.breakTime ?? '', true) ? timeToMinutes(entry.breakTime!) : 0;
    const total = valid ? calculateDuration(entry.start, entry.end, undefined, undefined, rest) : 0;
    let cells = text(`A${row}`, entry.date);
    for (const [col, value] of [['B', entry.start], ['C', entry.lunchStart], ['D', entry.lunchEnd], ['E', entry.end]]) cells += isValidTime(value ?? '') ? number(`${col}${row}`, timeToMinutes(value!) / 1440, 1) : text(`${col}${row}`, value ?? '');
    cells += isValidTime(entry.lunchStart ?? '') && isValidTime(entry.lunchEnd ?? '') ? formula(`F${row}`, `MOD(D${row}-C${row},1)`, rest / 1440, 1) : number(`F${row}`, rest / 1440, 1);
    cells += formula(`G${row}`, `IF(AND(ISNUMBER(B${row}),ISNUMBER(E${row})),MAX(0,MOD(E${row}-B${row},1)-F${row}),0)`, total / 1440, 1);
    cells += formula(`H${row}`, `MAX(0,G${row}-$M$2)`, Math.max(0, total - 480) / 1440, 1);
    cells += formula(`I${row}`, `IF(AND(ISNUMBER(B${row}),ISNUMBER(E${row})),(G${row}-$M$2)*24,0)`, valid ? (total - 480) / 60 : 0, 2);
    // Absolute day fractions keep both night windows and lunch correct across midnight.
    const endAt = `B${row}+MOD(E${row}-B${row},1)`;
    const lunchAt = `B${row}+MOD(C${row}-B${row},1)`;
    const returnAt = `${lunchAt}+MOD(D${row}-C${row},1)`;
    const overlap = (from: string, to: string) => [-1, 0, 1].map(day => `MAX(0,MIN(${to},${day + 1}+5/24)-MAX(${from},${day}+22/24))`).join('+');
    const fullNight = calculateNightShift(entry.start, entry.end, 'urban').night;
    const pauseNight = hasLunch ? calculateNightShift(entry.lunchStart!, entry.lunchEnd!, 'urban').night : 0;
    const nightHours = valid && (hasLunch || rest === 0) ? Math.max(0, fullNight - pauseNight) * 60 / 52.5 : 0;
    const nightFormula = `IF(AND(ISNUMBER(B${row}),ISNUMBER(E${row})),IF(AND(ISNUMBER(C${row}),ISNUMBER(D${row})),(${overlap(`B${row}`, lunchAt)}+${overlap(returnAt, endAt)})*1440/52.5,IF(F${row}=0,(${overlap(`B${row}`, endAt)})*1440/52.5,0)),0)`;
    cells += formula(`K${row}`, nightFormula, nightHours, 2);
    cells += formula(`J${row}`, `G${row}*24*$L$2+IF($N$2>0,K${row}*$L$2*(1+$N$2-52.5/60),0)`, total / 60 * hourlyRate + (nightTemplate ? nightHours * hourlyRate * (1.2 - 52.5 / 60) : 0), 2);
    if (i === 0) cells += number('L2', hourlyRate, 2) + number('M2', 480 / 1440, 1) + number('N2', nightTemplate ? 0.2 : 0, 2);
    sheet += `<row r="${row}">${cells}</row>`;
  });
  const last = entries.length + 2;
  sheet += `<row r="${last}">${text(`A${last}`, 'TOTAL')}${formula(`G${last}`, `SUM(G2:G${last - 1})`, entries.reduce((sum, e) => sum + calculateDuration(e.start, e.end, undefined, undefined, timeToMinutes(e.breakTime ?? '00:00')), 0) / 1440, 1)}</row>`;
  const files = {
    '[Content_Types].xml': '<?xml version="1.0"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>',
    '_rels/.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Ponto" sheetId="1" r:id="rId1"/></sheets><calcPr calcId="191029" fullCalcOnLoad="1"/></workbook>',
    'xl/_rels/workbook.xml.rels': '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>',
    'xl/styles.xml': '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="1"><numFmt numFmtId="164" formatCode="[h]:mm"/></numFmts><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/><xf numFmtId="2" fontId="0" fillId="0" borderId="0" applyNumberFormat="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>',
    'xl/worksheets/sheet1.xml': `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><cols><col min="1" max="1" width="32" customWidth="1"/><col min="2" max="13" width="18" customWidth="1"/></cols><sheetData>${sheet}</sheetData></worksheet>`
  };
  const encoder = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;
  for (const [filename, content] of Object.entries(files)) {
    const name = encoder.encode(filename);
    const data = encoder.encode(content);
    let crc = 0xffffffff;
    for (const byte of data) {
      crc ^= byte;
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
    }
    crc = (crc ^ 0xffffffff) >>> 0;
    const local = new Uint8Array(30 + name.length);
    const lv = new DataView(local.buffer);
    lv.setUint32(0, 0x04034b50, true); lv.setUint16(4, 20, true); lv.setUint16(10, 0, true); lv.setUint16(12, 33, true);
    lv.setUint32(14, crc, true); lv.setUint32(18, data.length, true); lv.setUint32(22, data.length, true); lv.setUint16(26, name.length, true);
    local.set(name, 30);
    const directory = new Uint8Array(46 + name.length);
    const dv = new DataView(directory.buffer);
    dv.setUint32(0, 0x02014b50, true); dv.setUint16(4, 20, true); dv.setUint16(6, 20, true); dv.setUint16(14, 33, true);
    dv.setUint32(16, crc, true); dv.setUint32(20, data.length, true); dv.setUint32(24, data.length, true); dv.setUint16(28, name.length, true); dv.setUint32(42, offset, true);
    directory.set(name, 46); central.push(directory); parts.push(local, data);
    offset += local.length + data.length;
  }
  const centralSize = central.reduce((sum, part) => sum + part.length, 0);
  const end = new Uint8Array(22);
  const ev = new DataView(end.buffer);
  ev.setUint32(0, 0x06054b50, true); ev.setUint16(8, central.length, true); ev.setUint16(10, central.length, true); ev.setUint32(12, centralSize, true); ev.setUint32(16, offset, true);
  const result = new Uint8Array(offset + centralSize + end.length);
  let cursor = 0;
  for (const part of [...parts, ...central, end]) { result.set(part, cursor); cursor += part.length; }
  return result;
}
export function downloadWorkbook(entries: Row[], hourlyRate: number, nightTemplate = false) {
  const bytes = buildWorkbook(entries, hourlyRate, nightTemplate);
  const blob = new Blob([bytes as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = 'planilha_horas_trabalhadas.xlsx'; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
