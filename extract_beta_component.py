import re

with open('/home/ubuntu/project/Create AI Profit index - html_files 2/index-BBRAv34j.js', 'r', errors='ignore') as f:
    content = f.read()

# Find the BetaLanding component - search for the function that contains BetaLanding.tsx references
# We know it starts with the token extraction and ends with the style tag
start_marker = 'function eY()'
end_marker = 'BetaLanding.tsx:217'

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    # Get a bit past the end marker to capture the closing
    chunk = content[start_idx:end_idx+300]
    print("=== FULL BetaLanding COMPONENT ===")
    print(chunk)
else:
    print(f"start_idx: {start_idx}, end_idx: {end_idx}")

# Also extract the token validation API call
print("\n\n=== TOKEN VALIDATION API ===")
api_pattern = r'beta.*?validate.*?{[^}]+}'
matches = re.findall(api_pattern, content[:], re.DOTALL)
for m in matches[:5]:
    if len(m) < 500:
        print(m)
        print("---")

# Extract the error messages
print("\n\n=== ERROR STATES ===")
error_pattern = r'not_found:.*?db_unavailable:[^}]+'
matches = re.findall(error_pattern, content, re.DOTALL)
for m in matches[:3]:
    print(m[:400])
    print("---")

# Extract subscription tiers
print("\n\n=== SUBSCRIPTION TIERS ===")
tier_start = content.find('"basic",name:"Basic"')
if tier_start == -1:
    tier_start = content.find('id:"basic"')
if tier_start != -1:
    print(content[tier_start-10:tier_start+800])
