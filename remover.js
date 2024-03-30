function f(c1,c2,p1,p2) { 
    return c1 + (c2-c1)*p1/(p1==p2*2 ? p2 : (p1-p2));
}

export async function processImages(image1, image2, transparency1, transparency2) {
    if (transparency1 < transparency2)
        [image1, image2, transparency1, transparency2] = [image2, image1, transparency2, transparency1];

    const matrix1 = image1.data,
          matrix2 = image2.data;

    const matrix = [];

    for (let index = 0; index < matrix1.length; index+=4) {
        const r1 = matrix1[index],
              g1 = matrix1[index+1],
              b1 = matrix1[index+2];
        const r2 = matrix2[index],
              g2 = matrix2[index+1],
              b2 = matrix2[index+2];

        matrix.push(
            f(r1,r2,transparency1,transparency2),
            f(g1,g2,transparency1,transparency2),
            f(b1,b2,transparency1,transparency2),
            255
        );
    }
    const clampedMatrix = new Uint8ClampedArray(matrix);
    const image = new ImageData(clampedMatrix, image1.width, image1.height);

    return image;
}
