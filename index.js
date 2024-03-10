import { processImages } from "./remover.js";

async function readMatrix(img) {
    var w = img.naturalWidth, h = img.naturalHeight;

    var canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    var data = ctx.getImageData(0, 0, w, h);
    return data;
}

async function matrixToCanvas(matrix) {
    var canvas = document.createElement("canvas");
    canvas.width = matrix.width;
    canvas.height = matrix.height;

    var ctx = canvas.getContext("2d");
    var idata = ctx.createImageData(matrix.width, matrix.height);
    idata.data.set(matrix.data);

    ctx.putImageData(idata, 0, 0);
    
    return canvas;
};

async function setImageFromMatrix(img, matrix) {
    var canvas = await matrixToCanvas(matrix);
    img.src = canvas.toDataURL();
};

async function setImageFromFiles(img, files) {
    return new Promise((resolve) => {
        if (FileReader && files && files.length) {
            const file = files[0];
            const filereader = new FileReader();
            filereader.onload = async () => {
                img.src = filereader.result;
                resolve()
            };
            filereader.readAsDataURL(file);
        }
    });
};

async function onChange(input, img) {
    if(img != null) await setImageFromFiles(img, input.files)
    if(
        image1.files.length == 0 || image2.files.length == 0 ||
        image1transparency.value == "" || image2transparency.value == ""
    ) return

    const matrix1 = await readMatrix(image1img);
    const matrix2 = await readMatrix(image2img);

    const result = await processImages(matrix1, matrix2, Number(image1transparency.value), Number(image2transparency.value));
    setImageFromMatrix(document.querySelector("#result"), result);
};

const image1 = document.querySelector("#image1");
const image2 = document.querySelector("#image2");
const image1img = document.querySelector("#image1img");
const image2img = document.querySelector("#image2img");
const image1transparency = document.querySelector("#transparency1");
const image2transparency = document.querySelector("#transparency2");

image1.addEventListener("change", async ()=>{await onChange(image1, image1img)});
image2.addEventListener("change", async ()=>{await onChange(image2, image2img)});
image1transparency.addEventListener("change", async ()=>{await onChange(image1transparency, null)});
image2transparency.addEventListener("change", async ()=>{await onChange(image2transparency, null)});
