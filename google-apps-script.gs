/**
 * MR3 Comunicação — Diagnóstico Digital
 * Recebe as respostas do formulário e grava na planilha do Google.
 *
 * Como usar: veja LEIA-ME.md (passo a passo).
 */

// Opcional: e-mail que recebe um aviso a cada nova resposta. Deixe "" para desativar.
const EMAIL_AVISO = "";

const NOME_ABA = "Respostas";

const COLUNAS = [
  ["data",        "Data/Hora"],
  ["empresa",     "1. Nome da empresa"],
  ["instagram",   "2. Instagram"],
  ["segmento",    "3. Segmento"],
  ["responsavel", "4. Quem cuida das redes"],
  ["objetivo",    "5. Principal objetivo"],
  ["dificuldade", "6. Maior dificuldade no Instagram"],
  ["frequencia",  "7. Frequência de publicação"],
  ["interesse",   "8. Interesse no serviço"],
  ["nome",        "9. Nome"],
  ["whatsapp",    "10. WhatsApp"],
  ["pagina",      "Página de origem"],
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const dados = JSON.parse(e.postData.contents || "{}");
    const aba = obterAba_();
    dados.data = new Date();

    const linha = COLUNAS.map(([chave]) => {
      let v = dados[chave] === undefined ? "" : dados[chave];
      // Evita que textos começando com = + - @ virem fórmulas
      if (typeof v === "string") {
        v = v.slice(0, 500);
        if (/^[=+\-@]/.test(v)) v = "'" + v;
      }
      return v;
    });
    aba.appendRow(linha);

    if (EMAIL_AVISO) {
      const corpo = COLUNAS.slice(1, 11)
        .map(([chave, titulo]) => titulo + ": " + (dados[chave] || "")).join("\n");
      MailApp.sendEmail(EMAIL_AVISO,
        "Novo diagnóstico: " + (dados.empresa || "sem nome"), corpo);
    }

    return resposta_({ ok: true });
  } catch (err) {
    return resposta_({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Permite testar abrindo a URL no navegador
function doGet() {
  return resposta_({ ok: true, mensagem: "Endpoint do Diagnóstico MR3 funcionando." });
}

function obterAba_() {
  const planilha = SpreadsheetApp.getActiveSpreadsheet();
  let aba = planilha.getSheetByName(NOME_ABA);
  if (!aba) aba = planilha.insertSheet(NOME_ABA);
  if (aba.getLastRow() === 0) {
    aba.appendRow(COLUNAS.map(c => c[1]));
    aba.getRange(1, 1, 1, COLUNAS.length).setFontWeight("bold").setBackground("#1D4A96").setFontColor("#ffffff");
    aba.setFrozenRows(1);
    aba.getRange("A:A").setNumberFormat("dd/MM/yyyy HH:mm");
  }
  return aba;
}

function resposta_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
