import {staticFile} from 'remotion';

export const fontFaces = `
@font-face { font-family: 'Bodoni'; src: url('${staticFile('fonts/BodoniModa.ttf')}') format('truetype'); font-weight: 400 900; font-style: normal; }
@font-face { font-family: 'Garamond'; src: url('${staticFile('fonts/EBGaramondItalic.ttf')}') format('truetype'); font-weight: 400 800; font-style: italic; }
@font-face { font-family: 'Jost'; src: url('${staticFile('fonts/Jost.ttf')}') format('truetype'); font-weight: 100 900; font-style: normal; }
`;
