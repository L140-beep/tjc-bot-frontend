export const saveFile = (blob: Blob, name: string) => {
  const blobURL = URL.createObjectURL(blob);
  // Сделать невидимый HTML-элемент `<a download>`
  // и включить его в документ
  const a = document.createElement('a');
  a.href = blobURL;
  a.download = name;
  a.style.display = 'none';
  document.body.append(a);
  // Программно кликнуть по ссылке.
  a.click();
  // Уничтожить большой blob URL
  // и удалить ссылку из документа
  // после клика по ней
  setTimeout(() => {
    URL.revokeObjectURL(blobURL);
    a.remove();
  }, 1000);
};
