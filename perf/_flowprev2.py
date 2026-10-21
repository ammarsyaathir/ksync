from PIL import Image
im = Image.open("perf/figures/Figure_1_1_business_process.png")
im.thumbnail((900,900))
im.save("perf/_flow_preview2.png")
print(im.size)
