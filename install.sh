#!/bin/sh

find . ! -path "*/node_modules/*" -name "package.json" -execdir npm install \;