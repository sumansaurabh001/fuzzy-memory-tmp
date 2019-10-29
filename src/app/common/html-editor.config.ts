
export const defaultQuillConfig = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote', 'code-block'],

    [{header: 1}, {header: 2}], // custom button values
    [{list: 'ordered'}, {list: 'bullet'}],
    [{script: 'sub'}, {script: 'super'}], // superscript/subscript
    [{indent: '-1'}, {indent: '+1'}], // outdent/indent
    [{direction: 'rtl'}], // text direction

    [{size: ['small', false, 'large', 'huge']}], // custom dropdown
    [{header: [1, 2, 3, 4, 5, 6, false]}],

    [
      {color: []},
      {background: []}
    ], // dropdown with defaults from theme
    [{font: []}],
    [{align: []}],

    ['clean'], // remove formatting button

    ['link', 'image', 'video'] // link and image, video
  ]
};


export function defaultEditorConfig() {
  return {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote'],
    [{list: 'ordered'}, {list: 'bullet'}],
    [{indent: '-1'}, {indent: '+1'}], // outdent/indent
    [{header: [1, 2, 3, 4, 5, 6, false]}],
    [
      {color: []}
    ], // dropdown with defaults from theme
    [{align: []}],

    ['link'],
    ['code-block'],
    ['emoji']
  ]
}
}

export function fullOptionsEditorConfig() {

  const config = defaultEditorConfig();

  config['emoji-toolbar'] = true;
  config["syntax"] = true;

  return config;
}


export const minimalEditorConfig = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'], // toggled buttons
    ['blockquote'],
    [
      {color: []}
    ], // dropdown with defaults from theme
    ['link']
  ]
}
