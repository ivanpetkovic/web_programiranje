import { EditorState, RangeSetBuilder, StateField } from "@codemirror/state";
import { Decoration, EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultHighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { defaultKeymap, history, historyKeymap, indentWithTab } from "@codemirror/commands";
import { html } from "@codemirror/lang-html";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDarkHighlightStyle } from "@codemirror/theme-one-dark";

function jezik(put) {
  if (put.endsWith(".css")) return css();
  if (put.endsWith(".html")) return html();
  return javascript();
}

function tamnaTema() {
  const zakucana = document.documentElement.dataset.tema;
  if (zakucana === "mornar" || zakucana === "ugalj") return true;
  if (zakucana === "pesak" || zakucana === "terakota") return false;
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}

function dekor(linije) {
  const graditelj = new RangeSetBuilder();
  let pos = 0;
  for (const linija of linije) {
    if (linija.tip === "dodato") {
      graditelj.add(pos, pos, Decoration.line({ class: "cm-linija-dodato" }));
    } else if (linija.tip === "obrisano") {
      graditelj.add(pos, pos, Decoration.line({ class: "cm-linija-obrisano" }));
    }
    pos += linija.tekst.length + 1;
  }
  return graditelj.finish();
}

function ekstenzije(put, samoCitaj, linije, onPromena) {
  const deco = linije ? dekor(linije) : Decoration.none;
  const polje = StateField.define({
    create() {
      return deco;
    },
    update(vrednost, tr) {
      return vrednost.map(tr.changes);
    },
    provide: (poljeStanja) => EditorView.decorations.from(poljeStanja),
  });
  const slusac = EditorView.updateListener.of((update) => {
    if (!update.docChanged || samoCitaj) return;
    const korisnik = update.transactions.some(
      (tr) => tr.isUserEvent("input") || tr.isUserEvent("delete") || tr.isUserEvent("undo") || tr.isUserEvent("redo"),
    );
    if (korisnik) onPromena(update.state.doc.toString());
  });
  return [
    lineNumbers(),
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
    syntaxHighlighting(tamnaTema() ? oneDarkHighlightStyle : defaultHighlightStyle, { fallback: true }),
    jezik(put),
    EditorView.lineWrapping,
    EditorView.contentAttributes.of({ "aria-label": "Sadržaj fajla" }),
    EditorView.theme({
      "&": { backgroundColor: "var(--code)", color: "var(--ink)", width: "100%", maxWidth: "100%", height: "100%" },
      ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, monospace", overflow: "auto", width: "100%", maxWidth: "100%" },
      ".cm-gutters": { backgroundColor: "var(--code)", color: "var(--muted)", borderRight: "1px solid var(--line)" },
      ".cm-content": { caretColor: "var(--ink)" },
      "& .cm-cursor, & .cm-dropCursor": { borderLeftColor: "var(--ink)" },
      "&.cm-focused": { outline: "2px solid var(--amber)", outlineOffset: "2px" },
    }, { dark: tamnaTema() }),
    polje,
    samoCitaj ? [EditorState.readOnly.of(true), EditorView.editable.of(false)] : slusac,
  ];
}

export function napraviPogled(roditelj) {
  return new EditorView({
    parent: roditelj,
    state: EditorState.create({ doc: "", extensions: ekstenzije("", true, null, () => {}) }),
  });
}

export function postaviPogled(pogled, { tekst, samoCitaj, linije, put, onPromena }) {
  const izLinija = Array.isArray(linije) && linije.length ? linije.map((linija) => linija.tekst).join("\n") : "";
  const doc = izLinija || tekst || "";
  pogled.setState(
    EditorState.create({
      doc,
      extensions: ekstenzije(put, samoCitaj, linije, onPromena),
    }),
  );
}
