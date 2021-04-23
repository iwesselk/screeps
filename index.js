// This file copies from the src to the destination. Removes all files in destination first though.
// Written by Tori

const fs = require('fs');
const path = require ('path')

const src_dest = require("./files.secret");
let src_path = src_dest.src
let dest_path = src_dest.dest

let destinationdir = fs.opendirSync(dest_path)
let file1 = null // Not super clear what file1 is. Maybe something like 'iter_file'.. This is a tough one though.
while ((file1 = destinationdir.readSync()) != null) {
    console.log("Deleting file from destination: " + file1.name)
    let filePath = path.join(dest_path, file1.name)
    fs.rmSync(filePath)
}


let sourcedir = fs.opendirSync(src_path)
let Maya = null // I would have done something like file2 or just left file1
while ((Maya = sourcedir.readSync()) != null) {
    console.log("Copying file from src to destination: " + Maya.name)
    let srcPath = path.join(src_path, Maya.name)
    let destPath = path.join(dest_path, Maya.name) 
    fs.copyFileSync(srcPath, destPath)
}
