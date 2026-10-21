import io
s = io.open("perf/build-ch1-v5.mjs", encoding="utf-8").read()
s = s.replace("// perf/build-ch1-v5.mjs -- build Chapter 1 v5 (.docx)",
              "// perf/build-ch1-v6.mjs -- build Chapter 1 v6 (.docx)")
s = s.replace("node perf/build-ch1-v5.mjs <in.docx> <out.docx>",
              "node perf/build-ch1-v6.mjs <in.docx> <out.docx>")
s = s.replace("import { REPLACE, DELETE_BETWEEN, DROP_TABLES, AFTER, REFS } from './ch1-edits-v5.mjs';",
              "import { REPLACE, DELETE_BETWEEN, DROP_TABLES, AFTER, REFS, FIGURE_SWAP } from './ch1-edits-v6.mjs';")

# swap the existing business-process picture for the new vector file
anchor = "const refsIdx = findIdx('REFERENCES');"
swap = """// ------------------------------------------------ replace existing pictures
for (const sw of FIGURE_SWAP) {
  const ci = findIdx(sw.beforeCaption);
  if (ci < 0) { problems.push(`SWAP caption missing "${sw.beforeCaption.slice(0, 40)}"`); continue; }
  const ti = ci - 1;
  if (!paras[ti] || !paras[ti].xml.includes('<w:drawing>')) {
    problems.push(`SWAP target above "${sw.beforeCaption.slice(0, 30)}" is not a picture`);
    continue;
  }
  if (drop.has(ti)) { problems.push('SWAP target is inside a deleted range'); continue; }
  plan.set(ti, { figure: sw.fig });
  register(sw.fig);
}

"""
s = s.replace(anchor, swap + anchor, 1)

s = s.replace("""      const pl = plan.get(i);
      out += pl.cap ? captionParagraph(pl.cap[0], pl.cap[1]) : rebuild(p.xml, pl.text);""",
"""      const pl = plan.get(i);
      if (pl.figure) out += imageParagraph(figureInfo[pl.figure]);
      else if (pl.cap) out += captionParagraph(pl.cap[0], pl.cap[1]);
      else out += rebuild(p.xml, pl.text);""")

io.open("perf/build-ch1-v6.mjs", "w", encoding="utf-8", newline="\n").write(s)
print("written perf/build-ch1-v6.mjs")
