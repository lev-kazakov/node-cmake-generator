const path = require('path')
const {spawn} = require('child_process')
const fs = require('fs')
const readline = require('readline')
const {EOL} = require('os')

module.exports = {generateCMakeLists}

async function generateCMakeLists(nodeDir, pythonPath, cmakeConfig, skipConfigure, skipGyp) {
  if (!skipConfigure) {
    await configure(nodeDir)
  }

  if (!skipGyp) {
    await gypNode(nodeDir, pythonPath)
  }

  return deployLists(nodeDir, cmakeConfig)
}

function configure(nodeDir) {
  return new Promise((resolve, reject) => {
    const configure = spawn(path.join(nodeDir, 'configure'), {stdio: 'inherit'})

    configure.on('close', code => {
      if (code) {
        reject(`configure exited with code ${code}`)
      } else {
        resolve()
      }
    })

    configure.on('error', (err) => {
      console.error(err.toString())
      reject('configure failed')
    })
  })
}

function gypNode(nodeDir, pythonPath) {
  return new Promise((resolve, reject) => {
    const gypNode = spawn(pythonPath, [path.join(nodeDir, 'tools', 'gyp_node.py'), '-f', 'cmake'], {stdio: 'inherit'})

    gypNode.on('close', code => {
      if (code) {
        reject(`gyp_node.py exited with code ${code}`)
      } else {
        resolve()
      }
    })

    gypNode.on('error', (err) => {
      console.error(err.toString())
      reject('gyp_node.py failed')
    })
  })
}

function deployLists(nodeDir, cmakeConfig) {
  const cmakeListsDir = path.join(nodeDir, 'out')
  const cmakeListsPath = path.join(cmakeListsDir, cmakeConfig, 'CMakeLists.txt')

  const readFile = readline.createInterface({
    input: fs.createReadStream(cmakeListsPath),
    output: fs.createWriteStream(path.join(nodeDir, 'CMakeLists.txt')),
    terminal: false
  })

  function fixLine(line) {
    line = line.replace(/--whole-archive/g, '-force_load')
    line = line.replace(/-Wl,--no-whole-archive/g, '')
    line = line.replace('"../../', '"')
    line = line.replace('${CMAKE_CURRENT_LIST_DIR}/../..', '${CMAKE_CURRENT_LIST_DIR}')
    line = line.replace('  "src/tracing/trace_event.hsrc/util.h"', `  "src/tracing/trace_event.h"${EOL}  "src/util.h"`)
    line = line.replace('"deps/include/v8-inspector.h"', '"deps/v8/include/v8-inspector.h"')
    line = line.replace('"deps/include/v8-inspector-protocol.h"', '"deps/v8/include/v8-inspector-protocol.h"')
    line = line.replace('"${builddir}/obj.target/node/gen', '"${builddir}/CMakeFiles/node.dir/obj/gen')
    line = line.replace('"${builddir}/obj.target/node', '"${builddir}/CMakeFiles/node.dir')
    line = line.replace('add_library(v8_external_snapshot STATIC)', 'add_library(v8_external_snapshot STATIC "deps/v8/src/setup-isolate-deserialize.cc" "deps/v8/src/snapshot/natives-external.cc" "deps/v8/src/snapshot/snapshot-external.cc")')
    line = line.replace('  "deps/v8/src/parsing/preparse-data-format.h"', '')
    this.output.write(`${line}${EOL}`)
  }

  return new Promise(resolve => readFile.on('line', fixLine).on('close', resolve))
}
