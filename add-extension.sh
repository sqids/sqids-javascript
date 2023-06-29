#!/usr/bin/env bash

function addJsExtension() {
  declare file="$1"
  declare replacement="from './util.js'"
  declare file_contents
  file_contents=$(<$file)
  echo "${file_contents//from \'.\/util\'/${replacement}}" >"$file"
}

addJsExtension "esm/sqids.js"
addJsExtension "esm/sqids.d.ts"
