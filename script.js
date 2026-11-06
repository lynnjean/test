const form = document.getElementById("email-form");
const input = document.getElementById("email");
const message = document.getElementById("email-message");
const button = form.querySelector(".submit");

// Apps Script 배포 후 받은 웹 앱 URL(/exec로 끝남)을 넣는다
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyLRbjR1CXAr9fyRkuxT5xMM-ofpgt8E6-SO-lutGkYG6WY7KSYAiyWD5aa_Ibw8BX1eg/exec";

const EMAIL_PATTERN = /^[A-Za-z0-9][^\s@]*@[^\s@]+\.[^\s@]{2,}$/;

function getError(email) {
  if (email === "") return "이메일을 입력해 주세요.";
  if (!EMAIL_PATTERN.test(email)) return "올바른 이메일 형식이 아닙니다.";
  return "";
}

function setState(state, text) {
  input.classList.toggle("invalid", state === "error");
  input.classList.toggle("valid", state === "success");
  input.setAttribute("aria-invalid", state === "error");
  message.className = state ? `message ${state}` : "message";
  message.textContent = text;
}

// 제출 후 오류가 표시된 상태라면 입력하는 동안 바로 다시 검사한다
input.addEventListener("input", () => {
  if (!input.classList.contains("invalid")) {
    setState("", "");
    return;
  }
  const error = getError(input.value.trim());
  if (error) setState("error", error);
  else setState("", "");
});

async function saveEmail(email) {
  const response = await fetch(SCRIPT_URL, {
    method: "POST",
    body: new URLSearchParams({ email }),
  });
  const result = await response.json();
  if (!result.ok) throw new Error("저장 실패");
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = input.value.trim();
  const error = getError(email);

  if (error) {
    setState("error", error);
    input.focus();
    return;
  }

  button.disabled = true;
  button.textContent = "제출 중...";

  try {
    await saveEmail(email);
    setState("success", `${email} 주소가 제출되었습니다.`);
  } catch (error) {
    console.error("제출 실패:", error);
    setState("error", "제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
  } finally {
    button.disabled = false;
    button.textContent = "확인";
  }
});
