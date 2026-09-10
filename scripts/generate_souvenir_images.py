import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

W, H = 800, 500
SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SERIF_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def get_font(path, size):
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def studio_canvas(top_rgb, bot_rgb):
    img = Image.new("RGBA", (W, H))
    draw = ImageDraw.Draw(img)
    for y in range(H):
        ratio = y / H
        r = int(top_rgb[0] + (bot_rgb[0] - top_rgb[0]) * ratio)
        g = int(top_rgb[1] + (bot_rgb[1] - top_rgb[1]) * ratio)
        b = int(top_rgb[2] + (bot_rgb[2] - top_rgb[2]) * ratio)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))
    
    # Soft ambient glow behind product
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(glow)
    gdraw.ellipse([W*0.25, H*0.15, W*0.75, H*0.75], fill=(255, 255, 255, 28))
    glow = glow.filter(ImageFilter.GaussianBlur(50))
    img = Image.alpha_composite(img, glow)
    
    # Ground shadow
    shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sdraw = ImageDraw.Draw(shadow)
    sdraw.ellipse([W*0.22, H*0.75, W*0.78, H*0.87], fill=(15, 20, 25, 120))
    shadow = shadow.filter(ImageFilter.GaussianBlur(20))
    return Image.alpha_composite(img, shadow)

# 1. Malmö Chokladfabrik (Sweden)
def gen_malmo_chokladfabrik():
    img = studio_canvas((242, 238, 230), (220, 212, 198))
    draw = ImageDraw.Draw(img)
    
    # Chocolate bar block
    bx0, by0, bx1, by1 = 280, 100, 520, 410
    
    # Bar shadow
    b_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_sdraw = ImageDraw.Draw(b_shadow)
    b_sdraw.rounded_rectangle([bx0+6, by0+10, bx1+10, by1+12], radius=16, fill=(20, 15, 10, 80))
    b_shadow = b_shadow.filter(ImageFilter.GaussianBlur(10))
    img = Image.alpha_composite(img, b_shadow)
    draw = ImageDraw.Draw(img)
    
    # Packaging background - rich brick red / maroon stripes
    draw.rounded_rectangle([bx0, by0, bx1, by1], radius=16, fill=(138, 38, 30))
    
    # Signature Malmo Chokladfabrik candy stripes
    stripes = [(235, 195, 125), (35, 60, 95), (245, 240, 230), (138, 38, 30)]
    sw = (bx1 - bx0) // 12
    for i in range(12):
        c = stripes[i % len(stripes)]
        draw.rectangle([bx0 + i*sw, by0, bx0 + (i+1)*sw, by0 + 80], fill=c)
    
    # Central white parchment label
    lx0, ly0, lx1, ly1 = bx0 + 20, by0 + 100, bx1 - 20, by1 - 40
    draw.rounded_rectangle([lx0, ly0, lx1, ly1], radius=8, fill=(250, 248, 242), outline=(210, 190, 150), width=2)
    
    # Gold decorative border
    draw.rounded_rectangle([lx0+6, ly0+6, lx1-6, ly1-6], radius=6, outline=(195, 155, 80), width=1)
    
    f_title = get_font(SERIF_BOLD, 17)
    f_sub = get_font(SERIF, 11)
    f_badge = get_font(SANS_BOLD, 10)
    f_sw = get_font(SANS_BOLD, 12)
    
    draw.text((bx0 + 120, ly0 + 25), "MALMÖ", font=f_title, fill=(35, 25, 20), anchor="mm")
    draw.text((bx0 + 120, ly0 + 46), "CHOKLADFABRIK", font=f_sub, fill=(120, 35, 25), anchor="mm")
    draw.line([(lx0 + 30, ly0 + 60), (lx1 - 30, ly0 + 60)], fill=(195, 155, 80), width=1)
    
    draw.text((bx0 + 120, ly0 + 88), "70% MÖRK CHOKLAD", font=f_title, fill=(35, 25, 20), anchor="mm")
    draw.text((bx0 + 120, ly0 + 110), "PURE ORGANIC BEAN TO BAR", font=f_sub, fill=(90, 80, 70), anchor="mm")
    
    # Organic stamp
    draw.rounded_rectangle([bx0 + 75, ly0 + 135, bx0 + 165, ly0 + 160], radius=12, fill=(45, 95, 60))
    draw.text((bx0 + 120, ly0 + 147), "KRAV EKOLOGISK", font=f_badge, fill=(255, 255, 255), anchor="mm")
    
    draw.text((bx0 + 120, by1 - 18), "🇸🇪 HANDMADE IN MALMÖ", font=f_sw, fill=(240, 220, 190), anchor="mm")
    img.convert("RGB").save("site/assets/souvenirs/malmo-chokladfabrik.webp", "WEBP", quality=90)

