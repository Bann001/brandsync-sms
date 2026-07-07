/**
 * BRAND-SYNC: CLOUD SCHEDULER (v1.0)
 * -------------------------------------------
 * This script is executed by GitHub Actions to process scheduled SMS messages
 * even when the BrandSync dashboard is closed.
 */

const GITHUB_TOKEN = process.env.BS_GH_TOKEN;
const GIST_ID = process.env.BS_GIST_ID;
const PHILSMS_TOKEN = process.env.BS_PHILSMS_TOKEN;
const DB_FILENAME = 'brandsync_db.json';

if (!GITHUB_TOKEN || !GIST_ID || !PHILSMS_TOKEN) {
    console.error('❌ ERROR: Missing required environment variables (BS_GH_TOKEN, BS_GIST_ID, BS_PHILSMS_TOKEN)');
    process.exit(1);
}

const PHILSMS_URL = 'https://dashboard.philsms.com/api/v3/sms/send';

/**
 * Fetch DB from Gist
 */
async function getGistDB() {
    console.log(`--- Fetching Gist Database [${GIST_ID}] ---`);
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    });

    if (!res.ok) throw new Error(`GitHub API Error: ${res.status} ${res.statusText}`);
    const gist = await res.json();
    
    if (!gist.files[DB_FILENAME]) {
        throw new Error(`Critical Error: ${DB_FILENAME} not found in Gist!`);
    }

    return JSON.parse(gist.files[DB_FILENAME].content);
}

/**
 * Update Gist DB
 */
async function updateGistDB(db) {
    console.log(`--- Persisting UI Updates to Gist ---`);
    const res = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            files: {
                [DB_FILENAME]: {
                    content: JSON.stringify(db, null, 2)
                }
            }
        })
    });

    if (!res.ok) throw new Error(`GitHub Save Error: ${res.status} ${res.statusText}`);
    console.log('✅ Gist Database Synchronized Successfully.');
}

/**
 * Parse Spintax {a|b|c}
 */
function parseSpintax(text) {
    const matches = text.match(/\{([^{}]+)\}/g);
    if (!matches) return text;
    let parsed = text;
    matches.forEach(match => {
        const options = match.substring(1, match.length - 1).split('|');
        parsed = parsed.replace(match, options[Math.floor(Math.random() * options.length)]);
    });
    return parsed;
}

/**
 * Send SMS via PhilSMS
 */
async function sendSMS(senderId, recipient, message) {
    // Parse spintax before sending
    const parsedMessage = parseSpintax(message);
    
    // Standardize number
    let target = recipient.replace(/[^0-9]/g, '');
    if (target.startsWith('09')) target = '63' + target.substring(1);
    else if (target.startsWith('9')) target = '63' + target;

    console.log(`[PhilSMS] Dispatching to ${target}...`);
    
    const res = await fetch(PHILSMS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${PHILSMS_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            sender_id: senderId || 'PhilSMS',
            recipient: target,
            message: parsedMessage,
            type: 'plain'
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(`PhilSMS API Error: ${err}`);
    }

    const data = await res.json();
    return data;
}

/**
 * Main Run Loop
 */
async function run() {
    try {
        const db = await getGistDB();
        
        // EMERGENCY FAILSAFE CHECK: If the web app has triggered the kill-switch,
        // do NOT process any messages. Exit immediately.
        if (db.brandsync_failsafe === true) {
            console.log('🛑 EMERGENCY FAILSAFE IS ACTIVE. Cloud Scheduler will NOT dispatch any messages.');
            console.log('To resume, disable the Failsafe from the BrandSync dashboard header.');
            return;
        }

        // The web app stores scheduled messages in 'brandsync_scheduled_messages'
        let schedules = db.brandsync_scheduled_messages || [];
        if (!Array.isArray(schedules) && Array.isArray(db)) schedules = db;

        const now = new Date();
        let changed = false;
        let processedCount = 0;

        console.log(`Found ${schedules.length} total schedules. Checking for due tasks...`);

        for (const msg of schedules) {
            if (msg.status === 'pending') {
                const scheduleDate = new Date(msg.scheduleTime);
                
                if (scheduleDate <= now) {
                    console.log(`🚀 PROCESSING DUE MESSAGE: ${msg.id} (Scheduled for ${msg.scheduleTime})`);
                    
                    try {
                        // Handle multiple recipients
                        const recipients = Array.isArray(msg.recipients) ? msg.recipients : [msg.recipients];
                        for (const r of recipients) {
                            await sendSMS(msg.senderId, r, msg.message);
                        }
                        
                        msg.status = 'sent';
                        msg.sentAt = new Date().toISOString();
                        msg.cloud_dispatched = true;
                    } catch (dispatchErr) {
                        console.error(`❌ FAILED TO DISPATCH: ${msg.id}`, dispatchErr.message);
                        msg.status = 'failed';
                        msg.error = dispatchErr.message;
                    }
                    
                    changed = true;
                    processedCount++;
                }
            }
        }

        if (changed) {
            console.log(`Processing complete. ${processedCount} messages updated. Saving to cloud...`);
            await updateGistDB(db);
        } else {
            console.log('No due messages found. Sleeping.');
        }

    } catch (err) {
        console.error('CRITICAL RUNTIME ERROR:', err.message);
        process.exit(1);
    }
}

run();
