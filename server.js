/**
 * =============================================================
 * Autogallery
 * @author Danilo Ramírez
 * @date 2023 - 08 - 29
 * =============================================================
 * This is the main server script.
 */

/**
 * The express Library and configuration
 */

const express = require('express');
const app = express();
const port = 80; // We can change this port

const publicFolder = 'public';
const initialFolder = 'library';


const availableExtensions = [
  'jpg','jpeg','png','gif'
];

/**
 * Other libraries
 */
const Console = require('./utilities/Console');

/**
 * First we set up the static folder
 */
app.use(express.static('public'));

/**
 * Routes for API calls
 * ======================================================
 */

const apiPrefix = '/api/'; // This prefix will be applied to all API routes

/**
 * The main endpoint to generate the collage
 */
app.get(apiPrefix + 'get_folder/:path?', async (req, res) => {
    /**
     * Libraries
     */
    const path = require('path');
    const fs = require('fs');

    const p = req.params.path;

    let actualPath = publicFolder + path.sep + initialFolder + path.sep;

    if(typeof p !== 'undefined'){
        actualPath = publicFolder + path.sep + initialFolder + path.sep + p.split(',').join(path.sep);
    }


    const allFiles = await fs.readdirSync(actualPath);
    const folders = [];
    const files = [];


    for(let i = 0; i < allFiles.length; i++){
        const folderToCheck = actualPath + path.sep + allFiles[i];
        Console.log('Checking file');
        Console.log(folderToCheck);
        Console.log(folderToCheck);
        const isDirExists = await fs.existsSync(folderToCheck) && await fs.lstatSync(folderToCheck).isDirectory();
        if( isDirExists ){
            Console.log('Seems to be a folder');
            folders.push(allFiles[i]);
        }else{
            Console.log('Seems to be file');
            const extension = path.extname(allFiles[i]).replace('.','');
            Console.log('Extension: ' + extension);
            if( availableExtensions.includes(extension.toLowerCase()) ){
                files.push(allFiles[i]);
            }
        }
    }


    // res.send('Received');
    res.status(200).json({
        status: true,
        path: actualPath,
        folders: folders,
        files: files
    });
});



app.listen(port, () => {
    Console.log(`App Listing to port ${port}`)
})
