#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

module.exports = function getAllDirsRecursively(rootDir, exclude) {
  if(typeof rootDir === 'undefined') {
    throw new Error('Please provide a root directory.')
  }
  if(typeof exclude !== 'undefined') {
    if(!Array.isArray(exclude)) {
      throw new Error('exclude arg must be an array of strings to exclude from output')
    }
  }
  let dirs = [];

  (function readDir(dir) {
    let files = fs.readdirSync(dir)

    files.map(file => {
      return path.join(dir, file)
    }).filter(file => {
      try {
        let toExclude = false
        if(typeof exclude !== 'undefined') {
          toExclude = exclude.some(currVal => {
            let result = file.search(new RegExp(currVal, 'i'))
            return result >= 0
          })
        }
        if(fs.statSync(file).isDirectory() && !toExclude) {
          return true
        }
      } catch(ex) {
        return false
      }
    }).forEach(foundDir => {
      dirs.push(foundDir)
      readDir(foundDir)
    })
  })(rootDir)

  return dirs
}
