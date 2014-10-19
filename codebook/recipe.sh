#!/bin/bash

TEMPLATE="resources/notes-template.tex"
BUILD="build"
# 1: file
# 2: title
# 3: destination file
# 4: Source language
function mkpdf {
	local FILE="$1"
	local TITLE="$2"
	local DEST="$3"
	local LANG="$4"

	dos2unix < "${FILE}" \
	| cat <(echo -e "---\ntitle: ${TITLE}\n---\n\`\`\`${LANG}") - <(echo -e '\n```\n') \
	| pandoc -s --listings --latex-engine=xelatex --template="${TEMPLATE}" -f markdown -t latex -o "${BUILD}/${DEST}" 
}

for f in `cat ../manifest-exclusive.txt` ; do 
	EXT="${f##*.}"

	if [[ $EXT = "py" ]]; then
		LANG="Python"
	fi
	if [[ $EXT == "html" ]]; then
		LANG="HTML"
	fi
	if [[ $EXT == "css" ]]; then
		LANG="CSS"
	fi
	if [[ $EXT == "sh" ]]; then
		LANG="Shell"
	fi
	if [[ $EXT == "json" ]]; then
		LANG="Javascript"
	fi
	if [[ $EXT == "js" ]]; then
		LANG="Javascript"
	fi
	echo mkpdf "../$f" "$(basename $f)" "$(basename $f).pdf" $LANG;
	mkpdf "../$f" "$(basename $f)" "$(basename $f).pdf" $LANG
done

# cd ${BUILD}; pdftk *.pdf cat output book.pdf