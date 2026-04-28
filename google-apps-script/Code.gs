// Google Apps Script — GSA Mentoria Form
// Deploy: Extensões > Apps Script > Implantar > Novo implante > App da Web
// Executar como: Eu | Quem tem acesso: Qualquer pessoa

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data  = JSON.parse(e.postData.contents);

    // Se a planilha estiver vazia, cria a linha de cabeçalhos
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(Object.keys(data));
    }

    var row = Object.values(data).map(function(v) {
      return Array.isArray(v) ? v.join(', ') : String(v == null ? '' : v);
    });

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}
