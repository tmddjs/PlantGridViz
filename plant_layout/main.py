import argparse
import csv
import json
import os


def main():
    parser = argparse.ArgumentParser(description="Simple grid layout for plants")
    parser.add_argument("width", type=int)
    parser.add_argument("height", type=int)
    parser.add_argument("csv_path")
    parser.add_argument("--out", required=True, dest="out_dir")
    args = parser.parse_args()

    placements = []
    with open(args.csv_path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        fieldnames = list(reader.fieldnames or [])
        for i, row in enumerate(reader):
            placements.append({
                **row,
                "x": i % args.width,
                "y": i // args.width,
            })

    os.makedirs(args.out_dir, exist_ok=True)

    # existing JSON output for debugging/compatibility
    json_path = os.path.join(args.out_dir, "placement.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(placements, f)

    # VLA expects a CSV file describing the layout
    vla_path = os.path.join(args.out_dir, "layout.csv")
    with open(vla_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames + ["x", "y"])
        writer.writeheader()
        writer.writerows(placements)


if __name__ == "__main__":
    main()
