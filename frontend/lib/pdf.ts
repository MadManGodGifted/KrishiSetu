import { Platform } from 'react-native';

import { formatInr, pickText, type YieldReport } from '@/constants/crops';
import type { CropContract } from '@/constants/market';
import { farmer } from '@/constants/dummy';
import type { Locale } from '@/constants/i18n';

const PRINT_CSS = `
  @page { size: A4 portrait; margin: 12mm; }
  html, body {
    writing-mode: horizontal-tb !important;
    text-orientation: mixed !important;
    direction: ltr !important;
    unicode-bidi: isolate;
    margin: 0;
    padding: 0;
    background: #5c6560;
    color: #122017;
    font-family: "Segoe UI", "Noto Sans", system-ui, sans-serif;
  }
  * {
    box-sizing: border-box;
    writing-mode: horizontal-tb !important;
    text-orientation: mixed !important;
    word-break: normal;
    overflow-wrap: anywhere;
    white-space: normal;
  }
  .stage { padding: 24px 12px 40px; }
  .page {
    width: 210mm;
    max-width: 100%;
    margin: 0 auto;
    background: #fff;
    padding: 18mm 16mm;
    box-shadow: 0 8px 32px rgba(0,0,0,.28);
  }
  table { width: 100%; border-collapse: collapse; table-layout: fixed; }
  td, th {
    vertical-align: top;
    text-align: left;
    padding: 6px 8px;
    font-size: 12.5px;
    line-height: 1.45;
    word-break: normal;
    overflow-wrap: anywhere;
  }
  h1, h2, h3, p, span, li, td, th, div {
    writing-mode: horizontal-tb !important;
    text-orientation: mixed !important;
  }
  h1 { font-size: 22px; margin: 0 0 4px; color: #0B3D91; }
  h2 { font-size: 14px; margin: 18px 0 8px; color: #1B5E20; border-bottom: 1px solid #E6EDE7; padding-bottom: 4px; }
  p { margin: 0 0 8px; font-size: 13px; line-height: 1.5; }
  .brand-hi { font-size: 18px; font-weight: 800; }
  .muted { color: #5C6B61; font-size: 11px; }
  .tricolor { height: 6px; width: 100%; }
  .tricolor td { padding: 0; height: 6px; }
  .box { border: 1px solid #E6EDE7; }
  .label { color: #8A968E; font-size: 10px; text-transform: uppercase; letter-spacing: .4px; }
  .value { font-size: 16px; font-weight: 700; }
  .stamp {
    display: inline-block;
    border: 2px solid #1B5E20;
    color: #1B5E20;
    font-weight: 800;
    font-size: 11px;
    padding: 4px 8px;
    letter-spacing: .6px;
  }
  .sign { height: 56px; border-bottom: 1px solid #122017; margin-bottom: 4px; }
  .hint { color: #5C6B61; font-size: 11px; margin-top: 20px; }
  .qr { width: 92px; height: 92px; }
  @media print {
    html, body { background: #fff !important; }
    .stage { padding: 0; }
    .page { box-shadow: none; width: auto; padding: 0; }
    .no-print { display: none !important; }
  }
`;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrap(title: string, inner: string) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1"/>
  <title>${escapeHtml(title)}</title>
  <style>${PRINT_CSS}</style>
</head>
<body>
  <div class="stage"><article class="page">${inner}</article></div>
