const input = document.getElementById('url-input');
const message = document.querySelector('.feedback');

export default (obj) => {
  if (!obj.isValid) {
    input.classList.add('is-invalid');
    message.classList.add('text-danger');
    const text = obj.error.startsWith('this must be a valid URL')
      ? 'Ссылка должна быть валидным URL'
      : 'RSS уже существует';
    message.textContent = text;
  }
  if (obj.isValid) {
    input.classList.remove('is-invalid');
    message.classList.remove('text-danger');
    message.classList.add('text-success');
    message.textContent = 'RSS успешно загружен';
  }
};
