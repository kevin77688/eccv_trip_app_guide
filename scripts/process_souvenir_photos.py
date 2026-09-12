#!/usr/bin/env python3
"""
Downloads and processes authentic product and packaging photographs for the 20 souvenirs
from official sources and Wikimedia Commons into 800x500 16:10 WebP images.
"""
import io
import os
import time
import urllib.request
from PIL import Image, ImageOps

IMAGE_SOURCES = {
    'dalahast': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/c/c9/Dalecarlian_horse.jpg',
        'mode': 'cover'
    },
    'malmo-chokladfabrik': {
        'url': 'https://cdn.shopify.com/s/files/1/0676/0303/8510/files/Malmo_bar_-_mork_choklad.png?v=1756107372',
        'mode': 'contain',
        'bg': (248, 246, 242)
    },
    'ahlgrens-bilar': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/7/78/Ahlgrens_bilar.jpg',
        'mode': 'cover'
    },
    'djungelvral': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Djungelvr%C3%A5l%2C_3.jpg',
        'mode': 'cover'
    },
    'polkagris': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/1/19/Flickr_-_cyclonebill_-_Polkagris.jpg',
        'mode': 'cover'
    },
    'kexchoklad': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/d/dd/Kexchoklad%2C_1.jpg',
        'mode': 'cover'
    },
    'royal-dansk': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/53/Tin_Box_Danish_Butter_Biscuits_01.jpg',
        'mode': 'contain',
        'bg': (248, 248, 248)
    },
    'lakrids-bulow': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/2/25/Lakrids_by_B%C3%BClow_-_Passion_Fruit-9017.jpg',
        'mode': 'cover'
    },
    'anthon-berg': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Anthon_Berg_chocolate_liqueurs.jpg',
        'mode': 'cover'
    },
    'lego-minifigure': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/LEGO_Collectible_Minifigures_Series_7_Unpacked_%287083045923%29.jpg',
        'mode': 'cover'
    },
    'royal-copenhagen': {
        'url': 'https://cdn.shopify.com/s/files/1/0954/3758/6764/files/1086638_01.jpg?v=1781368890',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'georg-jensen': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Georg_Jensen_-_Bernadotte.jpg',
        'mode': 'contain',
        'bg': (245, 245, 245)
    },
    'st-michel': {
        'url': 'https://images.openfoodfacts.net/images/products/302/347/000/1015/front_fr.306.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'gavottes': {
        'url': 'https://images.openfoodfacts.net/images/products/343/141/000/1023/front_fr.117.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'lu-biscuits': {
        'url': 'https://images.openfoodfacts.net/images/products/762/221/042/1968/front_fr.146.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'la-mere-poulard': {
        'url': 'https://images.openfoodfacts.net/images/products/347/286/000/1454/front_fr.20.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'valrhona': {
        'url': 'https://images.openfoodfacts.net/images/products/339/532/834/8987/front_fr.17.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'malongo': {
        'url': 'https://images.openfoodfacts.net/images/products/318/757/001/5508/front_fr.34.full.jpg',
        'mode': 'contain',
        'bg': (255, 255, 255)
    },
    'pierre-herme': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/5/50/Ispahan_macaroon_with_raspberry_and_petal.jpg',
        'mode': 'cover'
    },
    'foie-gras': {
        'url': 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Foie_gras_de_canard_entier_du_sud-ouest_IGP.JPG',
        'mode': 'cover'
    }
}


def main():
    target_w, target_h = 800, 500
    out_dir = os.path.join(os.path.dirname(__file__), '..', 'site', 'assets', 'souvenirs')
    os.makedirs(out_dir, exist_ok=True)
    user_agent = 'ECCVTravelBot/10.0 (contact: kevin@eccv2026.org)'

    for name, meta in IMAGE_SOURCES.items():
        out_path = os.path.join(out_dir, f'{name}.webp')
        if os.path.exists(out_path) and os.path.getsize(out_path) > 5000:
            print(f'Exists: {name:20s} ({os.path.getsize(out_path)} bytes)')
            continue

        time.sleep(2.0)
        url = meta['url']
        req = urllib.request.Request(url, headers={'User-Agent': user_agent})
        try:
            with urllib.request.urlopen(req, timeout=15) as resp:
                data = resp.read()
                im = Image.open(io.BytesIO(data))

                if meta['mode'] == 'cover':
                    im_rgb = im.convert('RGB')
                    processed = ImageOps.fit(
                        im_rgb, (target_w, target_h),
                        method=Image.Resampling.LANCZOS,
                        centering=(0.5, 0.5)
                    )
                else:
                    bg_color = meta.get('bg', (255, 255, 255))
                    canvas = Image.new('RGB', (target_w, target_h), bg_color)
                    pad_w, pad_h = int(target_w * 0.88), int(target_h * 0.88)
                    im_fit = im.copy()
                    im_fit.thumbnail((pad_w, pad_h), Image.Resampling.LANCZOS)
                    x_off = (target_w - im_fit.width) // 2
                    y_off = (target_h - im_fit.height) // 2

                    if im_fit.mode == 'RGBA':
                        canvas.paste(im_fit, (x_off, y_off), mask=im_fit.split()[3])
                    else:
                        canvas.paste(im_fit, (x_off, y_off))
                    processed = canvas

                processed.save(out_path, format='WEBP', quality=85, method=6)
                print(f'Processed {name:20s} -> {out_path} ({os.path.getsize(out_path)} bytes)')
        except Exception as e:
            print(f'ERROR {name}: {e}')


if __name__ == '__main__':
    main()
