let colorIndicator = document.getElementById('color-indicator');
const colorPicker = new iro.ColorPicker("#color-picker", {
    width:180, color: "#fff", opacity: 0.5
});
colorPicker.on('color:change', function(color) {
    document.body.style.backgroundColor = color.hexString;
});

const bgColorer = document.getElementById('bg-colorer');
const showColorer = () => {
    if (bgColorer.style.display != 'none') {
        bgColorer.style.display = "none";
    }
    else {
        bgColorer.style.display = "block";
    }  
}

bgColorer.onmouseleave = () => {
    bgColorer.style.display = "none";
};