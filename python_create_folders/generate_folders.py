import json
import os
from pathlib import Path

input_file = 'codes.json'
downloads_dir = 'created_folders'

custom_css_content = '''@import url("https://assets.primesport.com/prod/onlc-partners.pp-shop.secutix.com/custom/custom.css");

/* SF 00331175 */
#collapsiblePanel_secondary_content_payment_modes
  .content
  .visa
  .payment_method {
  width: 80%;
  height: unset;
}

#collapsiblePanel_secondary_content_payment_modes ul li {
  list-style: none;
}

/* END */
'''

def main():
    with open(input_file, 'r') as file:
        codes = json.load(file)

    for code in codes:
        folder_name = f'ONLC_AP_{code}'
        folder_path = os.path.join(downloads_dir, folder_name)
        os.makedirs(folder_path, exist_ok=True)

        with open(os.path.join(folder_path, 'custom.css'), 'w') as css_file:
            css_file.write(custom_css_content)

        theme_properties_content = f'theme.css=/custom/ONLC_AP_{code}/custom.css?03\n'
        with open(os.path.join(folder_path, 'theme_override.properties'), 'w') as prop_file:
            prop_file.write(theme_properties_content)

    print(f"All folders and files created in: {downloads_dir}")

if __name__ == "__main__":
    main()
