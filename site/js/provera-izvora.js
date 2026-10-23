const KLJUC = new Set(
  "if else return function const let var class new this typeof void delete in of instanceof await async yield import export from as default try catch finally throw break continue switch case for while do debugger with super extends static get set null true false undefined".split(
    " ",
  ),
);

const GLOBALI = new Set(
  "console Math JSON Object Array String Number Boolean Date RegExp Error TypeError ReferenceError SyntaxError Map Set WeakMap WeakSet Promise Symbol parseInt parseFloat isNaN isFinite NaN Infinity globalThis document window require module exports process Buffer setTimeout clearTimeout setInterval clearInterval fetch URL URLSearchParams localStorage navigator location alert confirm prompt requestAnimationFrame cancelAnimationFrame getComputedStyle queueMicrotask structuredClone crypto performance history CustomEvent Event AbortController FormData TextEncoder TextDecoder atob btoa setImmediate clearImmediate Intl Proxy Reflect BigInt encodeURIComponent decodeURIComponent encodeURI decodeURI MutationObserver WebSocket Headers Request Response Blob File Node Element HTMLElement __dirname __filename global arguments eval".split(
    " ",
  ),
);

function maskiraj(izvor) {
  let o = "";
  let i = 0;
  const s = String(izvor ?? "");
  while (i < s.length) {
    const c = s[i];
    const n = s[i + 1];
    if (c === "/" && n === "/") {
      while (i < s.length && s[i] !== "\n") {
        o += " ";
        i += 1;
      }
      continue;
    }
    if (c === "/" && n === "*") {
      o += "  ";
      i += 2;
      while (i < s.length && !(s[i] === "*" && s[i + 1] === "/")) {
        o += s[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      o += "  ";
      i += 2;
      continue;
    }
    if (c === "'" || c === '"' || c === "`") {
      const q = c;
      o += " ";
      i += 1;
      while (i < s.length && s[i] !== q) {
        if (s[i] === "\\") {
          o += "  ";
          i += 2;
          continue;
        }
        o += s[i] === "\n" ? "\n" : " ";
        i += 1;
      }
      o += " ";
      i += 1;
      continue;
    }
    o += c;
    i += 1;
  }
  return o;
}

function preskoci(t, i) {
  while (i < t.length && /\s/.test(t[i])) i += 1;
  return i;
}

const IME = String.raw`[$_\p{ID_Start}][$\u200C\u200D\p{ID_Continue}]*`;

function procitajIme(t, i) {
  const m = new RegExp(`^${IME}`, "u").exec(t.slice(i));
  if (!m) return null;
  return { ime: m[0], i: i + m[0].length };
}

function preskociVrednost(t, i) {
  let dubina = 0;
  let uglasta = 0;
  let viticasta = 0;
  while (i < t.length) {
    const c = t[i];
    if (c === "(") dubina += 1;
    else if (c === ")") {
      if (dubina === 0 && uglasta === 0 && viticasta === 0) break;
      dubina -= 1;
    } else if (c === "[") uglasta += 1;
    else if (c === "]") uglasta -= 1;
    else if (c === "{") viticasta += 1;
    else if (c === "}") viticasta -= 1;
    else if (c === "," && dubina === 0 && uglasta === 0 && viticasta === 0) break;
    else if (c === ";" && dubina === 0 && uglasta === 0 && viticasta === 0) break;
    i += 1;
  }
  return i;
}

function procitajVez(t, i, decl) {
  const pocetak = i;
  i = preskoci(t, i);
  if (t[i] === "{" || t[i] === "[") {
    const zatvor = t[i] === "{" ? "}" : "]";
    i += 1;
    while (i < t.length && t[i] !== zatvor) {
      const pre = i;
      i = preskoci(t, i);
      if (t[i] === zatvor) break;
      if (t[i] === ",") {
        i += 1;
        continue;
      }
      const ime = procitajIme(t, i);
      if (!ime) {
        i += 1;
        continue;
      }
      i = preskoci(t, ime.i);
      if (t[i] === ":") i = procitajVez(t, i + 1, decl);
      else {
        if (!KLJUC.has(ime.ime)) decl.add(ime.ime);
        if (t[i] === "=") i = preskociVrednost(t, i + 1);
      }
      if (i <= pre) i = pre + 1;
    }
    if (t[i] === zatvor) i += 1;
    return i;
  }
  const ime = procitajIme(t, i);
  if (!ime || KLJUC.has(ime.ime)) return Math.max(i, pocetak + 1);
  decl.add(ime.ime);
  return ime.i;
}

function procitajListu(t, i, decl) {
  while (i < t.length && t[i] !== ")") {
    i = preskoci(t, i);
    if (t[i] === ")") break;
    if (t[i] === ",") {
      i += 1;
      continue;
    }
    i = procitajVez(t, i, decl);
    i = preskoci(t, i);
    if (t[i] === "=") i = preskociVrednost(t, i + 1);
  }
  if (t[i] === ")") i += 1;
  return i;
}

function deklaracije(t) {
  const decl = new Set();
  const re = /\b(const|let|var|function|class|catch|for)\b/g;
  let m;
  while ((m = re.exec(t))) {
    let i = preskoci(t, m.index + m[0].length);
    if (m[1] === "function") {
      const ime = procitajIme(t, i);
      if (ime && !KLJUC.has(ime.ime)) {
        const posle = preskoci(t, ime.i);
        if (t[posle] === "(") decl.add(ime.ime);
        i = ime.i;
      }
      i = preskoci(t, i);
      if (t[i] === "(") i = procitajListu(t, i + 1, decl);
      continue;
    }
    if (m[1] === "class") {
      const ime = procitajIme(t, i);
      if (ime && !KLJUC.has(ime.ime)) decl.add(ime.ime);
      continue;
    }
    if (m[1] === "catch") {
      i = preskoci(t, i);
      if (t[i] === "(") procitajListu(t, i + 1, decl);
      continue;
    }
    if (m[1] === "for") {
      i = preskoci(t, i);
      if (t[i] !== "(") continue;
      const kw = procitajIme(t, preskoci(t, i + 1));
      if (!kw || !["const", "let", "var"].includes(kw.ime)) continue;
      procitajVez(t, kw.i, decl);
      continue;
    }
    while (i < t.length) {
      i = procitajVez(t, i, decl);
      i = preskoci(t, i);
      if (t[i] === "=") i = preskociVrednost(t, i + 1);
      i = preskoci(t, i);
      if (t[i] === ",") {
        i += 1;
        continue;
      }
      break;
    }
  }
  const strela = new RegExp(String.raw`(?:async\s*)?(?:\(([^)]*)\)|(${IME}))\s*=>`, "gu");
  let s;
  while ((s = strela.exec(t))) {
    if (s[1] != null) procitajListu(`(${s[1]})`, 1, decl);
    else if (s[2] && !KLJUC.has(s[2])) decl.add(s[2]);
  }
  return decl;
}

function koriscenja(t) {
  const re = new RegExp(IME, "gu");
  const izlaz = [];
  let m;
  while ((m = re.exec(t))) {
    const ime = m[0];
    if (KLJUC.has(ime) || GLOBALI.has(ime)) continue;
    let j = m.index - 1;
    while (j >= 0 && /\s/.test(t[j])) j -= 1;
    if (t[j] === ".") continue;
    let k = preskoci(t, m.index + ime.length);
    if ((t[j] === "{" || t[j] === ",") && t[k] === ":") continue;
    izlaz.push(ime);
  }
  return izlaz;
}

export function greskaSintakse(izvor) {
  const telo = String(izvor ?? "");
  if (!telo.trim()) return "";
  try {
    new Function(telo);
    return "";
  } catch (greska) {
    return greska instanceof SyntaxError ? greska.message : String(greska.message || greska);
  }
}

export function nedefinisana(izvor) {
  const t = maskiraj(izvor);
  const decl = deklaracije(t);
  const fali = [];
  for (const ime of koriscenja(t)) {
    if (!decl.has(ime) && !fali.includes(ime)) fali.push(ime);
  }
  return fali;
}

export function proveriJs(izvor) {
  const sintaksa = greskaSintakse(izvor);
  if (sintaksa) return sintaksa;
  const fali = nedefinisana(izvor);
  if (!fali.length) return "";
  if (fali.length === 1) return `${fali[0]} nije definisano`;
  return `Nije definisano: ${fali.join(", ")}`;
}
