document.getElementById('copy-code')!.addEventListener('click', async () => {
  const status = document.getElementById('copy-status')!;
  const code = document.querySelector<HTMLTextAreaElement>('#embed-code')!;
  try { await navigator.clipboard.writeText(code.value); status.textContent = 'Código copiado!'; }
  catch { code.select(); status.textContent = 'Selecione e copie o código acima.'; }
});
