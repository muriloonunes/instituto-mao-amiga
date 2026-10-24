// O react-native-svg-transformer (configurado no metro.config.js) transforma
// arquivos .svg em componentes React. Esta declaração informa isso ao TypeScript.
declare module '*.svg' {
    import React from 'react';
    import {SvgProps} from 'react-native-svg';
    const content: React.FC<SvgProps>;
    export default content;
}
