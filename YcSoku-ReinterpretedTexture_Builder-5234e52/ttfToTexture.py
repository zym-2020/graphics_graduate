import math
import shutil
import matplotlib.pyplot as plt
import numpy as np
import os
import subprocess
import os.path as ospath
import json

def findAllFiles(base):
    for root, ds, fs in os.walk(base):
        for f in fs:
            yield f

def makeTriangleStrips_file(in_dir, out_dir):

    markerNameList = []
    fpathList = []
    ftriangleList = []
    fstripList = []
    
    # parse all ttf files into glyph files
    for ttfFile in findAllFiles(in_dir):
        if ttfFile[-3:] == "ttf":
            fpath = ospath.join(in_dir, ttfFile)
            # subprocess.run([prog,"-t", fpath, in_dir,"\\0-\\4096"])
            subprocess.run([prog,"-t", fpath, in_dir,"\\21414"])
            # subprocess.run([prog,"-t", fpath, in_dir, "a-z","A-Z"])
            # subprocess.run([prog,"-t", fpath, in_dir, "a-z","A-Z"])
        else:
            print("unknown input file format: " + ttfFile)
            continue

    # parse all font glyph files
    for infile in findAllFiles(in_dir):
        
        oldDir = ospath.join(in_dir, infile)
        newDir = ospath.join(out_dir, infile)
        fpath = ""          # one kind of input data format
        ftriangles = ""     # one kind of medium data format
        fstrips = ""        # one kind of medium data format
            
        if infile[-3:] == "txt":
            fpath = ospath.join(in_dir,infile)
            subprocess.run([prog,"-p",fpath])
            ftriangles = newDir + ".t.txt"
            fstrips = newDir + ".s.txt"
            
            if os.path.exists(oldDir + ".t.txt") and os.path.exists(oldDir + ".s.txt"):
                shutil.move(oldDir + ".t.txt", newDir + ".t.txt")
                shutil.move(oldDir + ".s.txt", newDir + ".s.txt")
                shutil.move(oldDir, newDir + ".p.txt")
            else: 
                os.remove(oldDir)
                continue
            
        else:
            print("unknown input file format: " + ttfFile)
            continue
        
        markerNameList.append((infile.split(".")[0]))
        fpathList.append(fpath)
        ftriangleList.append(ftriangles)
        fstripList.append(fstrips)
        
    return markerNameList, fpathList, ftriangleList, fstripList
    
def parse_triangles_data(fn):
    triangles=[]
    
    if not os.path.exists(fn):
        print("File: {} does not exist!".format(fn))
        return triangles
    
    stream = open(fn)
    bbx = stream.readline()
    bbx=[float(v) for v in bbx.split(",")];
    
    for line in stream:
        line = line.split(";")
        color = tuple([float(v) for v in line[1].split(",")])
        verts=line[2].split(",")
        verts=[v.split() for v in verts]
        verts=list(map(lambda  v:(float(v[0]),float(v[1])), verts))
        
        ix = line[3].split(",")
        ix = [int(i) for i in ix]
        
        item=(color,verts,ix)
        triangles.append(item)
    stream.close()   
    return triangles
        
def parse_strips_data(fn):
    strips=[]
    
    if not os.path.exists(fn):
        print("File: {} does not exist!".format(fn))
        return strips
    
    stream = open(fn)
    for line in stream:
        line = line.split(";")
        k=int(line[1])
        ix=line[2].split(",")
        ix = [int(i) for i in ix]
        strips.append((k,ix))
    
    stream.close()
    return strips

def createColorKey(color):
    r = chr(int(color[0] * 255.0))
    g = chr(int(color[1] * 255.0))
    b = chr(int(color[2] * 255.0))
    a = chr(int(color[3] * 255.0))
    
    return r + g + b + a

