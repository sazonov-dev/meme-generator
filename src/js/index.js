import '../assets/styles/main.css';

const canvasContainer = document.querySelector('.draw');
const file = document.querySelector('#file');
const addTextButton = document.querySelector('.addText');
const saveMemeButton = document.querySelector('.saveMeme');
const textSelect = document.querySelector('#textSelect');
const xInput = document.querySelector('#xInteractive');
const yInput = document.querySelector('#yInteractive');
const colorInteractive = document.querySelector('#colorInteractive');
const fzInteractive = document.querySelector('#fzInteractive');
const canvasStorage = {
    selected: null
};

const containerAdder = (element, container) => {
    console.log(canvasStorage);
    return container.appendChild(element);
}

const canvasRemove = (id) => {
    const elements = canvasContainer.querySelectorAll('canvas');
    elements.forEach((element) => {
        if (element.dataset.id === id) {
            return canvasContainer.removeChild(element)
        }
    })
}

const canvasIdGenerate = () => {
    return `${Math.floor(Math.random() * 1999329)}`;
}

const canvasTextCreate = ({text, x, y, color, fz}) => {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = 400;
    canvasElement.height = 400;
    canvasElement.id = canvasIdGenerate();
    canvasElement.dataset.id = text;
    const ctx = canvasElement.getContext('2d');
    ctx.strokeStyle = color;
    ctx.font = `${fz}px serif`
    ctx.strokeText(text, x, y);
    optionCreate(text);
    return containerAdder(canvasElement, canvasContainer);
}

const optionCreate = (text) => {
    const option = document.createElement('option');
    const options = Array.from(document.querySelectorAll('option'));
    option.value = text;
    option.id = text;
    option.dataset.id = text;
    option.innerText = text;

    if (!options.some((option) => option.dataset.id === text)) {
        textSelect.appendChild(option);
    }
}

const isSelected = (event) => {
    canvasStorage.selected = event.target.options[event.target.selectedIndex].text;
}
const canvasTextRender = (action, event) => {
    const target = event.target;
    const value = target.value;
    const storageId = canvasStorage.selected;

    switch (action) {
        case "x":
            canvasStorage[storageId] = {
                ...canvasStorage[storageId],
                x: value
            }
            canvasRemove(storageId);
            canvasTextCreate(canvasStorage[storageId]);
            break;
        case "y":
            canvasStorage[storageId] = {
                ...canvasStorage[storageId],
                y: value
            }
            canvasRemove(storageId);
            canvasTextCreate(canvasStorage[storageId]);
            break;
        case "color":
            canvasStorage[storageId] = {
                ...canvasStorage[storageId],
                color: value
            }
            canvasRemove(storageId);
            canvasTextCreate(canvasStorage[storageId]);
            break;
        case "fz":
            canvasStorage[storageId] = {
                ...canvasStorage[storageId],
                fz: value
            }
            canvasRemove(storageId);
            canvasTextCreate(canvasStorage[storageId]);
            break;
    }
}

const canvasDrawImage = (target) => {
    const canvasElement = document.createElement('canvas');
    canvasElement.width = 400;
    canvasElement.height = 400;
    canvasElement.id = 'image';
    const ctx = canvasElement.getContext('2d');
    const reader = new FileReader();

    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            ctx.drawImage(img, 0, 0, canvasElement.width, canvasElement.height);

            containerAdder(canvasElement, canvasContainer);
        };
        img.src = event.target.result;
    };

    reader.readAsDataURL(target.files[0]);
}

const isImageDrawn = () => {
    const image = canvasContainer.querySelector('#image') || false;

    if (image) {
        canvasContainer.removeChild(image);
    }

    return false;
}

const textHandler = (event, action) => {
    const container = event.target.closest('.text-settings');
    let inputs = null;
    let storageId = null;
    switch (action) {
        case "ADD_TEXT":
            inputs = Array.from(container.querySelectorAll('input'));
            inputs.forEach((input) => {
                if (input.id === 'text') {
                    storageId = input.value;
                    canvasStorage[input.value] = {};
                }

                canvasStorage[storageId] = {
                    ...canvasStorage[storageId],
                    [input.id]: input.value
                }
            })
            canvasTextCreate(canvasStorage[storageId]);
            console.log(canvasStorage[storageId])
            break;
    }
}

const memePrepared = () => {
    const a = document.createElement('a');
    const canvas = document.querySelector('#image');
    const ctx = canvas.getContext('2d');
    const keys = Object.keys(canvasStorage).filter((key) => key !== 'selected');
    keys.forEach((key) => {
        ctx.strokeStyle = canvasStorage[key].color;
        ctx.font = `${canvasStorage[key].fz}px serif`;
        ctx.strokeText(canvasStorage[key].text, canvasStorage[key].x, canvasStorage[key].y)
    })
    a.href = canvas.toDataURL('image/jpeg');
    a.download = 'meme.jpg'

    document.querySelector('main').appendChild(a);
    a.click()
    document.querySelector('main').removeChild(a);
}

const uploadImage = (event) => {
    const target = event.target;
    isImageDrawn();
    return canvasDrawImage(target)
}

document.addEventListener('DOMContentLoaded', () => {
    file.addEventListener('change', uploadImage);
    addTextButton.addEventListener('click', (event) => textHandler(event, 'ADD_TEXT'));
    xInput.addEventListener('input', (event) => canvasTextRender('x', event));
    yInput.addEventListener('input', (event) => canvasTextRender('y', event));
    colorInteractive.addEventListener('input', (event) => canvasTextRender('color', event))
    fzInteractive.addEventListener('input', (event) => canvasTextRender('fz', event))
    textSelect.addEventListener('change', isSelected);
    saveMemeButton.addEventListener('click', memePrepared);
})