# 2. Form/Design Center Minimalist Opener (Sweden)
def gen_form_design_opener():
    img = studio_canvas((230, 235, 238), (198, 208, 215))
    draw = ImageDraw.Draw(img)
    
    # Opener shadow
    ox0, oy0, ox1, oy1 = 330, 120, 470, 390
    o_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    o_sdraw = ImageDraw.Draw(o_shadow)
    o_sdraw.rounded_rectangle([ox0+10, oy0+15, ox1+14, oy1+18], radius=28, fill=(15, 25, 35, 90))
    o_shadow = o_shadow.filter(ImageFilter.GaussianBlur(15))
    img = Image.alpha_composite(img, o_shadow)
    draw = ImageDraw.Draw(img)
    
    # Matte Brushed Stainless Steel Opener Body
    for y in range(oy0, oy1):
        ratio = (y - oy0) / (oy1 - oy0)
        c = int(210 - ratio * 35)
        draw.line([(ox0, y), (ox1, y)], fill=(c, c+2, c+5))
    
    # Outer stroke & highlights
    draw.rounded_rectangle([ox0, oy0, ox1, oy1], radius=28, outline=(245, 248, 252), width=3)
    
    # Precision cutout for bottle cap
    cx0, cy0, cx1, cy1 = ox0 + 30, oy0 + 40, ox1 - 30, oy0 + 115
    draw.rounded_rectangle([cx0, cy0, cx1, cy1], radius=16, fill=(185, 195, 205), outline=(130, 140, 150), width=2)
    # Beveled edge catch lip
    draw.polygon([(cx0+15, cy0+45), (cx1-15, cy0+45), (cx1-22, cy0+25), (cx0+22, cy0+25)], fill=(110, 120, 130))
    
    # Laser engraved text on handle
    f_engrave = get_font(SANS_BOLD, 12)
    f_city = get_font(SANS, 10)
    draw.text((ox0 + 70, oy1 - 100), "FORM / DESIGN CENTER", font=f_engrave, fill=(75, 85, 95), anchor="mm")
    draw.text((ox0 + 70, oy1 - 80), "MALMÖ · SCANDINAVIA", font=f_city, fill=(100, 110, 120), anchor="mm")
    
    # Hanging eyelet
    draw.ellipse([ox0 + 55, oy1 - 45, ox0 + 85, oy1 - 15], fill=(185, 195, 205), outline=(120, 130, 140), width=2)
    
    img.convert("RGB").save("site/assets/souvenirs/form-design-opener.webp", "WEBP", quality=90)

