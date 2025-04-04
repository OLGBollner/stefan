#include "assetManager.h"

#include <fstream>
#include <sstream>
#include <filesystem>

#include <iostream>

namespace fs = std::filesystem;

AssetManager::AssetManager()
: textures{}
{}

void AssetManager::loadAssets(std::string const& assetPath)
{
    for (auto const& file : fs::directory_iterator(assetPath))
    {
        std::string filename {file.path().string()};

        if (filename == assetPath + "textures")
        {
            for (auto const& texture : fs::directory_iterator(filename))
            {
                std::string key {texture.path().stem().string()};

                if (fs::is_regular_file(texture)) {
                    LoadTGATextureData(texture.path().string().c_str(), &textures[key]);
                }
            }
        }
    }
}

GLuint& AssetManager::getTextureID(std::string const& key)
{
    return textures[key].texID;
}

TextureData& AssetManager::getTextureData(std::string const& key)
{
    return textures[key];
}
