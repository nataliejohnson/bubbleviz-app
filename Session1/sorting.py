from PIL import Image
import numpy as np
import random

nValues = 100


def grayscaleMap(value):
	return (int(value*256), int(value*256), int(value*256))

def naivecolormap(value):
  """ value from 0 to 0xffffff """
  # value2pixel(0.5) -> (0.5,0.5,0.5)
  red =   (value & 0x00ff0000) >> 16
  green = (value & 0x0000ff00) >> 8
  blue =  (value & 0x000000ff) >> 0
  
  return (int(red), int(green), int(blue)) # rgb

value2pixel = grayscaleMap
  
initial_values = [random.random() for n in range(nValues)]

# http://www.sorting-algorithms.com/

def swap(originalList, ia, ib): # -> []
  # swap([0,1,2,3,4,5], 0, 5)
  # > [5,1,2,3,4,0]
  myList = originalList[:]
  temp = myList[ib]
  myList[ib] = myList[ia]
  myList[ia] = temp
  return myList

# bubble_sort -> [[],[],...]
def bubble_sort(initial):
	image_data = []
	image_data.append(initial)
	row = initial
	swapped = True
	while swapped:
		swapped = False
		for n in range(len(row)-1):
			if row[n] > row[n+1]:
				swapped = True
				# new_row = [3,7,1,2,6]
				new_row  = swap(row, n, n+1)
				image_data.append(new_row)
				row = new_row
	return image_data

def selection_sort(initial):
	image_data = []
	image_data.append(initial)
	
	
iterations = bubble_sort(initial_values)

pixels = []
for row in iterations:
  for v in row:
    pixels.append(value2pixel(v))


print("it took %d operations"%len(iterations))

im= Image.new('RGB', (nValues, len(iterations)))
im.putdata(pixels)
im.save('test.png')