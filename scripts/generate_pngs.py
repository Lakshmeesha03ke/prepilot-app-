import zlib
import struct
import math
import os

def create_png(width, height, filename):
    # PNG signature
    png_signature = b'\x89PNG\r\n\x1a\n'
    
    # IHDR chunk
    # Width (4 bytes), Height (4 bytes), Bit depth (1 byte, 8), Color type (1 byte, 6 = RGBA)
    # Compression method (1 byte, 0), Filter method (1 byte, 0), Interlace method (1 byte, 0)
    ihdr_data = struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)
    ihdr_crc = struct.pack('>I', zlib.crc32(b'IHDR' + ihdr_data))
    ihdr_chunk = struct.pack('>I', len(ihdr_data)) + b'IHDR' + ihdr_data + ihdr_crc

    # Raw image scanlines
    raw_rows = []
    cx, cy = width / 2.0, height / 2.0
    radius = width * 0.44

    for y in range(height):
        row = [0] # Filter type 0 (None)
        ny = (y - cy) / radius
        for x in range(width):
            nx = (x - cx) / radius
            dist = math.sqrt(nx * nx + ny * ny)

            # Squircle rounded background (#0f172a)
            # Squircle distance: (|nx|^4 + |ny|^4)^(1/4)
            sq_dist = math.pow(abs(nx)**4.5 + abs(ny)**4.5, 1.0 / 4.5) if (abs(nx) > 0 or abs(ny) > 0) else 0

            if sq_dist <= 1.0:
                # Inside icon rounded background
                # Subtle gradient from #0f172a to #1e1b4b
                t = (y / height)
                r = int(15 + 15 * t)
                g = int(23 + 4 * t)
                b = int(42 + 33 * t)
                a = 255

                # Draw graduation cap diamond
                # Diamond centered at cy - radius * 0.25
                d_cx, d_cy = cx, cy - radius * 0.2
                dx_norm = abs(x - d_cx) / (radius * 0.7)
                dy_norm = abs(y - d_cy) / (radius * 0.28)

                # Cap diamond shape: dx_norm + dy_norm <= 1.0
                if dx_norm + dy_norm <= 1.0:
                    # Sky blue gradient (#38bdf8 to #6366f1)
                    mix = (x - cx + radius * 0.7) / (radius * 1.4)
                    mix = max(0.0, min(1.0, mix))
                    r = int(56 * (1 - mix) + 99 * mix)
                    g = int(189 * (1 - mix) + 102 * mix)
                    b = int(248 * (1 - mix) + 241 * mix)

                # Cap skull base
                elif (abs(x - cx) <= radius * 0.42) and (y >= d_cy) and (y <= d_cy + radius * 0.3):
                    r, g, b = 37, 99, 235 # Royal blue

                # Rocket / Ascent arrow in lower center
                r_cy = cy + radius * 0.25
                rx_norm = abs(x - cx) / (radius * 0.16)
                ry_norm = (y - r_cy) / (radius * 0.4)

                # Rocket body (white)
                if (rx_norm <= 1.0) and (ry_norm >= -0.7) and (ry_norm <= 0.6):
                    r, g, b = 255, 255, 255
                    # Window
                    if math.sqrt((x - cx)**2 + (y - (r_cy - radius * 0.1))**2) < radius * 0.08:
                        r, g, b = 2, 132, 199

                # Rocket fins (sky blue)
                elif (abs(x - cx) <= radius * 0.35) and (y >= r_cy + radius * 0.2) and (y <= r_cy + radius * 0.55):
                    r, g, b = 56, 189, 248

                # Rocket flame (amber / red)
                elif (abs(x - cx) <= radius * 0.1) and (y >= r_cy + radius * 0.6) and (y <= r_cy + radius * 0.85):
                    r, g, b = 245, 158, 11 # Amber

            else:
                # Transparent outside squircle
                r, g, b, a = 0, 0, 0, 0

            row.extend([r, g, b, a])
        raw_rows.append(bytes(row))

    idat_raw = b''.join(raw_rows)
    compressed = zlib.compress(idat_raw, 9)
    idat_crc = struct.pack('>I', zlib.crc32(b'IDAT' + compressed))
    idat_chunk = struct.pack('>I', len(compressed)) + b'IDAT' + compressed + idat_crc

    # IEND chunk
    iend_crc = struct.pack('>I', zlib.crc32(b'IEND'))
    iend_chunk = struct.pack('>I', 0) + b'IEND' + iend_crc

    os.makedirs(os.path.dirname(os.path.abspath(filename)), exist_ok=True)
    with open(filename, 'wb') as f:
        f.write(png_signature + ihdr_chunk + idat_chunk + iend_chunk)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == '__main__':
    create_png(192, 192, 'public/pwa-192x192.png')
    create_png(512, 512, 'public/pwa-512x512.png')
    create_png(512, 512, 'public/pwa-maskable-512x512.png')
    create_png(180, 180, 'public/apple-touch-icon.png')
    create_png(64, 64, 'public/favicon-64x64.png')
