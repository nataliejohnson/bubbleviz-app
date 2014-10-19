#!/bin/bash

YELLOW="\033[1;33m"
RED="\033[1;31m"
NC="\033[0m"

function speakout {
  echo -e "$@"
}

function speakerr {
  echo -e "$@" 1>&2
}

function log {
  echo -e "$@" >> $LOG
}


function to_base_name {
	local FILE="$1"
	if [[ "$OS" == "Windows_NT" ]]; then
    	BASE_NAME="$(basename "$(cygpath "$FILE")")"
  	else
    	BASE_NAME="$(basename "$FILE")"
  	fi
  	echo "$BASE_NAME"
}