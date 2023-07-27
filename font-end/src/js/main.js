const  btnUpload =$("header div button");
const overlayElm=$("#overlay");
const dropElm =$("#drop-area");
const mainElm =$("main");
const REST_API_URL="http://localhost:8080/gallery";
const cssLoaderHtml = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;

loadAllImages();


btnUpload.on("click",()=>{
    overlayElm.removeClass("d-none");
});
overlayElm.on('click',(eventData)=>{
    if(eventData.target===overlayElm[0]){
        overlayElm.addClass('d-none');
    }
});
$(document).on('keydown',(eventData)=>{
    if(eventData.key==='escape' && !overlayElm.hasClass('d-none')){
        overlayElm.addClass('d-none');
    }
});

overlayElm.on('dragover',(eventData)=>{
    eventData.preventDefault();
});
overlayElm.on('drop',(eventData)=>{
    eventData.preventDefault();
});
dropElm.on('drop',(eventData)=>{
    eventData.preventDefault();
    console.log(eventData)
    const dropFiles = eventData.originalEvent.dataTransfer.files;
    const imageFiles= Array.from(dropFiles).filter(file=>file.type.startsWith("image/"));
    if(!imageFiles.length) return;
    overlayElm.addClass('d-none');
    uploadImages(imageFiles);
});
mainElm.on('click','.image #download',(eventData)=>{
    let imageUrl = $(eventData.target).parents('.image').css('background-image');
    var split = imageUrl.split("/");
    imageName=split[split.length-1].substring(0,split[split.length-1].length-2)
    console.log(imageName);
    downlaod(imageName);
});
mainElm.on('click','.image #delete',(eventData)=>{
    let imageUrl = $(eventData.target).parents('.image').css('background-image');
    var split = imageUrl.split("/");
    imageName=split[split.length-1].substring(0,split[split.length-1].length-2);
    console.log(imageName)
    deleteFile(imageName,$(eventData.target).parents('.image'));
})


function loadAllImages(){
    const jqxhr =$.ajax(`${REST_API_URL}/api/v1/images`,'GET');
    jqxhr.done((imgeList)=>{
        imgeList.forEach(imageUrl=>{
            const divElm =$('<div class="image"></div>');
            divElm.append(`<div id="icon" class="d-flex"><svg id="download" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-cloud-arrow-down-fill" viewBox="0 0 16 16">
            <path d="M8 2a5.53 5.53 0 0 0-3.594 1.342c-.766.66-1.321 1.52-1.464 2.383C1.266 6.095 0 7.555 0 9.318 0 11.366 1.708 13 3.781 13h8.906C14.502 13 16 11.57 16 9.773c0-1.636-1.242-2.969-2.834-3.194C12.923 3.999 10.69 2 8 2zm2.354 6.854-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 9.293V5.5a.5.5 0 0 1 1 0v3.793l1.146-1.147a.5.5 0 0 1 .708.708z"/>
            </svg><svg id="delete" xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="white" class="bi bi-trash" viewBox="0 0 16 16">
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"/>
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"/>
            </svg></div>`);
            divElm.css('background-image',`url(${imageUrl})`);
            // divElm.width(400);
            // divElm.height(400);
            // divElm.css('background-position','center');
            // divElm.css('background-size','cover');
            mainElm.append(divElm);
        });
    });
}
function downlaod(name) {
    const ajax=$.ajax(`${REST_API_URL}/api/v1/images/download?q=${name}`,'GET');
    ajax.done((data)=>{
        const byteCharacters = atob(data);
        const byteArray = new Uint8Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
            byteArray[i] = byteCharacters.charCodeAt(i);
        }
        const byteArrayData = byteArray;
        const fileName = name;
        byteArrayToFile(byteArrayData, fileName);

    });
}
function byteArrayToFile(byteArray, fileName) {
    // Step 1: Create a Blob from the byteArray
    const blob = new Blob([byteArray]);

    // Step 2: Generate a temporary object URL
    const objectURL = URL.createObjectURL(blob);

    // Step 3: Create an anchor element
    const downloadLink = document.createElement("a");
    downloadLink.href = objectURL;
    downloadLink.download = fileName;

    // Step 4: Programmatically click on the anchor to initiate download
    document.body.appendChild(downloadLink);
    downloadLink.click();

    // Cleanup: Remove the temporary object URL after the download
    URL.revokeObjectURL(objectURL);
}
function deleteFile(name,elm) {
    const ajax=$.ajax(`${REST_API_URL}/api/v1/images?q=${name}`,'DELETE');
    ajax.done(()=>{
        elm.remove();
    })
    ajax.fail(()=>{
        alert("Fail to delete");
    })

}