def convertPosToRGBA(posX, posY, minX, minY, length, colorIndex):
    
    if colorIndex > 15:
        print("ERROR::COLOR_INDEX::larger_than_15")
        exit(0)
    
    # normalization
    normalX = (posX - minX) / length
    normalY = (posY - minY) / length
    
    # use 4bits in rg components to store the colorIndex
    r = int(math.modf(normalX * 255.0)[0] * 255.0)
    g = int(math.modf(normalY * 255.0)[0] * 255.0)
    
    r = (r & 252) + (int(colorIndex) >> 2)      # fract_x (sacrifices 2 bits to store half of the physical length of the color index)
    g = (g & 252) + (int(colorIndex) & 3)       # fract_y (sacrifices 2 bits to store half of the physical length of the color index)
    
    r = float(r) / 255.0
    g = float(g) / 255.0
    b = math.floor(normalX * 255.0) / 255.0
    a = math.floor(normalY * 255.0) / 255.0
    
    return r, g, b, a
    
class BoundingBox:
    def __init__(self):
        self.minX = 999999.99999
        self.minY = 999999.99999
        self.maxX = -999999.99999
        self.maxY = -999999.99999
    
    def merge(self, x, y):
        self.makeFloor(x, y)
        self.makeCeil(x, y)
    
    def makeCeil(self, x, y):
        if x > self.maxX:
            self.maxX = x
        if y > self.maxY:
            self.maxY = y
            
    def makeFloor(self, x, y):
        if x < self.minX:
            self.minX = x
        if y < self.minY:
            self.minY = y
    
    def width(self):
        return self.maxX - self.minX
    
    def height(self):
        return self.maxY - self.minY
    
    def maxLength(self):
        return max(self.width(), self.height())
    
class MarkerStrip:
    def __init__(self, markerName = "", maxStripNum = 9999):
        self.name = markerName
        self.bBox = BoundingBox()
        self.verticesX = []
        self.verticesY = []
        self.verticesColor = []
        self.colorList = []
        self.originStripNum = 0
        self.maxStripNum = maxStripNum;
    
    def addStrip(self, xList, yList, color):
        self.originStripNum += 1
        if self.originStripNum > self.maxStripNum:
            print("ERROR::MARKER_STRIP::current_strip_num_larger_than_max_strip_num")
            exit(0)
        
        if self.originStripNum != 1:
            self.verticesX.append(xList[0])
            self.verticesY.append(yList[0])
            self.verticesColor.append(color)
            
        index = 0
        while index < len(xList):
            self.verticesX.append(xList[index])
            self.verticesY.append(yList[index])
            self.bBox.merge(xList[index], yList[index])
            self.verticesColor.append(color)
            
            index += 1
        
        if self.originStripNum != self.maxStripNum:
            self.verticesX.append(xList[-1])
            self.verticesY.append(yList[-1])
            self.verticesColor.append(color)
            
    def addColor(self, color):
        self.colorList.append(color[0])
        self.colorList.append(color[1])
        self.colorList.append(color[2])
        self.colorList.append(color[3])
    
    def getNumVertices(self):
        return len(self.verticesColor)
    
    def outPutAsPartofJSON(self, ID, base):
        jsonData = {}
        
        jsonData['ID'] = ID
        jsonData['name'] = self.name
        jsonData['base'] = base
        jsonData['length'] = self.getNumVertices()
        
        return jsonData

def makeStripforTBVS(markerName, rawTriangles, rawStrips):
    
    tbvsStirp = MarkerStrip(markerName, len(rawStrips))
    
    # get color set of the marker
    colorSet = set()
    for strip in rawStrips:
        path = rawTriangles[strip[0]]
        colorSet.add(path[0])

    # create palette by color set
    palette = {}
    index = 0
    for color in colorSet:
        colorKey = createColorKey(color)
        palette[colorKey] = int(index)
        
        tbvsStirp.addColor(color)
        
        index += 1

    # make markerStrip
    for strip in rawStrips:
        path = rawTriangles[strip[0]]
        
        tvs=path[1]
        pvs=[]
        for i in strip[1]:
            pvs.extend(tvs[i])
            
        x=pvs[::2]
        y=pvs[1::2]
        colorIndex = palette[createColorKey(path[0])]
        
        tbvsStirp.addStrip(x, y, colorIndex)
    
    return tbvsStirp

