import numpy as np, random
from PIL import Image
import math
import random
# the colorsys module is required for color conversion
from colorsys import hsv_to_rgb
 
dX, dY = 512, 512
xArray = np.linspace(0.0, 1.0, dX).reshape((1, dX, 1))
yArray = np.linspace(0.0, 1.0, dY).reshape((dY, 1, 1))




def randColor():
    """Returns a np.array([[[0.123, 0.123, 0.123]]])"""
    return np.array([random.random(), random.random(), random.random()]).reshape((1, 1, 3))

def getX(): 
  return xArray

def getY(): 
  return yArray

def safeDivide(a, b):
    return np.divide(a, np.maximum(b, 0.001))
 

 
 
# the theory for this colour generator was taken from;
# http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
def pretty_colours(how_many):
    """uses golden ratio to create pleasant/pretty colours
    returns in rgb form"""
    golden_ratio_conjugate = (1 + math.sqrt(5)) / 2
    hue = random.random()  # use random start value
    final_colours = []
    for tmp in range(how_many):
        hue += golden_ratio_conjugate * (tmp / (5 * random.random()))
        hue = hue % 1
        temp_c = [x for x in hsv_to_rgb(hue, 0.5, 0.95)]
        final_colours.append(temp_c)
    # originally returned ['rgb(123,123,123)', 'rgb(123,123,123)']
    # now [[0.123,0.123,0.123],[0.123,0.123,0.123]]
    return final_colours
  
  
def pretty_colour():
    golden_ratio_conjugate = (1 + math.sqrt(5)) / 2
    hue = random.random()  # use random start value
    hue += golden_ratio_conjugate * (1 / (5 * random.random()))
    hue = hue % 1
    final_colour = [round(x * 256) for x in hsv_to_rgb(hue, 0.5, 0.95)]
    return final_colour
  

colour_list = pretty_colours(5)  


def randColorFromList():
  return np.array(random.choice(colour_list)).reshape((1, 1, 3))

functions = [(0, randColorFromList),
             (0, getX),
             (0, getY),
             (1, np.sin),
             (1, np.cos),
             (2, np.add),
             (2, np.subtract),
             (2, np.multiply),
             (2, safeDivide)]

depthMin = 2
depthMax = 10
 
def buildImg(depth = 0):
    funcs = [f for f in functions if
                (f[0] > 0 and depth < depthMax) or
                (f[0] == 0 and depth >= depthMin)]
    print(depth, funcs)
    nArgs, func = random.choice(funcs)
    arg_index_list = range(nArgs)
    args = [buildImg(depth + 1) for n in arg_index_list]
    return func(*args)

  
def make_image(filename):
	print("creating %s"%filename)
	img = buildImg()
 
	# Ensure it has the right dimensions, dX by dY by 3
	img = np.tile(img, (dX / img.shape[0], dY / img.shape[1], 3 / img.shape[2]))
	 
	# Convert to 8-bit, send to PIL and save
	img8Bit = np.uint8(np.rint(img.clip(0.0, 1.0) * 255.0))

	Image.fromarray(img8Bit).save(filename)
    
for i in range(1):
  make_image("output_%d.jpg"%i)





