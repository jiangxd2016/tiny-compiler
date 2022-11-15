interface tokensType {
  type?: string;
  value?: string;
}
interface astItemType {
  type?: string;
  name?: string;
  params: astItemType[] & tokensType[];
}
interface astType {
  type: string;
  body: astItemType[] & tokensType[];
}
function tokenizer(input: string): tokensType[] {
  let current = 0;
  const tokens = [];

  while (current < input.length) {

    let char = input[current];

    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: '('
      });
      current++;
      continue;
    }

    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: ')'
      });
      current++;
      continue;
    }

    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    const NUMBERS = /\d/;
    if (NUMBERS.test(char)) {
      let value = '';

      while (NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'number', value });

      continue;
    }

    if (char === '"') {
      let value = '';

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      char = input[++current];

      tokens.push({ type: 'string', value });

      continue;
    }

    const LETTERS = /[a-z]/i;

    if (LETTERS.test(char)) {
      let value = '';

      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({ type: 'name', value });

      continue;
    }

    throw new TypeError('I dont know what this character is: ' + char);
  }

  return tokens;
}

function parser(tokens: tokensType[]) {
  let current = 0;

  const ast: astType = {
    type: 'Program',
    body: []

  };

  function walk(): Partial<astItemType & tokensType> {

    let token = tokens[current];

    if (token.type === 'number') {
      current++;
      return {
        type: 'NumberLiteral',
        value: token.value,
      };
    }

    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      };
    }

    if (token.type === 'paren' && token.value === '(') {
      token = tokens[++current];
      const node: astItemType = {
        name: token.value,
        type: 'CallExpression',
        params: []
      };
      token = tokens[++current];

      while ((token.type !== 'paren') || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk());
        token = tokens[current];
      }
      current++;
      return node;
    }
    throw new TypeError(token.type);
  }
  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
}
export {
  tokenizer,
  parser
};
