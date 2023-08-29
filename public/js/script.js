/**
 *
 */

let initialStructure = [];
const getFolderEndPoint = 'api/get_folder/';
const templates = {};
const library = 'library/';


/**
 * JSON call to get current structure
 */
function readCurrentStructure() {
    const structureToSend = initialStructure.join(',');
    $.getJSON(getFolderEndPoint + structureToSend, function (data) {
        // console.log(data);
        const folders = data.folders;
        const files = data.files;
        console.log(folders);
        console.log(files);
        renderBreadcrumb();
        renderFolders(folders);
        renderImages(files);
    });
}


function renderBreadcrumb() {
    console.log('Render breadcrumbs');
    console.log(initialStructure);
    $("#breadcrumbs").html('');
    $("#breadcrumbs").append(
        templates.breadCrumbItem.map(render({"name": '<span class="zi-home"></span>', 'index': 0})).join('')
    );

    $('#breadcrumbs').append(initialStructure.map(function (item, index) {
        const props = {
            "name": item,
            "index": index + 1
        };
        if( index === (initialStructure.length - 1 ) ){
            return templates.breadCrumbItemInactive.map(render(props)).join('');
        }else{
            return templates.breadCrumbItem.map(render(props)).join('');
        }
    }));

}


function renderImages(images){
    console.log('Rendering images');
    console.log(images);
    $("#images").html('');
    if(images.length === 0 ){
        return;
    }
    $('#images').html(images.map(function (item) {
        const url = library + initialStructure.join('/') + "/" + item;
        return templates.singleImage.map(render({"url": url})).join('');
    }));
}

/**
 * This will render the folder list
 * @param foldersList
 */
function renderFolders(folders) {
    $("#folders").html('');
    if(folders.length === 0 ){
        return;
    }
    $('#folders').html(folders.map(function (item) {
        return templates.singleFolder.map(render({"name": item})).join('');
    }));
}


function changeFolder(name) {
    console.log('Changing folder to: ' + name);
    initialStructure.push(name);
    readCurrentStructure();
}

function jumpToFolder(index) {
    if (index === 0) {
        initialStructure = [];
    }
    initialStructure = initialStructure.splice(0, index);
    readCurrentStructure();
}

/**
 * Render the templates
 * @param props
 * @return {function(*, *): *}
 */
function render(props) {
    return function (tok, i) {
        return (i % 2) ? props[tok] : tok;
    };
}

/**
 * Read all templates
 */
function readTemplates() {
    const templateList  = [
        'singleFolder', 'breadCrumbItem', 'breadCrumbItemInactive', 'singleImage'
    ]
    for(let i = 0; i < templateList.length; i++){
        const st = templateList[i];
        templates[st] = $('script[data-template="' + st + '"]').text().split(/\$\{(.+?)\}/g)

    }
}

/**
 * The main function
 */
function main() {
    readTemplates();
    readCurrentStructure();
}


/**
 * When the window is ready
 */
$(window).ready(function () {
    main();
});
