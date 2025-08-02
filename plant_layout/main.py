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
        for i, row in enumerate(reader):
            placements.append({
                **row,
                "x": i % args.width,
                "y": i // args.width,
            })

    os.makedirs(args.out_dir, exist_ok=True)
    out_path = os.path.join(args.out_dir, "placement.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(placements, f)


if __name__ == "__main__":
    main()
