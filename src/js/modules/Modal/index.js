import { TypeText, ButtonSubmitStatusText } from '../../constants';
import { Postcard } from '../Postcard';
import { ImageSrcMap } from './helpers';

export const initModal = () => {
  const cards = document.querySelector('.cards');
  const modal = document.getElementById('modal');
  const modalWrapper = modal.querySelector('.modal__wrapper');
  const draftCanvas = modal.querySelector('#draft');
  const form = modal.querySelector('.form');
  const buttonClose = form.querySelector('.form__close');
  const headingInput = form.querySelector('#form-input');
  const messageInput = form.querySelector('#form-textarea');
  const colorInput = form.querySelector('#form-color');

  cards.addEventListener('click', (evt) => {
    const target = evt.target.dataset.value;

    let draft = new Postcard(draftCanvas);

    const inputText = function (text, typeText, isLiveTyping) {
      this.wrapText(text, typeText, isLiveTyping);
    };
    const inputColor = function (color, heading, message) {
      this.setColor(color);
      this.wrapText(heading, TypeText.HEADING, true);
      this.wrapText(message, TypeText.MESSAGE, true);
    };

    const handleHeadingInput = (evt) => {
      inputText.call(draft, evt.target.value, TypeText.HEADING, true);
    };
    const handleMessageInput = (evt) => {
      inputText.call(draft, evt.target.value, TypeText.MESSAGE, true);
    };
    const handleColorInput = (evt) => {
      inputColor.call(draft, evt.target.value, headingInput.value, messageInput.value);
    };

    headingInput.addEventListener('input', handleHeadingInput);
    messageInput.addEventListener('input', handleMessageInput);
    colorInput.addEventListener('change', handleColorInput);

    const img = document.createElement('img');
    img.setAttribute('src', ImageSrcMap[target]['1x']);
    img.setAttribute('srcset', `${ImageSrcMap[target]['2x']} 2x`);
    img.setAttribute('alt', `image${target}-big`);
    img.setAttribute('width', 600);
    img.setAttribute('height', 900);
    modalWrapper.prepend(img);

    modal.showModal();

    modal.addEventListener('close', () => {
      headingInput.value = '';
      messageInput.value = '';
      colorInput.value = '#000000';
      headingInput.removeEventListener('input', handleHeadingInput);
      messageInput.removeEventListener('input', handleMessageInput);
      colorInput.removeEventListener('change', handleColorInput);
      img.remove();
      draft.destroy();
      draft = null;
    });

    buttonClose.addEventListener('click', () => {
      modal.close();
    });

    const imgForJpeg = document.createElement('img');
    imgForJpeg.setAttribute('src', ImageSrcMap[target]['1x']);

    form.addEventListener('submit', (evt) => {
      evt.preventDefault();

      const formData = new FormData(form);
      const heading = formData.get('heading');
      const message = formData.get('message');
      const color = formData.get('color');

      const finalCanvas = document.createElement('canvas');
      let final = new Postcard(finalCanvas);
      final.drawImage(imgForJpeg);
      final.setColor(color);
      final.wrapText(heading, TypeText.HEADING, false);
      final.wrapText(message, TypeText.MESSAGE, false);
      final.download();
      final.destroy();
      final = null;

      const formSubmit = form.querySelector('.form__submit');
      headingInput.setAttribute('disabled', true);
      messageInput.setAttribute('disabled', true);
      colorInput.setAttribute('disabled', true);

      formSubmit.classList.add('success');
      formSubmit.textContent = ButtonSubmitStatusText.SUCCESS;
      formSubmit.setAttribute('disabled', true);

      setTimeout(() => {
        formSubmit.removeAttribute('disabled');
        formSubmit.textContent = ButtonSubmitStatusText.IDLE;
        formSubmit.classList.remove('success');

        headingInput.removeAttribute('disabled');
        messageInput.removeAttribute('disabled');
        colorInput.removeAttribute('disabled');
      }, 2000);
    });
  });
};
