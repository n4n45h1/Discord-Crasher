// script.js

document.addEventListener('DOMContentLoaded', () => {
  const webhookInput = document.getElementById('webhookUrl');
  const successCountEl = document.getElementById('successCount');
  const failedCountEl = document.getElementById('failedCount');
  const buttons = document.querySelectorAll('.request-btn');

  let successCount = 0;
  let failedCount = 0;

  // ボタンが押されたときのイベント
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const webhookUrl = webhookInput.value.trim();
      if (!webhookUrl) {
        alert('Webhook URLを入力してください。');
        return;
      }

      const requests = parseInt(button.getAttribute('data-requests'), 10);
      successCount = 0;
      failedCount = 0;
      updateStatus();

      for (let i = 0; i < requests; i++) {
        try {
          await sendWebhook(webhookUrl);
          successCount++;
        } catch (error) {
          failedCount++;
        }
        updateStatus();
      }
    });
  });

  // Webhook送信関数
  async function sendWebhook(webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'test' }),
    });

    if (!response.ok) {
      throw new Error('Webhook送信失敗');
    }
  }

  // ステータス更新
  function updateStatus() {
    successCountEl.textContent = successCount;
    failedCountEl.textContent = failedCount;
  }
});
