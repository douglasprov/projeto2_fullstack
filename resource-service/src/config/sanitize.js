import xss from 'xss';

// Sanitiza entradas de texto contra XSS (critério 15)
export function limparTexto(valor) {
  return typeof valor === 'string' ? xss(valor.trim()) : valor;
}
