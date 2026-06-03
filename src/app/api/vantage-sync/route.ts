import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "db.json");
const TMP_DB_PATH = "/tmp/db.json";

// In-memory fallback cache for serverless environments (Vercel)
let serverMemoryDb: any = { users: {} };

function readDb() {
  // 1. Try local dev database path
  try {
    if (fs.existsSync(DB_PATH)) {
      return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
    }
  } catch (e) {
    console.warn("Failed to read process.cwd db.json, trying temp file:", e);
  }

  // 2. Try temp writable database path
  try {
    if (fs.existsSync(TMP_DB_PATH)) {
      return JSON.parse(fs.readFileSync(TMP_DB_PATH, "utf-8"));
    }
  } catch (e) {
    console.warn("Failed to read /tmp db.json, falling back to memory:", e);
  }

  // 3. Fallback to in-memory store
  return serverMemoryDb;
}

function writeDb(data: any) {
  // 1. Update in-memory fallback
  serverMemoryDb = data;

  // 2. Try writing to process.cwd path (local development)
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return;
  } catch (e: any) {
    // EROFS represents Read-only file system on Vercel
    console.warn("process.cwd db.json is read-only. Trying /tmp/db.json:", e.message);
  }

  // 3. Try writing to /tmp path (Vercel serverless writable storage)
  try {
    fs.writeFileSync(TMP_DB_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (e: any) {
    console.error("Failed to write database to /tmp/db.json:", e.message);
  }
}

export async function GET() {
  try {
    const data = readDb();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database read failure, returning fallback structure:", error);
    return NextResponse.json({ users: {} });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 1. Read existing database content if it exists
    let existingData = readDb();

    // 2. Merge the users dictionary to preserve registrations
    const mergedUsers = { ...existingData.users, ...body.users };

    // 3. If a currentUser is active in the incoming save, selectively update their detailed fields
    if (body.currentUser && body.currentUser.operatorId) {
      const opId = body.currentUser.operatorId;
      mergedUsers[opId] = {
        ...mergedUsers[opId],
        ...body.users[opId],
        // Direct synchronization of active session parameters to prevent state drift
        balance: body.balance !== undefined ? body.balance : mergedUsers[opId]?.balance,
        portfolio: body.portfolio !== undefined ? body.portfolio : mergedUsers[opId]?.portfolio,
        learningXP: body.learningXP !== undefined ? body.learningXP : mergedUsers[opId]?.learningXP,
        impactPoints: body.impactPoints !== undefined ? body.impactPoints : mergedUsers[opId]?.impactPoints,
        portfolioAudit: body.portfolioAudit !== undefined ? body.portfolioAudit : mergedUsers[opId]?.portfolioAudit,
        academyDirectives: body.academyDirectives !== undefined ? body.academyDirectives : mergedUsers[opId]?.academyDirectives,
        infrastructure: body.infrastructure !== undefined ? body.infrastructure : mergedUsers[opId]?.infrastructure,
        savingsDeposited: body.savingsDeposited !== undefined ? body.savingsDeposited : mergedUsers[opId]?.savingsDeposited,
        activeLoan: body.activeLoan !== undefined ? body.activeLoan : mergedUsers[opId]?.activeLoan,
        properties: body.properties !== undefined ? body.properties : mergedUsers[opId]?.properties,
        fiscalDays: body.fiscalDays !== undefined ? body.fiscalDays : mergedUsers[opId]?.fiscalDays,
        achievements: body.achievements !== undefined ? body.achievements : mergedUsers[opId]?.achievements,
        securityScore: body.securityScore !== undefined ? body.securityScore : mergedUsers[opId]?.securityScore,
        securityProtocols: body.securityProtocols !== undefined ? body.securityProtocols : mergedUsers[opId]?.securityProtocols,
        threatLevel: body.threatLevel !== undefined ? body.threatLevel : mergedUsers[opId]?.threatLevel,
        securityAuditText: body.securityAuditText !== undefined ? body.securityAuditText : mergedUsers[opId]?.securityAuditText,
        threatLogs: body.threatLogs !== undefined ? body.threatLogs : mergedUsers[opId]?.threatLogs
      };
    }

    // 4. Construct updated database document
    const updatedData = {
      ...existingData,
      users: mergedUsers,
      // Global fallback trackers (for backwards compatibility/inspections)
      currentUser: body.currentUser || existingData.currentUser,
      isAuthenticated: body.isAuthenticated !== undefined ? body.isAuthenticated : existingData.isAuthenticated,
      balance: body.balance !== undefined ? body.balance : existingData.balance,
      portfolio: body.portfolio !== undefined ? body.portfolio : existingData.portfolio,
      learningXP: body.learningXP !== undefined ? body.learningXP : existingData.learningXP,
      impactPoints: body.impactPoints !== undefined ? body.impactPoints : existingData.impactPoints,
      portfolioAudit: body.portfolioAudit !== undefined ? body.portfolioAudit : existingData.portfolioAudit,
      academyDirectives: body.academyDirectives !== undefined ? body.academyDirectives : existingData.academyDirectives,
      infrastructure: body.infrastructure !== undefined ? body.infrastructure : existingData.infrastructure,
      savingsDeposited: body.savingsDeposited !== undefined ? body.savingsDeposited : existingData.savingsDeposited,
      activeLoan: body.activeLoan !== undefined ? body.activeLoan : existingData.activeLoan,
      properties: body.properties !== undefined ? body.properties : existingData.properties,
      fiscalDays: body.fiscalDays !== undefined ? body.fiscalDays : existingData.fiscalDays,
      achievements: body.achievements !== undefined ? body.achievements : existingData.achievements,
      securityScore: body.securityScore !== undefined ? body.securityScore : existingData.securityScore,
      securityProtocols: body.securityProtocols !== undefined ? body.securityProtocols : existingData.securityProtocols,
      threatLevel: body.threatLevel !== undefined ? body.threatLevel : existingData.threatLevel,
      securityAuditText: body.securityAuditText !== undefined ? body.securityAuditText : existingData.securityAuditText,
      threatLogs: body.threatLogs !== undefined ? body.threatLogs : existingData.threatLogs
    };

    writeDb(updatedData);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Local database write error:", error);
    return NextResponse.json({ success: false, error: "Failed to write database" });
  }
}
