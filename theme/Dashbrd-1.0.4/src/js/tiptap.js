//
// tiptap.js
//

import { Editor } from '@tiptap/core';
import BubbleMenu from '@tiptap/extension-bubble-menu';
import Placeholder from '@tiptap/extension-placeholder';
import StarterKit from '@tiptap/starter-kit';

export default class Tiptap {
  // Declare private fields
  #element;
  #placeholder;
  #actions;
  #menu;
  #buttons;
  editor;

  constructor(options) {
    this.options = options;

    // Initialize private fields
    this.#element = this.options.element;
    this.#placeholder = this.#element.dataset.placeholder ? this.#element.dataset.placeholder : undefined;

    // Define bubble menu actions
    this.#actions = [
      { name: 'heading', method: 'toggleHeading', icon: 'title' },
      { name: 'bold', method: 'toggleBold', icon: 'format_bold' },
      { name: 'italic', method: 'toggleItalic', icon: 'format_italic' },
      { name: 'strike', method: 'toggleStrike', icon: 'format_strikethrough' },
      { name: 'bulletList', method: 'toggleBulletList', icon: 'format_list_bulleted' },
      { name: 'orderedList', method: 'toggleOrderedList', icon: 'format_list_numbered' },
      { name: 'blockquote', method: 'toggleBlockquote', icon: 'format_quote' },
    ];

    // Initialize editor
    this.initEditor();
  }

  // Method to initialize the editor
  initEditor() {
    // Create bubble menu
    this.#menu = document.createElement('div');
    this.#menu.classList.add('popover', 'tiptap-popover');

    this.#menu.innerHTML = `
      <div class="popover-body">
        ${this.#actions
          .map((action) => {
            return `<button class="btn btn-sm btn-link" data-name="${action.name}" data-method="${action.method}" type="button"><span class="material-symbols-outlined">${action.icon}</span></button>`;
          })
          .join('')}
      </div>
    `;

    // Buttons inside the menu
    this.#buttons = this.#menu.querySelectorAll('[data-method]');

    // Add event listeners to the buttons
    this.#buttons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const method = button.dataset.method;
        const options = method === 'toggleHeading' ? { level: 2 } : {};
        this.editor.chain().focus()[method](options).run();
        button.classList.toggle('active');
      });
    });

    // Default options for the editor
    const defaultOptions = {
      element: this.#element,
      extensions: [
        StarterKit.configure({
          blockquote: { HTMLAttributes: { class: 'blockquote' } },
          heading: { levels: [2], HTMLAttributes: { class: 'fs-5' } },
        }),
        Placeholder.configure({ placeholder: this.#placeholder }),
        BubbleMenu.configure({ element: this.#menu, updateDelay: 0 }),
      ],
      editorProps: { attributes: { class: this.#element.classList } },
      onCreate: ({ editor }) => {
        editor.setOptions({ editorProps: { attributes: { class: `${this.#element.classList} is-editor-created` } } });
        this.editor = editor; // Store the editor instance
      },
      onSelectionUpdate: ({ editor }) => {
        this.#buttons.forEach((button) => {
          const name = button.dataset.name;
          editor.isActive(name) ? button.classList.add('active') : button.classList.remove('active');
        });
      },
    };

    const mergedOptions = {
      ...this.options,
      ...defaultOptions,
    };

    // Initialize the editor
    this.editor = new Editor(mergedOptions);
  }
}

// Make available globally for users of the /dist folder
// Feel free to comment this out if you're working in the /src folder
window.Tiptap = Tiptap;
