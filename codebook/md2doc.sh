#!/bin/bash

#set -x

command -v pandoc > /dev/null 2>&1 || { echo "This script requires pandoc to run."; exit 1; }
command -v latex > /dev/null 2>&1 || { echo "This script requires latex to run."; exit 1; }

source common.sh

LATEX_TEMPLATE="./resources/notes-template.tex"
BUILD_DIR="build"
MUSTACHE_COMMAND="./resources/mustache.py"

if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p "$BUILD_DIR"
fi
function file_exist_overwrite {
  local FILE="$1"
  speakout "${YELLOW}File '$FILE' already exists in build directory.\nDo you want to overwrite?\n(y:Yes once) (n: No once) (Y:Yes to all) (N:No to all) (Q:Exit now)${NC}"
  read CHOICE

  case "$CHOICE" in 
    y)
      return 0
      ;;
    n)
      return 1
      ;;
    Y)
      OVERWRITE_ALL=true
      return 0
      ;;
    N)
      DONT_OVERWRITE=true
      return 1
      ;;
    Q)
      exit 0
      ;;
    *)
      file_exist_overwrite "$FILE"
  esac
}




function notes_to_pdf {
	local FILE="$1"
	if [[ "$OS" == "Windows_NT" ]]; then
	    FILE=$(cygpath "$FILE")
	fi
	local TARGET="$2"

	dos2unix < "$FILE" | pandoc -s --listings --template="$LATEX_TEMPLATE" -f markdown -t latex -o "$TARGET"  
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
	  		notes_to_pdf "$FILE" "$TARGET_FILE"
		elif [[ "$DONT_OVERWRITE" == true ]]; then
	  		speakout "${RED}Skipping '$FILE'${NC}"
		else
	  		if file_exist_overwrite "$TARGET_FILE"; then
	    		speakout "${RED}Overwriting '$TARGET_FILE'${NC}"
	    		notes_to_pdf "$FILE" "$TARGET_FILE"
	  		else
	    		speakout "${RED}Skipping '$FILE'${NC}"
	  		fi
		fi
	else
		speakout "Processing '$FILE'"
		notes_to_pdf "$FILE" "$TARGET_FILE"
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
