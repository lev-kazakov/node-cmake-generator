<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
## Table of Contents

- [Motivation](#motivation)
- [Problem](#problem)
- [Solution](#solution)
- [Instructions](#instructions)
- [Troubleshoot](#troubleshoot)
- [Supported versions](#supported-versions)
- [Issues regarding node's build system](#issues-regarding-nodes-build-system)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Motivation

Build, develop and debug [node](https://github.com/nodejs/node) on macOS.

## Problem

Node uses [gyp](https://gyp.gsrc.io/) as it's build system.

No IDE for mac is known to support gyp.

## Solution

Use [CMake](https://cmake.org/) to build node on [CLion](https://www.jetbrains.com/clion/).

## Instructions

1. install [Xcode](https://developer.apple.com/xcode/)
1. [clone](https://github.com/nodejs/node/blob/master/doc/guides/contributing/pull-requests.md#step-1-fork) your node fork
1. `cd node`
1. `npm install -g node-cmake-generator`
1. run `node-cmake-generator`
1. open the project in CLion
1. build the *node* target<br />
![](http://i.imgur.com/DRMY8Oj.png)
1. enjoy :)

## Troubleshoot

By default CLion runs CMake with a `-j 4` flag in order to reduce build time by running 4 compilation jobs concurrently.
For some reason, the *icudata__icutrim* target fails to build if running concurrenlty. 
One option is run CMake with a `-j 1` flag:<br />
*Preferences -> Build, Execution, Deployment -> CMake -> Build options*:<br />
![](http://i.imgur.com/7UeB7MN.png)
An alternative is to build the *icudata__icutrim* target independently and only then build the *node* target.

## Supported versions

* node: 8.7.0, 8.9.0, 8.9.4, 12.0.0, 10.15.4
* macOS: Sierra 10.12.4, High Sierra 10.13.3, 10.13.6
* CLion: 2017.1.3, 2017.3, 2018.1, 2019.1
* CMake: 3.7.2, 3.9.4, 3.10.2, 3.13.4

## Issues regarding node's build system
* https://github.com/nodejs/NG/issues/24
* https://github.com/nodejs/node/issues/12425
