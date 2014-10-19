#!/bin/bash


#set -x

command -v ffmpeg > /dev/null 2>&1 || { echo "This script requires ffmpeg to run."; exit 1; }
command -v inkscape > /dev/null 2>&1 || { echo "This script requires inkscape to run."; exit 1; }
command -v python > /dev/null 2>&1 || { echo "This script requires python to run."; exit 1; }

source common.sh

BUILD_DIR="build"
OVERLAY_TEMPLATE="./resources/overlay_template.svg"
DRAFT_OVERLAY="./resources/overlay.png"
INTRO_MOVIE="./resources/Intro.mp4"

MUSTACHE_COMMAND="./resources/mustache.py"
if [ "$(uname)" == "Darwin" ]; then
  INKSCAPE_COMMAND="/Applications/Inkscape.app/Contents/Resources/bin/inkscape"
else
  INKSCAPE_COMMAND="inkscape"
fi
LOG="$(date +%s).log"

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

function make_title_overlay {
  local FILE="$1"
  speakout "    Creating Intro"
  # Video title must be in "XXXX - XXXXXXXXXXXXX.mp4" format
  local SECTION=$(echo "$FILE" | sed 's/\([A-Z]*\)[0-9]*[a-z]* -.*/Section \1/')
  local TITLE=$(echo "$FILE" | sed 's/.*- \(.*\)\..../\1/')
  local DATA="{\"section\":\"$SECTION\", \"title\":\"$TITLE\"}"
  local OVERLAY_SVG="${BUILD_DIR}/${SECTION} - ${TITLE}.overlay.svg"
  local OVERLAY_PNG="${BUILD_DIR}/${SECTION} - ${TITLE}.overlay.png"
  
  log "DOING:: $MUSTACHE_COMMAND <(echo \"$DATA\") \"$OVERLAY_TEMPLATE\" > \"$OVERLAY_SVG\" 2>> \"$LOG\""
  $MUSTACHE_COMMAND <(echo "$DATA") "$OVERLAY_TEMPLATE" > "$OVERLAY_SVG" 2>> "$LOG"
  local status=$?
  if [ $status -ne 0 ]; then
    speakerr "Mustache command ($MUSTACHE_COMMAND) failed. See $LOG for details"
    exit 1
  fi

  log "DOING:: $INKSCAPE_COMMAND -z -e \"${OVERLAY_PNG}\" -w 1280 -h 720 \"$OVERLAY_SVG\" &>> \"$LOG\""
  $INKSCAPE_COMMAND -z -e "${OVERLAY_PNG}" -w 1280 -h 720 "$OVERLAY_SVG" >> "$LOG" 2>&1
  local status=$?
  if [ $status -ne 0 ]; then
    speakerr "Inkscape command ($INKSCAPE_COMMAND) failed. See $LOG for details"
    exit 1
  fi

  RETURNV="$OVERLAY_PNG"
}

function make_movie {
  SRC_VIDEO="$1"
  if [[ "$OS" == "Windows_NT" ]]; then
    if [[ ! -f "$(cygpath "$SRC_VIDEO")" ]]; then
      speakerr "${RED}FILE NOT FOUND: [$SRC_VIDEO]${NC}"
      exit 1
    fi 
    BASE_NAME="$(basename "$(cygpath "$SRC_VIDEO")")"
  else
    BASE_NAME="$(basename "$FILE")"
  fi
  make_title_overlay "${BASE_NAME}"
  INTRO_OVERLAY=$RETURNV
  TARGET_VIDEO="$2"

  
  speakout "    Encoding Intro with original"
  ffmpeg -y -loglevel warning -i "$INTRO_MOVIE" -i "$INTRO_OVERLAY" -i "$SRC_VIDEO" -filter_complex \
    '[0:v][1:0]overlay[intro0];
     [intro0]fade=type=out:nb_frames=30:start_frame=80[intro1];
     [2:v]fade=type=in:nb_frames=30:start_frame=0[fadein];
     [intro1][0:a][fadein][2:a]concat=n=2:v=1:a=1 [v] [a]' \
    -map '[v]' -map '[a]' -s "1280x720" "$TARGET_VIDEO" >> "$LOG" 2>&1
}

function process_file {
  FILE="$1"
  if [[ "$OS" == "Windows_NT" ]]; then
    BASE_NAME="$(basename "$(cygpath "$FILE")")"
  else
    BASE_NAME="$(basename "$FILE")"
  fi
  TARGET_FILE="${BUILD_DIR}/${BASE_NAME}"
  
  if [[ -f "$TARGET_FILE" ]]; then 
    if [[ "$OVERWRITE_ALL" == true ]]; then 
      speakout "${RED}Overwriting '$FILE'${NC}"
      make_movie "$FILE" "$TARGET_FILE"
    elif [[ "$DONT_OVERWRITE" == true ]]; then
      speakout "${RED}Skipping '$FILE'${NC}"
    else
      if file_exist_overwrite "$FILE"; then
        speakout "${RED}Overwriting '$FILE'${NC}"
        make_movie "$FILE" "$TARGET_FILE"
      else
        speakout "${RED}Skipping '$FILE'${NC}"
      fi
    fi
  else
    speakout "Processing '$FILE'"
    make_movie "$FILE" "$TARGET_FILE"
  fi
}

# function make_movie_draft {
#   FILE="$1"
#   #  -qp 18 -preset veryslow 
#   COMMAND=( ffmpeg -y -strict -2  -i "${FILE}" -i "${DRAFT_OVERLAY}" -filter_complex "overlay=0:0" -s "1280x720" "${TARGET_FILE}" )
#   "${COMMAND[@]}"
#   STATUS=$?
#   if [[ $STATUS -ne 0 ]]; then 
#     speakerr "${RED}BAILOUT: COMMAND FAILED [${COMMAND[@]}] ($STATUS)${NC}"
#     exit $STATUS
#   fi
# }

# function process_mp4s_here {
#   for FILE in *.mp4; do 
#     process_file "$FILE"
#   done
# }

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
