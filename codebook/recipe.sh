#!/bin/bash

TEMPLATE="resources/notes-template.tex"

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
	| pandoc -s --listings --latex-engine=xelatex --template="${TEMPLATE}" -f markdown -t latex -o "${DEST}" 
}