import {staticFile} from 'remotion';

export const fontFaces = `
@font-face { font-family: 'Cormorant'; src: url('${staticFile('fonts/Cormorant.ttf')}') format('truetype'); font-weight: 300 700; font-style: normal; }
@font-face { font-family: 'Cormorant'; src: url('${staticFile('fonts/CormorantItalic.ttf')}') format('truetype'); font-weight: 300 700; font-style: italic; }
@font-face { font-family: 'Jost'; src: url('${staticFile('fonts/Jost.ttf')}') format('truetype'); font-weight: 100 900; font-style: normal; }
`;
