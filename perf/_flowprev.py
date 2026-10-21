from PIL import Image
im = Image.open(r"perf/figures/Figure_1_1_business_process.png")
im.thumbnail((900,900))
im.save(r"perf/_flow_preview.png")
print(im.size)