# ##################################################
# ##################################################
# ##################################################
# ##################################################

workSpace_path = "/Users/soku/Desktop/VTexture Toolchain"

prog = workSpace_path + "/build/bin/Debug/vtexture"
inDir= workSpace_path + "/sokuTest/input"
mediumDir = workSpace_path + "/sokuTest/medium/"
outDir = workSpace_path + "/sokuTest/output/"
outDir = "/Users/soku/Desktop/GeoScratch/Web/geoscratch_on_vue/public/"


# ##################################################
markerNameList, fPathList, fTriangleList, fStripList = makeTriangleStrips_file(inDir, mediumDir)

tbvsStrips = []
stripsJson = []
index = 0
while index < len(markerNameList):
    rawTriangles = parse_triangles_data(fTriangleList[index])
    rawStrips=parse_strips_data(fStripList[index])
    
    if len(rawTriangles) == 0 or len(rawStrips) == 0:
        continue
    
    tbvsStrips.append(makeStripforTBVS(markerNameList[index], rawTriangles, rawStrips))
    
    index += 1


textureWidth = 1024
textureHeight = 1024

paletteWidth = 16
paletteHeight = len(tbvsStrips)

stripTexels = np.zeros([textureHeight * textureWidth * 4])
paletteTexels = np.zeros([paletteHeight * paletteWidth * 4])

tIndex = 0      # record texel index in strip texture
sIndex = 0      # record marker(in format of strip) index
while sIndex < len(tbvsStrips):
    strip = tbvsStrips[sIndex]
    
    # make sure the texture is not filled
    if tIndex + strip.getNumVertices() > 1024 * 1024:
        print("Strip Texture is Filled")
        break
    
    # record description json data of this strip
    stripsJson.append(strip.outPutAsPartofJSON(sIndex, tIndex))
    
    # fill palette texture(may have unassigned texel)
    cIndex = 0
    while cIndex < len(strip.colorList):
        paletteTexels[sIndex * 16 * 4 + cIndex] = strip.colorList[cIndex]
        cIndex += 1
    
    # fill strip texture(no unassigned texel)
    baseCount = tIndex
    while tIndex - baseCount < strip.getNumVertices():  
        thisIndex = tIndex - baseCount
        stripTexels[tIndex * 4 + 0], stripTexels[tIndex * 4 + 1], stripTexels[tIndex * 4 + 2], stripTexels[tIndex * 4 + 3] = convertPosToRGBA(strip.verticesX[thisIndex], strip.verticesY[thisIndex], 
                                                                                                                    strip.bBox.minX, strip.bBox.minY, 
                                                                                                                    strip.bBox.maxLength(), strip.verticesColor[thisIndex])
        tIndex += 1
    sIndex += 1


stripTexels = stripTexels.reshape([textureHeight, textureWidth, 4])
paletteTexels = paletteTexels.reshape([paletteHeight, paletteWidth, 4])

# plt.imsave(outDir + "test.png", texels)
plt.imsave(outDir + "images/strip.png", stripTexels)
plt.imsave(outDir + "images/palette.png", paletteTexels)

outJson = {}
outJson['strip_texture'] = {'name': 'strip.png', 'width': textureWidth, 'height': textureHeight}
outJson['palette_texture'] = {'name': 'palette.png', 'width': paletteWidth, 'height': paletteHeight}
outJson['markers'] = {'count': len(tbvsStrips), 'description':stripsJson}

outFile = open(outDir + "json/tbvs.json", "w")

print(json.dumps(outJson))
json.dump(outJson, outFile, sort_keys=True)

# shutil.rmtree(mediumDir)
# os.mkdir(mediumDir)

