import { createConnection } from 'mysql2/promise';

const conn = await createConnection(process.env.DATABASE_URL);

const statements = [
  `CREATE TABLE IF NOT EXISTS \`call_logs\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`botName\` varchar(100) NOT NULL,
    \`botVoice\` varchar(100),
    \`toNumber\` varchar(30) NOT NULL,
    \`fromNumber\` varchar(30),
    \`twilioSid\` varchar(64),
    \`outcome\` enum('connected','voicemail','no_answer','interested','assigned','rejected','error') DEFAULT 'connected',
    \`durationSeconds\` int,
    \`scriptUsed\` text,
    \`dealId\` int,
    \`calledAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`call_logs_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`deals\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`propertyAddress\` varchar(500) NOT NULL,
    \`ownerName\` varchar(200),
    \`ownerPhone\` varchar(30),
    \`stage\` enum('cold','pitched','negotiating','assigned','closed','lost') NOT NULL DEFAULT 'cold',
    \`assignedBotName\` varchar(100),
    \`feeProjected\` decimal(12,2),
    \`feeCollected\` decimal(12,2),
    \`notes\` text,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    \`updatedAt\` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT \`deals_id\` PRIMARY KEY(\`id\`)
  )`,
  `CREATE TABLE IF NOT EXISTS \`war_room_alerts\` (
    \`id\` int AUTO_INCREMENT NOT NULL,
    \`type\` enum('deal_milestone','bot_low','fee_collected','finance_approved','system','call_placed','call_connected') NOT NULL,
    \`title\` varchar(200) NOT NULL,
    \`message\` text NOT NULL,
    \`severity\` enum('info','warning','critical') NOT NULL DEFAULT 'info',
    \`read\` boolean NOT NULL DEFAULT false,
    \`relatedDealId\` int,
    \`createdAt\` timestamp NOT NULL DEFAULT (now()),
    CONSTRAINT \`war_room_alerts_id\` PRIMARY KEY(\`id\`)
  )`,
];

for (const sql of statements) {
  try {
    await conn.execute(sql);
    const tableName = sql.match(/CREATE TABLE IF NOT EXISTS `(\w+)`/)[1];
    console.log(`✓ ${tableName} created`);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

// Seed the two Twilio test calls
const sofiaScript = `Hello, this is Sofia with CreateAIProfit. I am a local investment specialist and I just closed two deals in your area. I noticed your property and wanted to reach out personally. Have you ever considered cashing out at today's market prices? With current cap rates, you may be sitting on serious equity you have not tapped yet. I can walk you through the numbers — no pressure, no obligation. Would you have five minutes to chat about what your property is worth right now? Thank you so much for your time. Have a wonderful day.`;

const hammerScript = `This is Lorenzo Prada. Chief Investment Officer. I do not make many calls — but when I do, it is because the numbers are serious. I have been watching your market. Your property is sitting on equity that most owners never touch. I am not here to waste your time. I am here because the window is open right now and it will not stay open. If you want to know what your property is actually worth in today's market — call me back. Lorenzo Prada. CreateAIProfit. The number is eight seven seven, five one six, four two five nine. That is all.`;

await conn.execute(
  `INSERT INTO call_logs (botName, botVoice, toNumber, fromNumber, twilioSid, outcome, scriptUsed, calledAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ['Sofia Alves', 'Polly.Joanna', '+16615199067', '+18775164259', 'CA248f822af3316795d28e791f5804cc83', 'connected', sofiaScript, new Date('2026-04-03T07:40:00Z')]
);
console.log('✓ Sofia call log seeded');

await conn.execute(
  `INSERT INTO call_logs (botName, botVoice, toNumber, fromNumber, twilioSid, outcome, scriptUsed, calledAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  ['Lorenzo Prada (The Hammer)', 'ElevenLabs-yowh82B72eMNrxcxHgBh', '+16615199067', '+18775164259', 'CA7252f6b6b3558867504d727d24cd1a1c', 'connected', hammerScript, new Date('2026-04-03T07:45:00Z')]
);
console.log('✓ Hammer call log seeded');

// Seed alerts for both calls
await conn.execute(
  `INSERT INTO war_room_alerts (type, title, message, severity) VALUES (?, ?, ?, ?)`,
  ['call_placed', 'Sofia Alves — Call Placed', 'Sofia Alves placed an outbound call to (661) 519-9067. Twilio SID: CA248f822af3316795d28e791f5804cc83. Status: Connected.', 'info']
);

await conn.execute(
  `INSERT INTO war_room_alerts (type, title, message, severity) VALUES (?, ?, ?, ?)`,
  ['call_connected', 'Lorenzo Prada (The Hammer) — Call Connected', 'The Hammer placed an outbound call to (661) 519-9067 using ElevenLabs voice. Twilio SID: CA7252f6b6b3558867504d727d24cd1a1c. Status: Connected. ElevenLabs audio confirmed.', 'info']
);
console.log('✓ Alerts seeded for both calls');

await conn.end();
console.log('\n✅ Migration and seed complete.');
