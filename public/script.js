const dropZone = document.querySelector(".drop-zone");
const fileUpload = document.querySelector("input[name='upload-files']");

dropZone.addEventListener("drop", dropHandler);
dropZone.addEventListener("dragover", dragOverHandler);
fileUpload.addEventListener("change", (e) => {
    files.length = 0;
    [...e.target.files].forEach(file => files.push(file));
})


const submitBtn = document.getElementById("submit");
submitBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const formData = new FormData();

    files.forEach(file => formData.append('files', file));

    document.querySelectorAll("select").forEach( option => {
        formData.append(option.name, option.value);
    })

    sendFiles(formData);
});

const files = [];


function dropHandler(e) {
    e.preventDefault();

    if (e.dataTransfer.items) {
    [...e.dataTransfer.items].forEach((item) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        files.push(file);
      }
    });
    }
}

function dragOverHandler(e) {
    e.preventDefault();
}

function sendFiles(formData) {
    fetch('/upload', {method: 'POST', body: formData})
    .then(res => {
        if (!res.ok) {
            throw new Error("Error:", res.status);
        }
        return res.blob();
    })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); 
            a.href = url; 
            a.download = 'file.pdf'; 
            a.click(); 
        })
        .catch(error => {
            console.log(error);
        }
    )
}


const waveText = document.querySelector(".wave-text").textContent;
const waveContainer = document.querySelector(".wave-text");
waveContainer.textContent = '';
console.log([...waveText]);
[...waveText].forEach((char, index) => {
    let span = document.createElement('span');
    span.textContent = char;
    span.style.animationDelay = `${index * 0.1}s`;
    waveContainer.appendChild(span);
})


fetch('/page-sizes')
    .then( res => {
    if (!res.ok) {
        throw new Error("Error", res.status);
    }
    return res.json();
    })
    .then(names => {
        const pageSizeDropDown = document.querySelector(".page-size-dd");
        names.forEach(name => {
            const option = document.createElement("option");
            option.value = name;
            option.textContent = name;
            pageSizeDropDown.appendChild(option);
        })
        
    })
