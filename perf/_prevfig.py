from PIL import Image
for name in ["Figure_1_1_platforms_checked","Figure_1_6_importance_reliable_source"]:
    im = Image.open(f"perf/figures/{name}.png")
    im.thumbnail((950,950))
    im.save(f"perf/_prev_{name}.png")
    print(name, im.size)
