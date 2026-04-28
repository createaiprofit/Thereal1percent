import json, re

with open('/tmp/voice_map.json') as f:
    voice_map = json.load(f)

with open('/home/ubuntu/createaiprofit/client/src/data/bots.ts') as f:
    content = f.read()

# Find all bot entries
bots = re.findall(r'name: "([^"]+)"[^}]*?title: "([^"]+)"[^}]*?voice: "([^"]+)"[^}]*?voiceId: "([^"]+)"[^}]*?group: "([^"]+)"', content, re.DOTALL)

header = "{:<25} {:<25} {:<12} {:<35} {:<8}".format("Name", "Title", "EL Gender", "EL Voice Name", "Group")
print(header)
print('-' * 110)
for name, title, voice, vid, group in bots:
    el = voice_map.get(vid, {})
    el_gender = el.get('gender', 'NOT IN ACCT')
    el_name = el.get('name', 'NOT FOUND')
    flag = ' <<< WRONG: MALE VOICE' if el_gender == 'male' else ''
    row = "{:<25} {:<25} {:<12} {:<35} {:<8}{}".format(name, title, el_gender, el_name, group, flag)
    print(row)
