import os
import sys
import mcschematic

ICACHE_LINE_COLS = 16
SERIAL_ROWS = 4
INSTRUCTIONS_PER_ROW = 64
MAX_DEPTH_ROWS = 32
BARREL_HEIGHT = 8


class BARREL:
    """Barrel SS values for MC 1.21.5+. Uses lowercase 'count' which is required for 1.21.5+."""
    _barrelSS = [
        """minecraft:barrel[open=false,facing=up]{CustomName:'0',Items:[{count:0b,Slot:0b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'1',Items:[{count:1b,Slot:0b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'2',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:60b,Slot:1b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'3',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:55b,Slot:3b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'4',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:51b,Slot:5b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'5',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:46b,Slot:7b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'6',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:42b,Slot:9b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'7',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:37b,Slot:11b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'8',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:32b,Slot:13b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'9',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:28b,Slot:15b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'10',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:23b,Slot:17b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'11',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:64b,Slot:17b,id:"minecraft:redstone"},{count:64b,Slot:18b,id:"minecraft:redstone"},{count:19b,Slot:19b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'12',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:64b,Slot:17b,id:"minecraft:redstone"},{count:64b,Slot:18b,id:"minecraft:redstone"},{count:64b,Slot:19b,id:"minecraft:redstone"},{count:64b,Slot:20b,id:"minecraft:redstone"},{count:14b,Slot:21b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'13',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:64b,Slot:17b,id:"minecraft:redstone"},{count:64b,Slot:18b,id:"minecraft:redstone"},{count:64b,Slot:19b,id:"minecraft:redstone"},{count:64b,Slot:20b,id:"minecraft:redstone"},{count:64b,Slot:21b,id:"minecraft:redstone"},{count:64b,Slot:22b,id:"minecraft:redstone"},{count:10b,Slot:23b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'14',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:64b,Slot:17b,id:"minecraft:redstone"},{count:64b,Slot:18b,id:"minecraft:redstone"},{count:64b,Slot:19b,id:"minecraft:redstone"},{count:64b,Slot:20b,id:"minecraft:redstone"},{count:64b,Slot:21b,id:"minecraft:redstone"},{count:64b,Slot:22b,id:"minecraft:redstone"},{count:64b,Slot:23b,id:"minecraft:redstone"},{count:64b,Slot:24b,id:"minecraft:redstone"},{count:5b,Slot:25b,id:"minecraft:redstone"}]}""",
        """minecraft:barrel[open=false,facing=up]{CustomName:'15',Items:[{count:64b,Slot:0b,id:"minecraft:redstone"},{count:64b,Slot:1b,id:"minecraft:redstone"},{count:64b,Slot:2b,id:"minecraft:redstone"},{count:64b,Slot:3b,id:"minecraft:redstone"},{count:64b,Slot:4b,id:"minecraft:redstone"},{count:64b,Slot:5b,id:"minecraft:redstone"},{count:64b,Slot:6b,id:"minecraft:redstone"},{count:64b,Slot:7b,id:"minecraft:redstone"},{count:64b,Slot:8b,id:"minecraft:redstone"},{count:64b,Slot:9b,id:"minecraft:redstone"},{count:64b,Slot:10b,id:"minecraft:redstone"},{count:64b,Slot:11b,id:"minecraft:redstone"},{count:64b,Slot:12b,id:"minecraft:redstone"},{count:64b,Slot:13b,id:"minecraft:redstone"},{count:64b,Slot:14b,id:"minecraft:redstone"},{count:64b,Slot:15b,id:"minecraft:redstone"},{count:64b,Slot:16b,id:"minecraft:redstone"},{count:64b,Slot:17b,id:"minecraft:redstone"},{count:64b,Slot:18b,id:"minecraft:redstone"},{count:64b,Slot:19b,id:"minecraft:redstone"},{count:64b,Slot:20b,id:"minecraft:redstone"},{count:64b,Slot:21b,id:"minecraft:redstone"},{count:64b,Slot:22b,id:"minecraft:redstone"},{count:64b,Slot:23b,id:"minecraft:redstone"},{count:64b,Slot:24b,id:"minecraft:redstone"},{count:64b,Slot:25b,id:"minecraft:redstone"},{count:64b,Slot:26b,id:"minecraft:redstone"},{count:0b,Slot:27b,id:"minecraft:redstone"}]}""",
    ]

    @staticmethod
    def fromSS(ss: int) -> str:
        return BARREL._barrelSS[ss]


def hex_to_nori_schematic(input_file: str) -> None:
    with open(input_file, "r") as f:
        tokens = f.read().split()

    raw_bytes = [int(t, 16) for t in tokens]
    if len(raw_bytes) % 2 != 0:
        raw_bytes.append(0)

    num_instructions = len(raw_bytes) // 2
    high_bytes = [raw_bytes[i * 2] for i in range(num_instructions)]
    low_bytes = [raw_bytes[i * 2 + 1] for i in range(num_instructions)]

    num_depth_rows = (num_instructions + INSTRUCTIONS_PER_ROW - 1) // INSTRUCTIONS_PER_ROW
    if num_depth_rows > MAX_DEPTH_ROWS:
        print(
            f"Warning: {num_instructions} instructions exceed ROM capacity "
            f"({MAX_DEPTH_ROWS * INSTRUCTIONS_PER_ROW}), truncating"
        )
        num_depth_rows = MAX_DEPTH_ROWS

    total = num_depth_rows * INSTRUCTIONS_PER_ROW
    high_bytes.extend([0] * (total - len(high_bytes)))
    low_bytes.extend([0] * (total - len(low_bytes)))

    schematic = mcschematic.MCSchematic()

    for depth in range(num_depth_rows):
        for col in range(ICACHE_LINE_COLS * 2):
            if col < ICACHE_LINE_COLS:
                byte_source = low_bytes
                col_in_line = col
            else:
                byte_source = high_bytes
                col_in_line = col - ICACHE_LINE_COLS

            for barrel_y in range(BARREL_HEIGHT):
                ss = 0
                for k in range(SERIAL_ROWS):
                    byte_idx = depth * INSTRUCTIONS_PER_ROW + col_in_line + k * ICACHE_LINE_COLS
                    ss |= ((byte_source[byte_idx] >> (7 - barrel_y)) & 1) << k

                pos = (col * 2, -(barrel_y * 2) - 1, depth * 2)
                if ss > 0:
                    schematic.setBlock(pos, BARREL.fromSS(ss))
                else:
                    schematic.setBlock(pos, "white_terracotta")

    output_file = os.path.splitext(input_file)[0]
    schematic.save("", output_file, mcschematic.Version.JE_1_21_5)
    print(f"Generated {output_file}.schem: {num_instructions} instructions, {num_depth_rows} ROM row(s)")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        hex_to_nori_schematic(sys.argv[1])
    else:
        print("Usage: python romgen.py <input_file>")
