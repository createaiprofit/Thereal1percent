#!/usr/bin/env python3
"""Remove baby avatar showcase sections from Home.tsx while keeping the real host bots."""

with open('/home/ubuntu/one-percent-playground/client/src/pages/Home.tsx', 'r') as f:
    lines = f.readlines()

total = len(lines)
print(f"Total lines: {total}")

# Find the sections to remove
# Section 1: AVATAR ROW (baby Elon, Jeff B, etc.) - lines ~1532-1573
# Section 2: 15 BABY AVATARS STATIC GRID - lines ~1624-1630
# Section 3: 21 BABY AVATARS VOICE GRID - lines ~1631-1693
# Section 4: 15 BABY BOTS GRID - lines ~1694-1730

# We'll scan and mark ranges
remove_ranges = []

i = 0
while i < len(lines):
    line = lines[i]
    
    # Mark the AVATAR ROW section (baby Elon etc.)
    if 'AVATAR ROW: Elon' in line:
        start = i
        # Find the closing </div> for this section - look for "Mission statement" comment
        j = i + 1
        while j < len(lines):
            if 'Mission statement' in lines[j] or 'mission statement' in lines[j].lower():
                # The section ends at the </div> before this comment
                # Go back to find the closing div
                end = j - 1
                while end > start and lines[end].strip() == '':
                    end -= 1
                remove_ranges.append((start, end + 1))
                print(f"Found AVATAR ROW section: lines {start+1}-{end+1}")
                break
            j += 1
        i = j
        continue
    
    # Mark the 15 BABY AVATARS STATIC GRID
    if '15 BABY AVATARS' in line and 'STATIC' in line:
        start = i
        # Find end - look for next section comment or closing div
        j = i + 1
        depth = 0
        # Count the opening div on this line's next line
        while j < len(lines):
            if '21 BABY AVATARS' in lines[j] or '15 BABY BOTS' in lines[j]:
                remove_ranges.append((start, j))
                print(f"Found 15 BABY AVATARS STATIC: lines {start+1}-{j}")
                break
            j += 1
        i = j
        continue
    
    # Mark the 21 BABY AVATARS VOICE GRID  
    if '21 BABY AVATARS' in line and 'VOICE' in line:
        start = i
        j = i + 1
        while j < len(lines):
            if '15 BABY BOTS' in lines[j]:
                remove_ranges.append((start, j))
                print(f"Found 21 BABY AVATARS VOICE: lines {start+1}-{j}")
                break
            j += 1
        i = j
        continue
    
    # Mark the 15 BABY BOTS GRID
    if '15 BABY BOTS GRID' in line:
        start = i
        j = i + 1
        while j < len(lines):
            if 'DIVIDER' in lines[j] or '── DIVIDER' in lines[j]:
                remove_ranges.append((start, j))
                print(f"Found 15 BABY BOTS GRID: lines {start+1}-{j}")
                break
            j += 1
        i = j
        continue
    
    i += 1

print(f"Ranges to remove: {remove_ranges}")

# Build set of line indices to remove
remove_set = set()
for start, end in remove_ranges:
    for idx in range(start, end):
        remove_set.add(idx)

print(f"Lines to remove: {len(remove_set)}")

# Write the filtered file
new_lines = [line for idx, line in enumerate(lines) if idx not in remove_set]
print(f"New total lines: {len(new_lines)}")

with open('/home/ubuntu/one-percent-playground/client/src/pages/Home.tsx', 'w') as f:
    f.writelines(new_lines)

print("Done! Baby avatar sections removed.")