</body>
</html>`;
}

function headerBlock(subtitle: string) {
  return `
    <table class="tricolor" role="presentation">
      <tr>
        <td style="background:#FF9933;width:33.33%"></td>
        <td style="background:#FFFFFF;width:33.33%;border-top:1px solid #E6EDE7;border-bottom:1px solid #E6EDE7"></td>
        <td style="background:#138808;width:33.34%"></td>
      </tr>
    </table>
    <table role="presentation" style="margin-top:12px">
      <tr>
        <td style="width:72%">
          <div class="brand-hi">कृषि सेतु</div>
          <h1>Krishi Setu</h1>
          <p class="muted">Department of Agriculture &amp; Farmers Welfare</p>
          <p class="muted">${escapeHtml(subtitle)}</p>
        </td>
        <td style="width:28%;text-align:right">
          <span class="stamp">SAMPLE</span>
          <p class="muted" style="margin-top:8px">Kisan Call Centre<br/>1800-180-1551</p>
        </td>
      </tr>
    </table>`;
}

export function buildYieldReportHtml(report: YieldReport, locale: Locale) {
  const crop = pickText(report.crop.name, locale);
  const title = `Krishi Setu yield report — ${crop}`;
  const mspRow = report.crop.mspPrice
    ? `<tr>
        <td class="label">MSP</td>
        <td class="value">${escapeHtml(formatInr(report.crop.mspPrice))} / q</td>
        <td class="label">At MSP</td>
        <td class="value">${escapeHtml(formatInr(report.mspRevenue ?? 0))}</td>
      </tr>`
    : `<tr><td colspan="4" class="muted">No official MSP for this crop. Price follows the mandi.</td></tr>`;

  const inner = `
    ${headerBlock('Official-style yield &amp; revenue report')}
    <h2>Farmer</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Name</td><td>${escapeHtml(farmer.name)}</td>
        <td class="label">Farmer ID</td><td>${escapeHtml(farmer.farmerId)}</td>
      </tr>
      <tr>
        <td class="label">Village / District</td><td>${escapeHtml(farmer.location)}</td>
        <td class="label">Farm size</td><td>${report.acres} acres</td>
      </tr>
    </table>
    <h2>Crop</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Crop</td><td class="value">${escapeHtml(crop)}</td>
        <td class="label">Variety</td><td class="value">${escapeHtml(report.crop.variety)}</td>
      </tr>
      <tr>
        <td class="label">Season</td><td>${escapeHtml(report.seasonLabel)}</td>
        <td class="label">Names</td><td>${escapeHtml(report.crop.name.en)} · ${escapeHtml(report.crop.name.hi)} · ${escapeHtml(report.crop.name.mr)}</td>
      </tr>
    </table>
    <h2>Expected yield</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Total</td>
        <td class="value">${report.expected} quintals</td>
        <td class="label">Per acre</td>
        <td class="value">${report.perAcre} q</td>
      </tr>
      <tr>
        <td class="label">Mandi rate</td>
        <td class="value">${escapeHtml(formatInr(report.crop.mandiPrice))} / q</td>
        <td class="label">Mandi revenue</td>
        <td class="value">${escapeHtml(formatInr(report.mandiRevenue))}</td>
      </tr>
      ${mspRow}
    </table>
    <h2>How this is calculated</h2>
    <p>${report.perAcre} q/acre × ${report.acres} acres = ${report.expected} quintals.</p>
    <p>${report.expected} × ${escapeHtml(formatInr(report.crop.mandiPrice))} = ${escapeHtml(formatInr(report.mandiRevenue))} at local mandi.</p>
    <p class="muted">Model confidence ${report.confidence}%. This is a decision-support estimate, not a guarantee.</p>
    <p class="hint">Use Print → Save as PDF. Layout is A4 portrait. Text is left-to-right.</p>
  `;
  return wrap(title, inner);
}

export function buildContractHtml(input: {
  cropName: string;
  variety: string;
  acres: number;
  contract: CropContract;
  expectedEarnings?: string;
}) {
  const title = `Sample contract — ${input.cropName}`;
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(input.contract.agreementNo)}`;
  const inner = `
    ${headerBlock('Sample contract farming agreement — not legally binding')}
    <table role="presentation" style="margin-top:8px">
      <tr>
        <td>
          <p class="label">Agreement no.</p>
          <p class="value">${escapeHtml(input.contract.agreementNo)}</p>
        </td>
        <td>
          <p class="label">Date</p>
          <p class="value">19 Aug 2026</p>
        </td>
        <td>
          <p class="label">Status</p>
          <p class="value">Draft sample</p>
        </td>
      </tr>
    </table>
    <h2>1. Farmer</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Name</td><td>${escapeHtml(farmer.name)}</td>
        <td class="label">Farmer ID</td><td>${escapeHtml(farmer.farmerId)}</td>
      </tr>
      <tr>
        <td class="label">Aadhaar</td><td>XXXX-XXXX-${escapeHtml(farmer.verification.aadhaarLast4)}</td>
        <td class="label">Phone</td><td>+91 ${escapeHtml(farmer.phone)}</td>
      </tr>
      <tr>
        <td class="label">Address</td><td colspan="3">${escapeHtml(farmer.location)} · ${input.acres} acres</td>
      </tr>
    </table>
    <h2>2. Buyer</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Company</td><td class="value" colspan="3">${escapeHtml(input.contract.buyer)}</td>
      </tr>
      <tr>
        <td class="label">Quantity</td><td>${escapeHtml(input.contract.quantity)}</td>
        <td class="label">Pickup</td><td>${input.contract.pickup ? 'Farm-gate pickup' : 'Farmer delivers'}</td>
      </tr>
    </table>
    <h2>3. Crop &amp; price</h2>
    <table class="box" role="presentation">
      <tr>
        <td class="label">Crop</td><td>${escapeHtml(input.cropName)}</td>
        <td class="label">Variety</td><td>${escapeHtml(input.variety)}</td>
      </tr>
      <tr>
        <td class="label">Quality grade</td><td colspan="3">${escapeHtml(input.contract.grade)}</td>
      </tr>
      <tr>
        <td class="label">Expected price</td><td class="value">${escapeHtml(input.contract.price)}</td>
        <td class="label">Expires</td><td>${escapeHtml(input.contract.expiry)}</td>
      </tr>
      ${
        input.expectedEarnings
          ? `<tr>
        <td class="label">Expected earnings</td>
        <td class="value" colspan="3">${escapeHtml(input.expectedEarnings)}</td>
      </tr>`
          : ''
      }
    </table>
    <h2>4. Terms (sample)</h2>
    <p>1. Produce shall meet the stated quality grade at the time of weighment.</p>
    <p>2. Payment shall be credited to the farmer’s registered bank account within 7 working days of delivery.</p>
    <p>3. Pickup, if offered, is at the farm gate on a mutually agreed date.</p>
    <p>4. This document is a demonstration sample generated by Krishi Setu. It is not a legally binding contract.</p>
    <h2>5. Signatures &amp; verification</h2>
    <table role="presentation">
      <tr>
        <td style="width:38%">
          <div class="sign"></div>
          <p class="muted">${escapeHtml(farmer.name)}<br/>Farmer · digital signature</p>
        </td>
        <td style="width:38%">
          <div class="sign"></div>
          <p class="muted">${escapeHtml(input.contract.buyer)}<br/>Authorised signatory</p>
        </td>
        <td style="width:24%;text-align:center">
          <img class="qr" alt="Verification QR" src="${qr}" width="92" height="92"/>
          <p class="muted">Scan to verify<br/>${escapeHtml(input.contract.agreementNo)}</p>
        </td>
      </tr>
    </table>
    <p class="hint">Use Print → Save as PDF. A4 portrait. Horizontal left-to-right text.</p>
  `;
  return wrap(title, inner);
}

export function printHtml(html: string) {
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const popup = window.open('', '_blank', 'noopener,noreferrer');
    if (popup) {
      popup.document.open();
      popup.document.write(html);
      popup.document.close();
      popup.focus();
      setTimeout(() => popup.print(), 350);
      return true;
    }
  }
  return false;
}
