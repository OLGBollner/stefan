#ifndef ASSETMANAGER_H
#define ASSETMANAGER_H

#include "LoadTGA.h"
#include "LittleOBJLoader.h"

#include <map>
#include <string>

class AssetManager
{
public:
    AssetManager();
    
    GLuint& getTextureID(std::string const&);
    TextureData& getTextureData(std::string const&);

    void loadAssets(std::string const&);

private:
    std::map<std::string, TextureData> textures;
};

#endif //ASSETMANAGER_H
