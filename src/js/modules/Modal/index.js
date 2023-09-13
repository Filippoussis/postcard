import { TypeText, ButtonSubmitStatusText } from '../../constants';
import { Postcard } from '../Postcard';
import { ImageSrcMap } from './helpers';

export const initModal = () => {
  let target = null;

  // init cards
  const cards = document.querySelector('.cards');

  // init modal
  const modal = document.getElementById('modal');
  const modalWrapper = modal.querySelector('.modal__wrapper');

  // init form
  const form = modal.querySelector('.form');
  const buttonClose = form.querySelector('.form__close');
  const headingInput = form.querySelector('#form-input');
  const messageInput = form.querySelector('#form-textarea');
  const colorInput = form.querySelector('#form-color');
  const formSubmit = form.querySelector('.form__submit');

  // init canvases
  const draftCanvas = modal.querySelector('#draft');
  const finalCanvas = document.createElement('canvas');
  const draft = new Postcard(draftCanvas);
  const final = new Postcard(finalCanvas);

  headingInput.addEventListener('input', (evt) => {
    draft.wrapText(evt.target.value, TypeText.HEADING, true);
  });
  messageInput.addEventListener('input', (evt) => {
    draft.wrapText(evt.target.value, TypeText.MESSAGE, true);
  });
  colorInput.addEventListener('change', (evt) => {
    draft.setColor(evt.target.value);
    draft.wrapText(headingInput.value, TypeText.HEADING, true);
    draft.wrapText(messageInput.value, TypeText.MESSAGE, true);
  });

  cards.addEventListener('click', (evt) => {
    target = evt.target.dataset.value;

    const img = document.createElement('img');
    img.setAttribute('src', ImageSrcMap[target]['1x']);
    img.setAttribute('srcset', `${ImageSrcMap[target]['2x']} 2x`);
    img.setAttribute('alt', `image${target}-big`);
    img.setAttribute('width', 600);
    img.setAttribute('height', 900);
    img.setAttribute('class', 'draft-image');
    modalWrapper.prepend(img);

    modal.showModal();
  });

  modal.addEventListener('close', () => {
    headingInput.value = '';
    messageInput.value = '';
    colorInput.value = '#000000';
    draft.setColor('#000000');
    draft.clear();
    modal.querySelector('.draft-image').remove();
  });

  buttonClose.addEventListener('click', () => {
    modal.close();
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const imgForJpeg = document.createElement('img');
    imgForJpeg.setAttribute('src', ImageSrcMap[target]['1x']);

    imgForJpeg.onload = () => {
      final.drawImage(imgForJpeg);
      final.setColor(colorInput.value);
      final.wrapText(headingInput.value, TypeText.HEADING, false);
      final.wrapText(messageInput.value, TypeText.MESSAGE, false);
      final.download();
      final.clear();
      imgForJpeg.remove();
    };

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
};
