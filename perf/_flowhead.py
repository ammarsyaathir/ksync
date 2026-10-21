import io
p="perf/make-flowchart.mjs"
s=io.open(p,encoding="utf-8").read()

s = s.replace("const W = 920, H = 600;", "const W = 920, H = 650;")

old = "p.push(`<rect width=\"${W}\" height=\"${H}\" fill=\"#ffffff\"/>`);"
new = ("p.push(`<rect width=\"${W}\" height=\"${H}\" fill=\"#ffffff\"/>`);\n"
       "p.push(`<text x=\"${W / 2}\" y=\"34\" font-family=\"Arial\" font-size=\"21\" font-weight=\"bold\" fill=\"${INK}\" text-anchor=\"middle\">How fans currently find, discuss and confirm K-pop event information</text>`);\n"
       "p.push('<g transform=\"translate(0,50)\">');")
print("rect found:", s.count(old))
s = s.replace(old, new)

old2 = "p.push('</svg>');"
new2 = "p.push('</g>');\np.push('</svg>');"
print("svg close:", s.count(old2))
s = s.replace(old2, new2, 1)

# heading cell in the drawio file
old3 = "const cells = ['<mxCell id=\"0\"/>', '<mxCell id=\"1\" parent=\"0\"/>'];"
new3 = ("const cells = ['<mxCell id=\"0\"/>', '<mxCell id=\"1\" parent=\"0\"/>',\n"
        "  '<mxCell id=\"h1\" value=\"How fans currently find, discuss and confirm K-pop event information\" style=\"text;html=1;align=left;verticalAlign=middle;fontSize=14;fontStyle=1;fontFamily=Arial;\" vertex=\"1\" parent=\"1\"><mxGeometry x=\"0\" y=\"0\" width=\"700\" height=\"30\" as=\"geometry\"/></mxCell>'];")
print("drawio cells:", s.count(old3))
s = s.replace(old3, new3)
io.open(p,"w",encoding="utf-8",newline="\n").write(s)
