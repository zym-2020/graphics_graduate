from PIL import Image

def generate_mipmap(image_path, levels=4):
    # Open the original image
    original_image = Image.open(image_path)
    
    # Create a list to store Mipmap levels
    mipmaps = [original_image]

    # Generate Mipmap levels
    for level in range(1, levels):
        width, height = original_image.size
        width //= 2
        height //= 2
        
        # Resize the image to half of its size for the next Mipmap level
        mipmap_image = original_image.resize((width, height), Image.ANTIALIAS)
        
        # Append the Mipmap level to the list
        mipmaps.append(mipmap_image)

        # Update the original image for the next iteration
        original_image = mipmap_image

    return mipmaps

def save_mipmap_images(mipmaps, output_folder='mipmaps'):
    # Save each Mipmap level as a separate image
    for i, mipmap_image in enumerate(mipmaps):
        mipmap_image.save(f'{output_folder}/mipmap_level_{i}.png')

if __name__ == "__main__":
    # Specify the path to the original image
    original_image_path = 'girl.png'

    # Number of Mipmap levels to generate
    num_levels = 11

    # Generate Mipmaps
    mipmaps = generate_mipmap(original_image_path, num_levels)

    # Save Mipmap images to a folder
    save_mipmap_images(mipmaps)
