import { StreamLanguage } from '@codemirror/language';
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { tags } from '@lezer/highlight';
import {
  REAL_INSTRUCTION_MNEMONICS,
  PSEUDO_INSTRUCTION_MNEMONICS,
} from '../../../backend/types/asm.types';

const allMnemonics = [...REAL_INSTRUCTION_MNEMONICS, ...PSEUDO_INSTRUCTION_MNEMONICS];
const mnemonicPattern = new RegExp(
  `^(${allMnemonics.join('|')})(\\.f)?(?=\\s|$|,)`,
  'i',
);

const registerPattern = /^r[0-7]/i;

const labelPattern = /^\.[a-zA-Z_][a-zA-Z0-9_]*/;

const numberPattern = /^-?\d+/;

const hexPattern = /^0x[0-9a-fA-F]+/;

const noriLanguage = StreamLanguage.define({
  name: 'nori-asm',

  token(stream) {
    if (stream.eatSpace()) {
      return null;
    }

    if (stream.match('//')) {
      stream.skipToEnd();
      return 'comment';
    }

    if (stream.match(hexPattern)) {
      return 'number';
    }

    if (stream.match(labelPattern)) {
      return 'labelName';
    }

    if (stream.match(mnemonicPattern)) {
      return 'keyword';
    }

    if (stream.match(registerPattern)) {
      return 'variableName';
    }

    if (stream.match(numberPattern)) {
      return 'number';
    }

    if (stream.eat(',') || stream.eat(':')) {
      return 'punctuation';
    }

    stream.next();
    return null;
  },

  languageData: {
    commentTokens: { line: '//' },
  },
});

const noriLightHighlightStyle = HighlightStyle.define([
  { tag: tags.keyword, color: '#d73a49', fontWeight: '600' },
  { tag: tags.variableName, color: '#0086b3' },
  { tag: tags.labelName, color: '#e36209' },
  { tag: tags.number, color: '#005cc5' },
  { tag: tags.comment, color: '#6a737d', fontStyle: 'italic' },
  { tag: tags.punctuation, color: '#24292e' },
]);

export const nori = [
  noriLanguage,
  syntaxHighlighting(noriLightHighlightStyle),
];
