#!/bin/bash

#set -x

command -v pandoc > /dev/null 2>&1 || { echo "This script requires pandoc to run."; exit 1; }
command -v latex > /dev/null 2>&1 || { echo "This script requires latex to run."; exit 1; }

source common.sh

LATEX_HEADER="./resources/setup.tex"
BUILD_DIR="build"

if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p "$BUILD_DIR"
fi



function file_to_listing {
	local FILE="$1"
	if [[ "$OS" == "Windows_NT" ]]; then
	    FILE=$(cygpath "$FILE")
	fi
	local BASE="$(to_base_name "$FILE")"
	local TARGET="$2"
	local SECTION="Persanalysed"
	local TITLE="Source Code"
  	local DATA="{\"section\":\"$SECTION\", \"title\":\"$TITLE\"}"
  	local HEADERS_SETUP="${BUILD_DIR}/${BASE}.setup"
	$MUSTACHE_COMMAND <(echo "$DATA") "$LATEX_HEADER" > "$HEADERS_SETUP" 
	dos2unix < "$FILE"\
	| cat <(echo -e '```CSharp\n') - <(echo -e '\n```\n') \
    | pandoc -s --listings -H "$HEADERS_SETUP" -f markdown -t latex -o "$TARGET"  
}

function process_file {
	local FILE="$1"
	if [[ "$OS" == "Windows_NT" ]]; then
		BASE_NAME="$(basename "$(cygpath "$FILE")")"
	else
		BASE_NAME="$(basename "$FILE")"
	fi
	
	TARGET_FILE="${BUILD_DIR}/${BASE_NAME}.pdf"

	if [[ -f "$TARGET_FILE" ]]; then 
		if [[ "$OVERWRITE_ALL" == true ]]; then 
	  		speakout "${RED}Overwriting '$TARGET_FILE'${NC}"
	  		file_to_listing "$FILE" "$TARGET_FILE"
		elif [[ "$DONT_OVERWRITE" == true ]]; then
	  		speakout "${RED}Skipping '$FILE'${NC}"
		else
	  		if file_exist_overwrite "$TARGET_FILE"; then
	    		speakout "${RED}Overwriting '$TARGET_FILE'${NC}"
	    		file_to_listing "$FILE" "$TARGET_FILE"
	  		else
	    		speakout "${RED}Skipping '$FILE'${NC}"
	  		fi
		fi
	else
		speakout "Processing '$FILE'"
		file_to_listing "$FILE" "$TARGET_FILE"
	fi
}

total=$#
current=1
speakout "Begin processing. $total files to process"
while (( "$#" )); do
  speakout "[ $current of $total ]"
  IN_FILE="$1"
  process_file "$IN_FILE"
  ((current++))
  shift 
done
