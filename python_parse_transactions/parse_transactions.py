import csv
import os
import re

INPUT_FOLDER = 'not_parsed'
OUTPUT_FOLDER = 'parsed'

def parse_csv(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as infile:
        reader = list(csv.reader(infile))
        output = []

        i = 0
        while i < len(reader):
            line = reader[i]
            if len(line) < 4:
                i += 1
                continue

            message = line[3]

            if "Pay with alias" in message and i + 2 < len(reader):
                line2 = reader[i + 1]
                line3 = reader[i + 2]

                if "completed successfully" in line3[3]:
                    parts = [x.strip() for x in line2[3].split('|')]
                    if len(parts) >= 7:
                        order = parts[0]
                        file_id = parts[3]
                        contact_id = parts[4]
                        email = parts[5]
                        amount = parts[6].strip()

                        output.append([file_id, order, amount, contact_id, email, "SUCCESS"])
                        i += 3
                        continue


            if "Pay with alias" in message and i + 1 < len(reader):
                line2 = reader[i + 1]
                if "Error" in line2[2] and "completed successfully" not in line2[3]:
                    order_match = re.search(r"order:(\d+)", message)
                    file_match = re.search(r"file\s+(\d{3},?\d*)", line2[3])
                    contact_match = re.search(r"contact:\s*(\d+)", message)
                    amount_match = re.search(r"amount:\s*([\d.,]+\s*\w+)", message)

                    order = order_match.group(1) if order_match else ""
                    file_id = file_match.group(1).replace(",", "") if file_match else ""
                    contact_id = contact_match.group(1) if contact_match else ""
                    amount = amount_match.group(1).strip() if amount_match else ""
                    email = ""

                    output.append([file_id, order, amount, contact_id, email, "FAIL"])
                    i += 2
                    continue

            i += 1
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    with open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        writer = csv.writer(outfile)
        writer.writerow(['fileID', 'orderNumber', 'amount', 'contactID', 'email', 'status'])
        writer.writerows(output)

    print(f"✅ Parsing complete. Output saved to: {output_file}")


def main():
    os.makedirs(OUTPUT_FOLDER, exist_ok=True)

    csv_files = [f for f in os.listdir(INPUT_FOLDER) if f.endswith('.csv')]

    if not csv_files:
        print("⚠️ No CSV files found in 'not_parsed' folder.")
        return

    for filename in csv_files:
        input_path = os.path.join(INPUT_FOLDER, filename)
        output_path = os.path.join(OUTPUT_FOLDER, f"parsed_{filename}")

        print(f"🔄 Processing: {filename}")
        try:
            parse_csv(input_path, output_path)
        except Exception as e:
            print(f"❌ Failed to process {filename}: {e}")

if __name__ == "__main__":
    main()
