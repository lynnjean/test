// 구글 스프레드시트의 [확장 프로그램 > Apps Script]에 붙여 넣어 사용한다

// 첫 글자를 영문/숫자로 제한해 =, + 등으로 시작하는 값이 시트에서 수식으로 실행되지 않게 한다
const EMAIL_PATTERN = /^[A-Za-z0-9][^\s@]*@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  const email = (e.parameter.email || "").trim();

  if (!EMAIL_PATTERN.test(email)) {
    return respond({ ok: false });
  }

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(["제출 시각", "이메일"]);
  }
  sheet.appendRow([new Date(), email]);

  return respond({ ok: true });
}

function respond(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(
    ContentService.MimeType.JSON
  );
}
