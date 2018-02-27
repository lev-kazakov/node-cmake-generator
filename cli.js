#!/usr/bin/env node
const commander = require('commander')
const {generateCMakeLists} = require('./')

const {nodeDir, pythonPath, cmakeConfig, skipConfigure, skipGyp} =
  commander
    .option('-n, --node-dir [=./]', 'node root directory', process.cwd())
    .option('-p, --python-path [=python]', 'python executable path', 'python')
    .option('-c, --cmake-config [=Debug]', 'cmake configuration [Debug|Release]', c => c === 'Release' ? c : 'Debug', 'Debug')
    .option('-x, --skip-configure [=false]', 'skip ./configure execution', false)
    .option('-s, --skip-gyp [=false]', 'skip gyp_node.py execution', false)
    .parse(process.argv)

console.log(`
Node root directory:\t\t${nodeDir}
Python executable path:\t\t${pythonPath}
CMake configuration:\t\t${cmakeConfig}
Skip configure execution:\t${!!skipConfigure}
Skip gyp_node.py execution:\t${!!skipGyp}

Generating CMakeLists...`)

;(async () => {
  await generateCMakeLists(nodeDir, pythonPath, cmakeConfig, skipConfigure, skipGyp)
  console.log('Done.')
})()
