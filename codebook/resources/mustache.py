#!/usr/bin/env python3
import pystache
import sys
import argparse
import json

usage = """
mustache.py data.json template.mustache > output.txt
"""

parser = argparse.ArgumentParser(description="process a mustache template with some json data")
parser.add_argument("--data", metavar="data.json", help="The data file in JSON format")
parser.add_argument("--template", metavar="template.mustache", help="The template file in Mustache format")

args = parser.parse_args()

def lambda_compare_boo(text):
	csh,boo = map(lambda x: x.strip(), text.split('{{---}}'))
	return "\n".join([
		"\\begin{minipage}{\\textwidth}",
		"\\begin{minipage}[t]{245pt}",
		"\\begin{lstlisting}[language=CSharp,caption=C\#]",
		csh,
		"\end{lstlisting}\end{minipage}\hfill",
		"\\begin{minipage}[t]{245pt}",
		"\\begin{lstlisting}[language=Python,caption=Boo]",
		boo,
		"\end{lstlisting}\end{minipage}",
		"\end{minipage}"
	])

def lambda_compare_us(text):
	csh,boo = map(lambda x: x.strip(), text.split('{{---}}'))
	return "\n".join([
		"\\begin{minipage}{\\textwidth}",
		"\\begin{minipage}[t]{245pt}",
		"\\begin{lstlisting}[language=CSharp,caption=C\#]",
		csh,
		"\end{lstlisting}\end{minipage}\hfill",
		"\\begin{minipage}[t]{245pt}",
		"\\begin{lstlisting}[language=Javascript,caption=UnityScript]",
		boo,
		"\end{lstlisting}\end{minipage}",
		"\end{minipage}"
	])

lambdas = {
	'compare_boo': lambda_compare_boo,
	'compare_us': lambda_compare_us,
}

def main():
	renderer = pystache.Renderer()

	data = {}
	if args.data: 
		with open(args.data) as df:
			data = json.load(df)

	template = ""
	if args.template: 
		with open(args.template) as tf:
			data = tf.read()
	else:
		template = sys.stdin.read()


	sys.stdout.write(renderer.render(template, data, lambdas))

if __name__ == "__main__":
	main()

