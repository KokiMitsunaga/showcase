import os
import sys

try:
    from rembg import remove
    from PIL import Image
except ImportError:
    print("Required packages not installed. Run: pip install rembg pillow")
    sys.exit(1)

target_dir = "public/products"

if not os.path.exists(target_dir):
    print(f"Directory {target_dir} not found.")
    sys.exit(1)

files = [f for f in os.listdir(target_dir) if f.endswith(".png")]
print(f"Processing {len(files)} images in {target_dir}...")

for file in files:
    full_path = os.path.join(target_dir, file)
    print(f"Processing {file}...")
    
    try:
        with open(full_path, "rb") as input_file:
            input_data = input_file.read()
            # Remove background
            subject = remove(input_data)
        
        # Save back to same path
        with open(full_path, "wb") as output_file:
            output_file.write(subject)
            
        print(f"Finished {file}")
    except Exception as e:
        print(f"Failed to process {file}: {e}")

print("All done.")
