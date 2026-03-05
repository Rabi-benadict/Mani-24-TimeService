// Generates simple clock icon PNGs for the extension
// Run: node generate-icons.js

const fs = require('fs');

function createMinimalPNG(size) {
    // Creates a minimal valid PNG with a blue circle (clock face) 
    // Using raw PNG construction without canvas
    const { deflateSync } = require('zlib');

    const width = size;
    const height = size;

    // Create RGBA pixel data (filter byte + rgba per pixel per row)
    const rawData = Buffer.alloc(height * (1 + width * 4));

    const cx = width / 2;
    const cy = height / 2;
    const r = (size / 2) - 1;

    for (let y = 0; y < height; y++) {
        const rowStart = y * (1 + width * 4);
        rawData[rowStart] = 0; // filter: none
        for (let x = 0; x < width; x++) {
            const px = rowStart + 1 + x * 4;
            const dx = x - cx + 0.5;
            const dy = y - cy + 0.5;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist <= r) {
                // Inside circle
                const isOuterRing = dist > r - Math.max(1, size * 0.08);
                const isCenterDot = dist < size * 0.06;

                // Clock hands
                const angle = Math.atan2(dy, dx);
                const hourAngle = -Math.PI / 3; // ~10 o'clock position
                const minuteAngle = Math.PI / 6; // ~2 o'clock  

                const isHourHand = Math.abs(angle - hourAngle) < 0.15 && dist < r * 0.5 && dist > size * 0.06;
                const isMinuteHand = Math.abs(angle - minuteAngle) < 0.1 && dist < r * 0.75 && dist > size * 0.06;

                if (isOuterRing || isCenterDot || isHourHand || isMinuteHand) {
                    rawData[px + 0] = 248; // R
                    rawData[px + 1] = 250; // G
                    rawData[px + 2] = 252; // B
                    rawData[px + 3] = 255; // A
                } else {
                    rawData[px + 0] = 59;  // R - blue #3b82f6
                    rawData[px + 1] = 130; // G
                    rawData[px + 2] = 246; // B
                    rawData[px + 3] = 255; // A
                }
            } else {
                // Transparent
                rawData[px + 0] = 0;
                rawData[px + 1] = 0;
                rawData[px + 2] = 0;
                rawData[px + 3] = 0;
            }
        }
    }

    const compressed = deflateSync(rawData);

    // Build PNG file
    function crc32(buf) {
        let c;
        const crcTable = [];
        for (let n = 0; n < 256; n++) {
            c = n;
            for (let k = 0; k < 8; k++) {
                c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
            }
            crcTable[n] = c;
        }
        let crc = 0xffffffff;
        for (let i = 0; i < buf.length; i++) {
            crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
        }
        return (crc ^ 0xffffffff) >>> 0;
    }

    function chunk(type, data) {
        const typeBytes = Buffer.from(type, 'ascii');
        const lenBuf = Buffer.alloc(4);
        lenBuf.writeUInt32BE(data.length);
        const crcData = Buffer.concat([typeBytes, data]);
        const crcBuf = Buffer.alloc(4);
        crcBuf.writeUInt32BE(crc32(crcData));
        return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
    }

    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8;  // bit depth
    ihdr[9] = 6;  // color type: RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace

    const ihdrChunk = chunk('IHDR', ihdr);
    const idatChunk = chunk('IDAT', compressed);
    const iendChunk = chunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

const sizes = [16, 48, 128];
const dir = __dirname + '/icons';

sizes.forEach(size => {
    const png = createMinimalPNG(size);
    fs.writeFileSync(`${dir}/icon${size}.png`, png);
    console.log(`✓ Created icon${size}.png (${png.length} bytes)`);
});

console.log('\nDone! Icons generated in icons/ folder.');
