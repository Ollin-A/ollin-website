import sys
from PIL import Image

def process_favicon():
    try:
        img = Image.open('imgur_image.png').convert("RGBA")
    except Exception as e:
        print("Error opening image:", e)
        sys.exit(1)
        
    datas = img.getdata()
    min_alpha = min([item[3] for item in datas])
    if min_alpha > 250:
        newData = []
        for item in datas:
            if item[0] > 240 and item[1] > 240 and item[2] > 240:
                newData.append((255, 255, 255, 0))
            else:
                newData.append(item)
        img.putdata(newData)
        
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    max_dim = int(512 * 0.70)
    
    ratio = min(max_dim / img.width, max_dim / img.height)
    new_size = (int(img.width * ratio), int(img.height * ratio))
    img = img.resize(new_size, Image.Resampling.LANCZOS)
    
    canvas = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
    x = (512 - img.width) // 2
    y = (512 - img.height) // 2
    canvas.paste(img, (x, y), img)
    
    canvas.save('public/favicon-512.png')
    
    ico_16 = canvas.resize((16, 16), Image.Resampling.LANCZOS)
    ico_32 = canvas.resize((32, 32), Image.Resampling.LANCZOS)
    ico_48 = canvas.resize((48, 48), Image.Resampling.LANCZOS)
    ico_180 = canvas.resize((180, 180), Image.Resampling.LANCZOS)
    
    ico_16.save('public/favicon-16.png')
    ico_32.save('public/favicon-32.png')
    ico_180.save('public/apple-touch-icon.png')
    
    ico_48.save('public/favicon.ico', format='ICO', sizes=[(16, 16), (32, 32), (48, 48)])
    
    print("Favicons generated successfully.")

if __name__ == '__main__':
    process_favicon()