# 3. Angelina Paris Biscuits Tin (France - Office Gift 2)
def gen_angelina_biscuits():
    img = studio_canvas((246, 240, 230), (225, 215, 195))
    draw = ImageDraw.Draw(img)
    
    tx0, ty0, tx1, ty1 = 230, 110, 570, 390
    
    # Tin shadow
    t_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_sdraw = ImageDraw.Draw(t_shadow)
    t_sdraw.rounded_rectangle([tx0+8, ty0+12, tx1+12, ty1+15], radius=22, fill=(25, 20, 15, 90))
    t_shadow = t_shadow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, t_shadow)
    draw = ImageDraw.Draw(img)
    
    # Luxurious Paris vintage cream/gold tin lid
    draw.rounded_rectangle([tx0, ty0, tx1, ty1], radius=22, fill=(244, 238, 222), outline=(190, 160, 95), width=4)
    # Embossed gold rim
    draw.rounded_rectangle([tx0+10, ty0+10, tx1-10, ty1-10], radius=16, outline=(215, 185, 115), width=2)
    draw.rounded_rectangle([tx0+16, ty0+16, tx1-16, ty1-16], radius=12, outline=(170, 140, 80), width=1)
    
    f_brand = get_font(SERIF_BOLD, 30)
    f_sub = get_font(SERIF, 13)
    f_prod = get_font(SERIF_BOLD, 17)
    f_desc = get_font(SANS, 11)
    
    # Angelina Paris Gold Filigree Logo
    draw.text((W//2, ty0 + 65), "ANGELINA", font=f_brand, fill=(160, 120, 50), anchor="mm")
    draw.text((W//2, ty0 + 98), "PARIS · DEPUIS 1903", font=f_sub, fill=(120, 95, 45), anchor="mm")
    
    # Center filigree divider
    draw.line([(tx0 + 50, ty0 + 120), (tx1 - 50, ty0 + 120)], fill=(200, 170, 100), width=1)
    
    # French Biscuit assortment vignette
    draw.rounded_rectangle([tx0 + 40, ty0 + 140, tx1 - 40, ty1 - 40], radius=10, fill=(255, 252, 245), outline=(220, 200, 160))
    draw.text((W//2, ty0 + 175), "BISCUITS ASSORTIS TRADITIONNELS", font=f_prod, fill=(60, 45, 30), anchor="mm")
    draw.text((W//2, ty0 + 205), "Galettes Pur Beurre · Sablés Chocolat · Dentelles", font=f_desc, fill=(110, 85, 60), anchor="mm")
    draw.text((W//2, ty0 + 225), "FABRIQUÉ EN FRANCE · 350g", font=f_desc, fill=(140, 115, 75), anchor="mm")
    
    img.convert("RGB").save("site/assets/souvenirs/angelina-biscuits.webp", "WEBP", quality=90)

# 4. Maille Dijon Mustard (France)
def gen_maille_mustard():
    img = studio_canvas((245, 242, 235), (218, 212, 200))
    draw = ImageDraw.Draw(img)
    
    # Glass Jar dimensions
    jx0, jy0, jx1, jy1 = 300, 130, 500, 400
    
    # Shadow
    j_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    j_sdraw = ImageDraw.Draw(j_shadow)
    j_sdraw.rounded_rectangle([jx0+6, jy0+10, jx1+8, jy1+12], radius=24, fill=(20, 20, 15, 80))
    j_shadow = j_shadow.filter(ImageFilter.GaussianBlur(14))
    img = Image.alpha_composite(img, j_shadow)
    draw = ImageDraw.Draw(img)
    
    # Gold Lid
    draw.rounded_rectangle([jx0+15, jy0-25, jx1-15, jy0+15], radius=8, fill=(215, 175, 75), outline=(160, 125, 45), width=2)
    # Lid knurling / ridges
    for x in range(jx0+25, jx1-25, 6):
        draw.line([(x, jy0-20), (x, jy0+10)], fill=(185, 145, 55), width=1)
    
    # Glass Jar with golden Dijon mustard inside
    draw.rounded_rectangle([jx0, jy0+10, jx1, jy1], radius=24, fill=(205, 160, 35), outline=(240, 240, 230), width=3)
    # Glass reflection
    draw.rounded_rectangle([jx0+6, jy0+16, jx0+30, jy1-16], radius=12, fill=(225, 185, 65, 100))
    
    # Iconic Black & Gold Maille Label
    draw.rounded_rectangle([jx0+15, jy0+60, jx1-15, jy1-40], radius=10, fill=(18, 18, 18), outline=(215, 180, 80), width=2)
    
    f_maille = get_font(SERIF_BOLD, 24)
    f_since = get_font(SERIF, 10)
    f_dijon = get_font(SERIF_BOLD, 13)
    f_vin = get_font(SERIF, 11)
    
    draw.text((W//2, jy0 + 95), "MAILLE", font=f_maille, fill=(230, 195, 95), anchor="mm")
    draw.text((W//2, jy0 + 120), "QUE LE BON SOIT UN DÉLICE", font=f_since, fill=(180, 150, 70), anchor="mm")
    draw.line([(jx0+35, jy0+132), (jx1-35, jy0+132)], fill=(215, 180, 80), width=1)
    draw.text((W//2, jy0 + 155), "MOUTARDE DE DIJON", font=f_dijon, fill=(255, 255, 255), anchor="mm")
    draw.text((W//2, jy0 + 180), "AU VIN BLANC · TRUFFE NOIRE", font=f_vin, fill=(220, 185, 90), anchor="mm")
    
    img.convert("RGB").save("site/assets/souvenirs/maille-mustard.webp", "WEBP", quality=90)

# 5. Officine Universelle Buly 1803 Soap (France)
def gen_buly_soap():
    img = studio_canvas((242, 238, 232), (218, 210, 200))
    draw = ImageDraw.Draw(img)
    
    sx0, sy0, sx1, sy1 = 260, 120, 540, 380
    
    # Box Shadow
    s_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    s_sdraw = ImageDraw.Draw(s_shadow)
    s_sdraw.rounded_rectangle([sx0+8, sy0+12, sx1+12, sy1+14], radius=14, fill=(25, 20, 15, 80))
    s_shadow = s_shadow.filter(ImageFilter.GaussianBlur(15))
    img = Image.alpha_composite(img, s_shadow)
    draw = ImageDraw.Draw(img)
    
    # Antique Paper Soap Box (pale ivory with delicate green / gold engraving)
    draw.rounded_rectangle([sx0, sy0, sx1, sy1], radius=14, fill=(248, 245, 236), outline=(180, 165, 140), width=2)
    # Classic French decorative border
    draw.rounded_rectangle([sx0+10, sy0+10, sx1-10, sy1-10], radius=10, outline=(65, 90, 75), width=2)
    draw.rounded_rectangle([sx0+15, sy0+15, sx1-15, sy1-15], radius=7, outline=(200, 175, 120), width=1)
    
    f_buly = get_font(SERIF_BOLD, 22)
    f_sub = get_font(SERIF, 10)
    f_soap = get_font(SERIF_BOLD, 15)
    f_scent = get_font(SERIF, 12)
    
    draw.text((W//2, sy0 + 45), "OFFICINE UNIVERSELLE BULY", font=f_buly, fill=(35, 45, 40), anchor="mm")
    draw.text((W//2, sy0 + 72), "PARFUMEUR DEPUIS 1803 · PARIS", font=f_sub, fill=(120, 105, 75), anchor="mm")
    draw.line([(sx0+40, sy0+90), (sx1-40, sy0+90)], fill=(65, 90, 75), width=1)
    
    draw.text((W//2, sy0 + 130), "SAVON SUPERFIN", font=f_soap, fill=(45, 60, 50), anchor="mm")
    draw.text((W//2, sy0 + 165), "Mousse de Cèdre & Bois de Campêche", font=f_scent, fill=(80, 65, 50), anchor="mm")
    draw.text((W//2, sy0 + 195), "Nettoie sans dessécher · Sans parabène", font=f_sub, fill=(110, 100, 85), anchor="mm")
    
    # Royal warrant medallion
    draw.ellipse([W//2 - 25, sy1 - 55, W//2 + 25, sy1 - 10], outline=(180, 150, 90), width=2)
    draw.text((W//2, sy1 - 32), "1803", font=f_sub, fill=(180, 150, 90), anchor="mm")
    
    img.convert("RGB").save("site/assets/souvenirs/buly-soap.webp", "WEBP", quality=90)

# 6. Mariage Frères Marco Polo Tea (France)
def gen_mariage_freres():
    img = studio_canvas((238, 235, 230), (205, 200, 192))
    draw = ImageDraw.Draw(img)
    
    tx0, ty0, tx1, ty1 = 290, 100, 510, 410
    
    # Shadow
    t_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    t_sdraw = ImageDraw.Draw(t_shadow)
    t_sdraw.rounded_rectangle([tx0+8, ty0+12, tx1+10, ty1+14], radius=20, fill=(15, 15, 15, 100))
    t_shadow = t_shadow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, t_shadow)
    draw = ImageDraw.Draw(img)
    
    # Matte Pitch Black Lacquer Cylindrical Tin
    draw.rounded_rectangle([tx0, ty0, tx1, ty1], radius=20, fill=(24, 24, 24), outline=(50, 50, 50), width=2)
    # Lid seam
    draw.line([(tx0, ty0+45), (tx1, ty0+45)], fill=(75, 75, 75), width=2)
    draw.line([(tx0, ty0+47), (tx1, ty0+47)], fill=(15, 15, 15), width=1)
    
    # Iconic Gold Oval Crest
    ox0, oy0, ox1, oy1 = tx0 + 20, ty0 + 75, tx1 - 20, ty1 - 45
    draw.ellipse([ox0, oy0, ox1, oy1], outline=(220, 185, 80), width=3)
    draw.ellipse([ox0+6, oy0+6, ox1-6, oy1-6], outline=(180, 145, 55), width=1)
    
    f_mf = get_font(SERIF_BOLD, 17)
    f_since = get_font(SERIF, 10)
    f_polo = get_font(SERIF_BOLD, 22)
    f_the = get_font(SERIF, 12)
    
    draw.text((W//2, oy0 + 45), "MARIAGE FRÈRES", font=f_mf, fill=(235, 200, 95), anchor="mm")
    draw.text((W//2, oy0 + 70), "THÉ FRANÇAIS DEPUIS 1854", font=f_since, fill=(195, 160, 75), anchor="mm")
    draw.line([(W//2 - 40, oy0 + 90), (W//2 + 40, oy0 + 90)], fill=(220, 185, 80), width=1)
    
    draw.text((W//2, oy0 + 130), "MARCO POLO", font=f_polo, fill=(250, 220, 115), anchor="mm")
    draw.text((W//2, oy0 + 165), "COMPOSITION ORIGINALE", font=f_the, fill=(210, 175, 85), anchor="mm")
    draw.text((W//2, oy0 + 190), "PARFUM MYSTÉRIEUX DU THÉ NOIR", font=f_since, fill=(175, 140, 65), anchor="mm")
    
    img.convert("RGB").save("site/assets/souvenirs/mariage-freres.webp", "WEBP", quality=90)

# 7. Musée du Louvre Tote Bag (France)
def gen_louvre_totebag():
    img = studio_canvas((242, 240, 236), (215, 212, 205))
    draw = ImageDraw.Draw(img)
    
    bx0, by0, bx1, by1 = 270, 140, 530, 420
    
    # Shadow
    b_shadow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    b_sdraw = ImageDraw.Draw(b_shadow)
    b_sdraw.rounded_rectangle([bx0+6, by0+10, bx1+8, by1+12], radius=12, fill=(20, 20, 25, 70))
    b_shadow = b_shadow.filter(ImageFilter.GaussianBlur(16))
    img = Image.alpha_composite(img, b_shadow)
    draw = ImageDraw.Draw(img)
    
    # Tote bag straps (heavyweight cotton webbing)
    s_col = (55, 55, 60)
    draw.line([(bx0 + 50, by0), (bx0 + 50, by0 - 70)], fill=s_col, width=14)
    draw.line([(bx1 - 50, by0), (bx1 - 50, by0 - 70)], fill=s_col, width=14)
    draw.arc([bx0 + 50, by0 - 110, bx1 - 50, by0 - 30], start=180, end=0, fill=s_col, width=14)
    
    # Heavyweight Natural Canvas Bag Body
    draw.rounded_rectangle([bx0, by0, bx1, by1], radius=12, fill=(245, 242, 233), outline=(205, 200, 190), width=2)
    # Canvas texture stitching
    draw.line([(bx0+8, by0+14), (bx1-8, by0+14)], fill=(180, 175, 160), width=1)
    
    # Screenprinted Graphic: Louvre Pyramid Wireframe
    px0, py0, px1, py1 = W//2 - 60, by0 + 45, W//2 + 60, by0 + 155
    apex = (W//2, py0)
    b_left = (px0, py1)
    b_right = (px1, py1)
    b_mid = (W//2, py1 + 15)
    
    draw.polygon([apex, b_left, b_mid], outline=(35, 40, 45), fill=(235, 232, 222), width=2)
    draw.polygon([apex, b_right, b_mid], outline=(35, 40, 45), fill=(225, 222, 212), width=2)
    # Glass wireframe lattice
    for step in [0.3, 0.6, 0.85]:
        p_l = (int(apex[0] + (b_left[0] - apex[0])*step), int(apex[1] + (b_left[1] - apex[1])*step))
        p_m = (int(apex[0] + (b_mid[0] - apex[0])*step), int(apex[1] + (b_mid[1] - apex[1])*step))
        p_r = (int(apex[0] + (b_right[0] - apex[0])*step), int(apex[1] + (b_right[1] - apex[1])*step))
        draw.line([p_l, p_m], fill=(70, 75, 80), width=1)
        draw.line([p_r, p_m], fill=(70, 75, 80), width=1)
    
    f_louvre = get_font(SERIF_BOLD, 22)
    f_sub = get_font(SANS_BOLD, 10)
    
    draw.text((W//2, by0 + 200), "MUSÉE DU LOUVRE", font=f_louvre, fill=(25, 30, 35), anchor="mm")
    draw.text((W//2, by0 + 228), "PARIS · I.M. PEI ARCHITECTURE", font=f_sub, fill=(90, 95, 100), anchor="mm")
    
    img.convert("RGB").save("site/assets/souvenirs/louvre-totebag.webp", "WEBP", quality=90)

if __name__ == "__main__":
    print("Generating souvenir images...")
    gen_malmo_chokladfabrik()
    gen_form_design_opener()
    gen_angelina_biscuits()
    gen_maille_mustard()
    gen_buly_soap()
    gen_mariage_freres()
    gen_louvre_totebag()
    print("All 7 souvenir images generated successfully!")
