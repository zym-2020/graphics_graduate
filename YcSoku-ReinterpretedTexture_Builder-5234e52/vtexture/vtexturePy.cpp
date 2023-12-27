#include <stdio.h>
#include <stdlib.h>
#include "VTextureBuild.h"
#include "FreeTypeExport.h"

int main(int argc,char* argv[])
{
    char* type = argv[1];
    if(argc>1)
    {
        if(strcmp(type,"--svg")==0||strcmp(type,"-s")==0)
        {
            vt::VTextureBuild build;
            char* fn = argv[2];
            printf("svg:%s\n",fn);
            build.parseSVG(fn);
            build.build();
            build.write(fn);
        }
        else
        if(strcmp(type,"--path")==0||strcmp(type,"-p")==0)
        {
            vt::VTextureBuild build;
            char* fn = argv[2];
            printf("path:%s\n",fn);
            build.load_paths_file(fn);
            build.build();
            build.write(fn,false);
        } 
        else
        if(strcmp(type,"-ttf")==0||strcmp(type,"-t")==0)
        {
           vt::FreeTypeExport ext;
           char* fn = argv[2];
           char* outpath=argv[3];
           ext.init(fn,outpath,32);
           for(int i=4;i<argc;i++)
           {
             printf("ttf:%s,%s\n",fn,argv[i]);
             ext.export_plus(argv[i]);
           }
        }      
    }
    else
    {
        // vt::VTextureBuild build;
        // const char* fn="/Users/laowine/Library/Mobile Documents/com~apple~CloudDocs/code/VTexture/dat/amenity_court.svg";
        // build.parseSVG(fn);
        // build.build();
        // build.write(fn,false);
        vt::FreeTypeExport exp;
        exp.init("/Users/laowine-x/Library/Mobile Documents/com~apple~CloudDocs/code/VTexture/dat/Wingdings.ttf","/Users/laowine-x/Library/Mobile Documents/com~apple~CloudDocs/code/VTexture/dat/",32);
        exp.export_plus("a-c");
        //exp.export_glyph(L'l');
    }
}